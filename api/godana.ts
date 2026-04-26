import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';
import { sendGodanaEmail } from './_lib/email';
import crypto from 'crypto';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, phone, email, amount, payment_id, razorpay_order_id, razorpay_signature } = req.body || {};

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
    // 1. SECURITY CHECK: Verify Razorpay Signature
    // Godana uses the Godana Account Secret
    const secret = process.env.RAZORPAY_GODANA_KEY_SECRET || '';

    if (payment_id.startsWith('pay_')) {
      if (secret && razorpay_order_id && razorpay_signature) {
        const body = `${razorpay_order_id}|${payment_id}`;
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(body)
          .digest('hex');

        if (expectedSignature !== razorpay_signature) {
          console.error('[godana] SECURITY ALERT: Invalid Razorpay signature');
          return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
        }
        console.log('[godana] Razorpay signature verified successfully.');
      } else {
        console.log('[godana] Warning: Proceeding without strict signature verification (mobile redirect scenario or missing keys).');
      }
    }

    // 2. CHECK FOR DUPLICATES
    const { data: existing } = await supabase
      .from('godana_payments')
      .select('id')
      .eq('payment_id', payment_id)
      .maybeSingle();

    if (existing) {
      console.log('[godana] Duplicate payment detected:', payment_id);
      return res.status(200).json({ success: true, message: 'Godana payment already recorded' });
    }

    // 3. INSERT INTO DATABASE
    console.log('[godana] Inserting into Supabase...');
    const { error: insertError } = await supabase
      .from('godana_payments')
      .insert([{
        name: name,
        phone: phone,
        email: email || null,
        amount: Number(amount),
        payment_id: payment_id,
        status: "Confirmed"
      }]);

    if (insertError) {
      console.error('[godana] Supabase Insert Error:', insertError);
      throw insertError;
    }

    console.log(`[godana] Payment stored successfully for ${name} (₹${amount})`);

    // 4. SEND EMAIL
    sendGodanaEmail(name, email, Number(amount)).catch((emailErr) => {
      console.error('[godana] Email send failed (non-fatal):', emailErr);
    });

    return res.status(201).json({ success: true, message: 'Payment stored successfully', payment_id });
  } catch (error: any) {
    console.error('[godana] Error handling Godana payment:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      message: 'Error storing payment'
    });
  }
}
