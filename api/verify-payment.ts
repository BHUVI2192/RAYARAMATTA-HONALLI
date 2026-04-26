import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { supabase } from './_lib/supabase';
import Razorpay from 'razorpay';
import { sendDonationEmail, sendGodanaEmail, sendSevaEmail } from './_lib/email';
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
  
  // Support for multiple Razorpay accounts
  const secret = (type === 'godana' && process.env.RAZORPAY_GODANA_KEY_SECRET) 
    ? process.env.RAZORPAY_GODANA_KEY_SECRET 
    : (process.env.RAZORPAY_KEY_SECRET || '');

  if (!secret) {
    console.error(`[verify-payment] Razorpay secret not set for type: ${type}`);
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
      
      try {
        // ── INSERT TO SUPABASE BASED ON TYPE ──────
        if (type === 'godana') {
          const { error } = await supabase!
            .from('godana_payments')
            .insert([{
              name: name,
              phone: phone,
              email: email || null,
              amount: Number(amount),
              payment_id: razorpay_payment_id,
              status: "Confirmed"
            }]);
          if (error) throw error;
          
          // Send Success Email
          if (email) {
            sendGodanaEmail(name, email, Number(amount)).catch(err => console.error('[verify-payment] Email failed:', err));
          }
        } 
        else if (type === 'donation') {
          const { error } = await supabase!
            .from('donations')
            .insert([{
              name: name,
              phone: phone,
              email: email || null,
              amount: Number(amount),
              payment_id: razorpay_payment_id,
              status: "Confirmed"
            }]);
          if (error) throw error;

          // Send Success Email
          if (email) {
            sendDonationEmail(name, email, Number(amount)).catch(err => console.error('[verify-payment] Email failed:', err));
          }
        }
        else if (type === 'seva') {
          // Note: Seva bookings have complex fields. 
          // If they aren't provided in the verify-payment call, we might rely on the bookings.ts call.
          // However, we can at least record the payment here.
          console.log('[verify-payment] Seva payment verified. Recording to bookings...');
          const { error } = await supabase!
            .from('bookings')
            .insert([{
              name: name,
              phone: phone,
              email: email || null,
              amount: Number(amount),
              transaction_id: razorpay_payment_id,
              payment_status: 'Confirmed',
              seva_name: req.body.seva_name || 'Seva Booking'
            }]);
          // We don't throw on Seva error here because bookings.ts usually handles the full insert.
          if (error) {
            console.warn('[verify-payment] Seva record insert failed (expected if handled by bookings.ts):', error.message);
          } else {
            // Send Success Email if we have enough info
            if (email && req.body.poojaDetails) {
              sendSevaEmail({ name, email, phone }, { name: req.body.seva_name || 'Seva' }, req.body.poojaDetails)
                .catch(err => console.error('[verify-payment] Seva Email failed:', err));
            }
          }
        }

        return res.status(200).json({
          success: true,
          payment_id: razorpay_payment_id,
          amount: amount,
          message: 'Payment verified and recorded.'
        });
      } catch (err: any) {
        console.error('[verify-payment] Database Error:', err);
        // If it's a duplicate key error, we can still return success
        if (err.code === '23505') {
          return res.status(200).json({ success: true, message: 'Already recorded.' });
        }
        return res.status(500).json({ success: false, error: 'Database insert failed' });
      }
    } else {
      console.warn('[verify-payment] Signature MISMATCH for payment:', razorpay_payment_id);
      return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }
  }

  // ── Path 2: Missing Signature (e.g. UPI app redirect issues) ──────
  console.log('[verify-payment] Signature missing — mobile redirect scenario:', razorpay_payment_id);
  
  try {
    const keyId = (type === 'godana' && process.env.RAZORPAY_GODANA_KEY_ID)
      ? process.env.RAZORPAY_GODANA_KEY_ID
      : (process.env.RAZORPAY_KEY_ID || '');

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: secret,
    });

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    console.log('[verify-payment] Fetched payment directly from Razorpay API:', payment.id, payment.status);

    if (payment.status === 'captured') {
        try {
          if (type === 'godana') {
            await supabase!.from('godana_payments').insert([{
              name, phone, email, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed"
            }]);
          } else if (type === 'donation') {
            await supabase!.from('donations').insert([{
              name, phone, email, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed"
            }]);
          }
          return res.status(200).json({ success: true, payment_id: razorpay_payment_id, amount: amount });
        } catch (dbErr: any) {
          if (dbErr.code === '23505') return res.status(200).json({ success: true });
          throw dbErr;
        }
    } else {
      return res.status(400).json({ success: false, message: 'Payment not captured' });
    }
  } catch (error: any) {
    console.error('[verify-payment] Razorpay API Error:', error);
    return res.status(500).json({ success: false, message: 'Verification failed' });
  }
}
