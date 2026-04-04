import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';
import { sendSevaEmail } from './_lib/email';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { userDetails, seva, poojaDetails } = req.body || {};

  if (!userDetails || !seva || !poojaDetails) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: userDetails, seva, poojaDetails'
    });
  }

  if (!supabase) {
    return res.status(503).json({ success: false, error: 'Database not configured on server.' });
  }

  const transactionId = poojaDetails.transactionId || null;

  try {
    // Check for duplicate payment ID
    if (transactionId) {
      const { data: existing } = await supabase
        .from('bookings')
        .select('id')
        .eq('transaction_id', transactionId)
        .maybeSingle();

      if (existing) {
        console.log('[bookings] Duplicate transaction_id detected:', transactionId);
        return res.status(200).json({ success: true, message: 'Booking already recorded' });
      }
    }

    const { error: insertError } = await supabase
      .from('bookings')
      .insert([{
        name: userDetails.name,
        phone: userDetails.phone,
        email: userDetails.email,
        address: userDetails.address,
        seva_id: seva.id,
        seva_name: seva.name,
        seva_price: seva.price,
        date: poojaDetails.date,
        gothra: poojaDetails.gothra || null,
        nakshathra: poojaDetails.nakshathra || null,
        rashi: poojaDetails.rashi || null,
        vedha: poojaDetails.vedha || null,
        count: poojaDetails.count || 1,
        total_price: seva.price * (poojaDetails.count || 1),
        payment_status: req.body.payment_status || poojaDetails.payment_status || 'Pending Verification',
        message: poojaDetails.message || null,
        transaction_id: transactionId
      }]);

    if (insertError) throw insertError;

    console.log('[bookings] Booking saved for:', userDetails.name, '-', seva.name);

    // Send confirmation email in background — do NOT let email failure block the response
    sendSevaEmail(userDetails, seva, poojaDetails).catch((emailErr) => {
      console.error('[bookings] Email send failed (non-fatal):', emailErr);
    });

    return res.status(201).json({ success: true, message: 'Booking saved successfully' });
  } catch (error: any) {
    console.error('[bookings] Error handling booking:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
