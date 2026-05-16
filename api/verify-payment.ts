import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { supabase } from './_lib/supabase';
import Razorpay from 'razorpay';
import { sendDonationEmail, sendGodanaEmail, sendSevaEmail, sendAdminPaymentNotification } from './_lib/email';
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // If it's a redirect, we shouldn't necessarily set application/json early, but it's fine
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  console.log("Incoming body:", req.body);
  console.log("Incoming query:", req.query);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  
  // Extract from body (AJAX) or query (Callback URL redirect)
  const type = req.body.type || req.query.type;
  const name = req.body.name || req.query.name;
  const phone = req.body.phone || req.query.phone;
  const email = req.body.email || req.query.email;
  const amount = req.body.amount || req.query.amount;
  const notification_id = req.body.notification_id || req.query.notification_id;
  const isRedirect = req.query.redirect === 'true';
  const redirectUrl = (req.query.redirect_url as string) || '/';

  // Helper to send response or redirect
  const sendResponse = (success: boolean, data: any) => {
    if (isRedirect) {
      const status = success ? 'success' : 'failed';
      return res.redirect(302, `${redirectUrl}?payment_status=${status}&payment_id=${razorpay_payment_id || ''}`);
    }
    return res.status(success ? 200 : 400).json({ success, ...data });
  };

  const secret = (type === 'godana' && process.env.RAZORPAY_GODANA_KEY_SECRET) 
    ? process.env.RAZORPAY_GODANA_KEY_SECRET 
    : (process.env.RAZORPAY_KEY_SECRET || '');

  if (!secret) {
    console.error(`[verify-payment] Razorpay secret not set for type: ${type}`);
    return sendResponse(false, { message: 'Payment gateway not configured. Contact admin.' });
  }

  if (!razorpay_payment_id) {
    return sendResponse(false, { message: 'Missing razorpay_payment_id' });
  }

  // ── Path 1: Standard signature verification ──────
  if (razorpay_signature && razorpay_order_id) {
    console.log('[verify-payment] Verifying via HMAC signature...');
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log('[verify-payment] Signature valid for payment:', razorpay_payment_id);
      
      try {
        if (type === 'godana') {
          const { error } = await supabase!
            .from('godana_payments')
            .insert([{
              name, phone, email: email || null, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed"
            }]);
          if (error && error.code !== '23505') throw error;
          
          if (email) sendGodanaEmail(name, email, Number(amount)).catch(err => console.error(err));
          sendAdminPaymentNotification('godana', { name, phone, email, amount, payment_id: razorpay_payment_id }).catch(err => console.error(err));
        } 
        else if (type === 'donation') {
          const { error } = await supabase!
            .from('donations')
            .insert([{
              name, phone, email: email || null, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed"
            }]);
          if (error && error.code !== '23505') throw error;

          if (email) sendDonationEmail(name, email, Number(amount)).catch(err => console.error(err));
          sendAdminPaymentNotification('donation', { name, phone, email, amount, payment_id: razorpay_payment_id }).catch(err => console.error(err));
        }
        else if (type === 'special_seva') {
          const { error } = await supabase!
            .from('special_seva_bookings')
            .insert([{
              notification_id, name, phone, email: email || null, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed"
            }]);
          if (error && error.code !== '23505') throw error;

          sendAdminPaymentNotification('donation', { name, phone, email, amount, payment_id: razorpay_payment_id }).catch(err => console.error(err));
        }
        else if (type === 'seva') {
          console.log('[verify-payment] Seva payment verified. Recording to bookings...');
          const { error } = await supabase!
            .from('bookings')
            .insert([{
              name, 
              phone, 
              email: email || null, 
              amount: Number(amount), 
              transaction_id: razorpay_payment_id, 
              payment_status: 'Confirmed', 
              seva_name: req.body.seva_name || req.query.seva_name || 'Seva Booking',
              date: req.body.date || req.query.date || req.body.poojaDetails?.date || null,
              count: req.body.count || req.query.count || req.body.poojaDetails?.count || 1,
              gothra: req.body.gothra || req.query.gothra || req.body.poojaDetails?.gothra || null,
              nakshathra: req.body.nakshathra || req.query.nakshathra || req.body.poojaDetails?.nakshathra || null,
              rashi: req.body.rashi || req.query.rashi || req.body.poojaDetails?.rashi || null,
              vedha: req.body.vedha || req.query.vedha || req.body.poojaDetails?.vedha || null,
              message: req.body.message || req.query.message || req.body.poojaDetails?.message || null
            }]);
          
          if (error && error.code !== '23505') {
            console.warn('[verify-payment] Seva record insert failed:', error.message);
          } else {
            sendAdminPaymentNotification('seva', { 
              name, phone, email, amount, transaction_id: razorpay_payment_id,
              seva_name: req.body.seva_name || req.query.seva_name || 'Seva Booking',
              date: req.body.date || req.query.date || req.body.poojaDetails?.date || 'N/A',
              count: req.body.count || req.query.count || req.body.poojaDetails?.count || 1,
              gothra: req.body.gothra || req.query.gothra || req.body.poojaDetails?.gothra || 'N/A',
              nakshathra: req.body.nakshathra || req.query.nakshathra || req.body.poojaDetails?.nakshathra || 'N/A',
              rashi: req.body.rashi || req.query.rashi || req.body.poojaDetails?.rashi || 'N/A'
            }).catch(err => console.error(err));
          }
        }

        return sendResponse(true, { payment_id: razorpay_payment_id, amount, message: 'Payment verified and recorded.' });
      } catch (err: any) {
        console.error('[verify-payment] Database Error:', err);
        return sendResponse(false, { error: 'Database insert failed' });
      }
    } else {
      console.warn('[verify-payment] Signature MISMATCH for payment:', razorpay_payment_id);
      return sendResponse(false, { message: 'Invalid payment signature.' });
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
            const { error } = await supabase!.from('godana_payments').insert([{ name, phone, email, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed" }]);
            if (error && error.code !== '23505') throw error;
            sendAdminPaymentNotification('godana', { name, phone, email, amount, payment_id: razorpay_payment_id }).catch(console.error);
          } else if (type === 'donation') {
            const { error } = await supabase!.from('donations').insert([{ name, phone, email, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed" }]);
            if (error && error.code !== '23505') throw error;
            sendAdminPaymentNotification('donation', { name, phone, email, amount, payment_id: razorpay_payment_id }).catch(console.error);
          } else if (type === 'special_seva') {
            const { error } = await supabase!.from('special_seva_bookings').insert([{ notification_id, name, phone, email, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed" }]);
            if (error && error.code !== '23505') throw error;
            sendAdminPaymentNotification('donation', { name, phone, email, amount, payment_id: razorpay_payment_id }).catch(console.error);
          } else if (type === 'seva') {
            const { error } = await supabase!.from('bookings').insert([{
              name, phone, email: email || null, amount: Number(amount), transaction_id: razorpay_payment_id, payment_status: 'Confirmed', 
              seva_name: req.body.seva_name || req.query.seva_name || 'Seva Booking',
              date: req.body.date || req.query.date || req.body.poojaDetails?.date || null,
              count: req.body.count || req.query.count || req.body.poojaDetails?.count || 1,
              gothra: req.body.gothra || req.query.gothra || req.body.poojaDetails?.gothra || null,
              nakshathra: req.body.nakshathra || req.query.nakshathra || req.body.poojaDetails?.nakshathra || null,
              rashi: req.body.rashi || req.query.rashi || req.body.poojaDetails?.rashi || null,
              vedha: req.body.vedha || req.query.vedha || req.body.poojaDetails?.vedha || null,
              message: req.body.message || req.query.message || req.body.poojaDetails?.message || null
            }]);
            if (error && error.code !== '23505') throw error;
            sendAdminPaymentNotification('seva', { 
              name, phone, email, amount, transaction_id: razorpay_payment_id,
              seva_name: req.body.seva_name || req.query.seva_name || 'Seva Booking',
              date: req.body.date || req.query.date || req.body.poojaDetails?.date || 'N/A',
              count: req.body.count || req.query.count || req.body.poojaDetails?.count || 1,
              gothra: req.body.gothra || req.query.gothra || req.body.poojaDetails?.gothra || 'N/A',
              nakshathra: req.body.nakshathra || req.query.nakshathra || req.body.poojaDetails?.nakshathra || 'N/A',
              rashi: req.body.rashi || req.query.rashi || req.body.poojaDetails?.rashi || 'N/A'
            }).catch(console.error);
          }
          return sendResponse(true, { payment_id: razorpay_payment_id, amount });
        } catch (dbErr: any) {
          if (dbErr.code === '23505') return sendResponse(true, { payment_id: razorpay_payment_id });
          throw dbErr;
        }
    } else {
      return sendResponse(false, { message: 'Payment not captured' });
    }
  } catch (error: any) {
    console.error('[verify-payment] Razorpay API Error:', error);
    return sendResponse(false, { message: 'Verification failed' });
  }
}

