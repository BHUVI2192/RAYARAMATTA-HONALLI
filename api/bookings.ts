import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';
import { sendSevaEmail } from './_lib/email';
import crypto from 'crypto';
import Razorpay from 'razorpay';

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
  const { razorpay_order_id, razorpay_signature } = req.body || {};

  try {
    // 1. VERIFY SIGNATURE for Razorpay payments
    // This endpoint is primarily for Seva, so we use standard keys
    const secret = process.env.RAZORPAY_KEY_SECRET || '';

    if (transactionId && transactionId.startsWith('pay_')) {
      if (secret && razorpay_order_id && razorpay_signature) {
        const body = `${razorpay_order_id}|${transactionId}`;
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(body)
          .digest('hex');

        if (expectedSignature !== razorpay_signature) {
          console.error('[bookings] CRITICAL: Invalid Razorpay signature');
          return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
        }
        console.log('[bookings] Razorpay signature verified successfully.');
      } else {
        // Fallback for UPI redirects without signature
        console.log('[bookings] Razorpay signature missing. Verifying via API fetch for:', transactionId);
        try {
          const keyId = process.env.RAZORPAY_KEY_ID || '';

          const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: secret,
          });

          const payment = await razorpay.payments.fetch(transactionId);
          console.log('[bookings] Fetched payment directly from Razorpay API:', payment.id, payment.status);

          if (payment.status !== 'captured') {
            return res.status(400).json({ success: false, message: 'Payment not captured. Verification failed.' });
          }
        } catch (error: any) {
          console.error('[bookings] Razorpay API Error during generic fetch:', error);
          return res.status(500).json({ success: false, message: 'Failed to verify payment via Razorpay API' });
        }
      }
    } else if (transactionId) {
      console.log('[bookings] Manual payment detected (UTR). Proceeding...');
    }
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
        seva_name: seva.name,
        seva_price: seva.price,
        date: poojaDetails.date,
        gothra: poojaDetails.gothra || null,
        nakshathra: poojaDetails.nakshathra || null,
        rashi: poojaDetails.rashi || null,
        vedha: poojaDetails.vedha || null,
        count: poojaDetails.count || 1,
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
