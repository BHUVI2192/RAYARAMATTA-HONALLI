import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';
import { sendDonationEmail } from './_lib/email';
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

  if (!name || !phone || !payment_id) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, phone, payment_id'
    });
  }

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }

  try {
    // 1. SECURITY CHECK: Verify Razorpay Signature
    // Donations use the Primary Account
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    
    if (payment_id.startsWith('pay_')) {
      if (secret && razorpay_order_id && razorpay_signature) {
        const body = `${razorpay_order_id}|${payment_id}`;
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(body)
          .digest('hex');

        if (expectedSignature !== razorpay_signature) {
          console.error('[donation] SECURITY ALERT: Invalid Razorpay signature');
          return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
        }
        console.log('[donation] Razorpay signature verified.');
      } else {
        console.log('[donation] Warning: Proceeding without signature verification (mobile redirect scenario or missing keys).');
      }
    }

    // 2. IDEMPOTENCY CHECK
    const { data: existing } = await supabase
      .from('donations')
      .select('id')
      .eq('payment_id', payment_id)
      .maybeSingle();

    if (existing) {
      console.log('[donation] Duplicate payment detected:', payment_id);
      return res.status(200).json({ success: true, message: 'Donation already recorded' });
    }

    // 3. DATABASE INSERT
    const { error: insertError } = await supabase
      .from('donations')
      .insert([{
        name,
        phone,
        email,
        amount: Number(amount),
        payment_id,
        status: req.body.status || 'Confirmed'
      }]);

    if (insertError) {
      console.error('[donation] Supabase insert error:', insertError);
      return res.status(500).json({ success: false, error: 'Database error. Ensure "donations" table exists.' });
    }

    console.log('[donation] General donation saved for:', name, '₹' + amount);

    // 4. CONFIRMATION EMAIL
    if (email) {
      sendDonationEmail(name, email, Number(amount)).catch((emailErr) => {
        console.error('[donation] Email send failed (non-fatal):', emailErr);
      });
    }

    return res.status(201).json({ success: true, message: 'Donation saved successfully' });
  } catch (error: any) {
    console.error('[donation] Error handling donation:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
