import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { supabase } from './_lib/supabase';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  console.log("Incoming body:", req.body);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, name, phone, email, amount } = req.body || {};
  const secret = process.env.RAZORPAY_KEY_SECRET || '';

  if (!secret) {
    console.error('[verify-payment] RAZORPAY_KEY_SECRET is not set');
    return res.status(500).json({ success: false, message: 'Payment gateway not configured. Contact admin.' });
  }

  if (!razorpay_payment_id) {
    return res.status(400).json({ success: false, message: 'Missing razorpay_payment_id' });
  }

  // ── Path 1: Standard signature verification (Desktop / inline popup) ──────
  if (razorpay_signature && razorpay_order_id) {
    console.log('[verify-payment] Verifying via HMAC signature...');
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log('Verification success');
      console.log('[verify-payment] Signature valid for payment:', razorpay_payment_id);
      
      // INSERT TO SUPABASE IF IT IS GODANA
      if (type === 'godana') {
          try {
            const { data, error } = await supabase
              .from('godana_payments')
              .insert([{
                name: name,
                phone: phone,
                email: email || null,
                amount: Number(amount),
                payment_id: razorpay_payment_id,
                status: "Confirmed"
              }])
              .select();

            console.log("Insert result:", data, error);

            if (error) throw error;
            
            return res.status(200).json({
              success: true,
              payment_id: razorpay_payment_id,
              amount: amount
            });
          } catch (err: any) {
              console.error('[verify-payment] Insert Error:', err);
              return res.status(500).json({ success: false, error: 'Database insert failed' });
          }
      }

      // Default success for non-Godana using verify-payment
      return res.status(200).json({ success: true, message: 'Payment verified via signature' });
    } else {
      console.warn('[verify-payment] Signature MISMATCH for payment:', razorpay_payment_id);
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Possible tampering detected.' });
    }
  }

  // ── Path 2: Missing Signature (e.g. UPI app redirect issues) ──────
  console.log('[verify-payment] Signature missing — mobile redirect scenario:', razorpay_payment_id);
  return res.status(400).json({ success: false, message: 'Missing payment signature' });
}
