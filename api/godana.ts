import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';
import { sendGodanaEmail } from './_lib/email';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, phone, email, amount, payment_id } = req.body || {};

  if (!name || !phone || !email || !payment_id) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, phone, email, payment_id'
    });
  }

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }

  if (!supabase) {
    return res.status(503).json({ success: false, error: 'Database not configured on server.' });
  }

  try {
    // Check for duplicate payment (idempotency)
    const { data: existing } = await supabase
      .from('godana_payments')
      .select('id')
      .eq('payment_id', payment_id)
      .maybeSingle();

    if (existing) {
      console.log('[godana] Duplicate payment detected, returning existing record:', payment_id);
      return res.status(200).json({ success: true, message: 'Godana payment already recorded' });
    }

    const { error: insertError } = await supabase
      .from('godana_payments')
      .insert([{
        name,
        phone,
        email,
        amount: Number(amount),
        payment_id,
        status: req.body.status || 'Confirmed'
      }]);

    if (insertError) throw insertError;

    console.log('[godana] Payment saved for:', name, '₹' + amount);

    // Send confirmation email in background — do NOT let email failure block the response
    sendGodanaEmail(name, email, Number(amount)).catch((emailErr) => {
      console.error('[godana] Email send failed (non-fatal):', emailErr);
    });

    return res.status(201).json({ success: true, message: 'Godana payment saved successfully' });
  } catch (error: any) {
    console.error('[godana] Error handling Godana payment:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
