import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';
import { 
  sendSevaEmail, 
  sendAdminPaymentNotification, 
  sendContactEmail, 
  sendDonationEmail, 
  sendGodanaEmail, 
  sendFailureEmail 
} from './_lib/email';
import crypto from 'crypto';
import Razorpay from 'razorpay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  const route = req.query.route as string;

  try {
    switch (route) {
      case 'notifications':
        return handleGetNotifications(req, res);
      case 'bookings':
        return handleBookings(req, res);
      case 'donate':
        return handleDonate(req, res);
      case 'godana':
        return handleGodana(req, res);
      case 'contact':
        return handleContact(req, res);
      case 'notify-failure':
        return handleNotifyFailure(req, res);
      case 'create-order':
        return handleCreateOrder(req, res);
      case 'verify-payment':
        return handleVerifyPayment(req, res);
      default:
        return res.status(404).json({ success: false, message: `Public route '${route}' not found` });
    }
  } catch (error: any) {
    console.error(`[public_api] Error in route ${route}:`, error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}

async function handleGetNotifications(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });
  const { data, error } = await supabase.from('special_notifications').select('*').eq('is_active', true).order('created_at', { ascending: false });
  if (error) throw error;
  return res.status(200).json({ success: true, notifications: data || [] });
}

async function handleBookings(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const { userDetails, seva, poojaDetails, razorpay_order_id, razorpay_signature } = req.body || {};
  const transactionId = poojaDetails?.transactionId || null;
  if (!userDetails || !seva || !poojaDetails) return res.status(400).json({ success: false, error: 'Missing required fields' });
  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });

  // Verification
  if (transactionId && transactionId.startsWith('pay_')) {
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    if (secret && razorpay_order_id && razorpay_signature) {
      const body = `${razorpay_order_id}|${transactionId}`;
      const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
      if (expected !== razorpay_signature) return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    } else {
      const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID || '', key_secret: secret });
      const payment = await razorpay.payments.fetch(transactionId);
      if (payment.status !== 'captured') return res.status(400).json({ success: false, message: 'Payment not captured' });
    }
  }

  // Duplicate check
  if (transactionId) {
    const { data: existing } = await supabase.from('bookings').select('id').eq('transaction_id', transactionId).maybeSingle();
    if (existing) return res.status(200).json({ success: true, message: 'Already recorded' });
  }

  const { error } = await supabase.from('bookings').insert([{
    name: userDetails.name, phone: userDetails.phone, email: userDetails.email, address: userDetails.address,
    seva_name: seva.name, seva_price: seva.price, date: poojaDetails.date,
    gothra: poojaDetails.gothra || null, nakshathra: poojaDetails.nakshathra || null,
    rashi: poojaDetails.rashi || null, vedha: poojaDetails.vedha || null, count: poojaDetails.count || 1,
    payment_status: req.body.payment_status || poojaDetails.payment_status || 'Pending Verification',
    message: poojaDetails.message || null, transaction_id: transactionId
  }]);
  if (error) throw error;

  sendSevaEmail(userDetails, seva, poojaDetails).catch(console.error);
  sendAdminPaymentNotification('seva', { ...userDetails, transaction_id: transactionId, amount: seva.price * (poojaDetails.count || 1), seva_name: seva.name, date: poojaDetails.date, count: poojaDetails.count || 1 }).catch(console.error);
  return res.status(201).json({ success: true, message: 'Booking saved successfully' });
}

async function handleDonate(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const { name, phone, email, amount, payment_id, razorpay_order_id, razorpay_signature } = req.body || {};
  if (!name || !phone || !payment_id) return res.status(400).json({ success: false, error: 'Missing required fields' });
  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });

  // Verification
  if (payment_id.startsWith('pay_')) {
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    if (secret && razorpay_order_id && razorpay_signature) {
      const body = `${razorpay_order_id}|${payment_id}`;
      const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
      if (expected !== razorpay_signature) return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  }

  const { data: existing } = await supabase.from('donations').select('id').eq('payment_id', payment_id).maybeSingle();
  if (existing) return res.status(200).json({ success: true, message: 'Already recorded' });

  const { error } = await supabase.from('donations').insert([{ name, phone, email, amount: Number(amount), payment_id, status: req.body.status || 'Confirmed' }]);
  if (error) throw error;

  if (email) sendDonationEmail(name, email, Number(amount)).catch(console.error);
  sendAdminPaymentNotification('donation', { name, phone, email, amount, payment_id }).catch(console.error);
  return res.status(201).json({ success: true, message: 'Donation saved' });
}

async function handleGodana(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const { name, phone, email, amount, payment_id, razorpay_order_id, razorpay_signature } = req.body || {};
  if (!name || !phone || !email || !payment_id) return res.status(400).json({ success: false, error: 'Missing fields' });
  if (!supabase) return res.status(503).json({ success: false, error: 'Database not configured' });

  const secret = process.env.RAZORPAY_GODANA_KEY_SECRET || '';
  if (payment_id.startsWith('pay_') && secret && razorpay_order_id && razorpay_signature) {
    const body = `${razorpay_order_id}|${payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (expected !== razorpay_signature) return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  const { data: existing } = await supabase.from('godana_payments').select('id').eq('payment_id', payment_id).maybeSingle();
  if (existing) return res.status(200).json({ success: true, message: 'Already recorded' });

  const { error } = await supabase.from('godana_payments').insert([{ name, phone, email, amount: Number(amount), payment_id, status: "Confirmed" }]);
  if (error) throw error;

  sendGodanaEmail(name, email, Number(amount)).catch(console.error);
  sendAdminPaymentNotification('godana', { name, phone, email, amount, payment_id }).catch(console.error);
  return res.status(201).json({ success: true, message: 'Stored successfully' });
}

async function handleContact(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const data = req.body;
  if (!data || !data.name || (!data.message && !data.comments)) return res.status(400).json({ success: false, error: 'Missing fields' });
  
  const emailSent = await sendContactEmail(data);
  if (supabase) {
    const table = data.type === 'feedback' ? 'feedback' : 'messages';
    await supabase.from(table).insert([{ name: data.name, email: data.email || null, location: data.location || null, subject: data.subject || null, message: data.message || data.comments, rating: data.rating || null, created_at: new Date().toISOString() }]);
  }
  if (!emailSent) return res.status(500).json({ success: false, error: 'Email failed' });
  return res.status(200).json({ success: true, message: 'Submitted' });
}

async function handleNotifyFailure(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const { email, name, amount, errorMsg } = req.body || {};
  if (!email || !name) return res.status(400).json({ success: false, message: 'Missing fields' });
  const sent = await sendFailureEmail(email, name, Number(amount) || 0, errorMsg || 'Payment not completed');
  return res.status(200).json({ success: true, message: sent ? 'Sent' : 'Skipped' });
}

async function handleCreateOrder(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const { amount, type } = req.body || {};
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return res.status(400).json({ success: false, error: 'Invalid amount' });

  const isGodana = type === 'godana';
  const keyId = isGodana ? (process.env.RAZORPAY_GODANA_KEY_ID || process.env.RAZORPAY_KEY_ID) : process.env.RAZORPAY_KEY_ID;
  const keySecret = isGodana ? (process.env.RAZORPAY_GODANA_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET) : process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return res.status(500).json({ success: false, error: 'Gateway not configured' });

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await razorpay.orders.create({ amount: Math.round(Number(amount) * 100), currency: 'INR', receipt: `rcpt_${Date.now()}`, notes: { type: type || 'general' } });
  return res.status(200).json({ success: true, order_id: order.id, keyId });
}

async function handleVerifyPayment(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  const type = req.body.type || req.query.type;
  const name = req.body.name || req.query.name;
  const phone = req.body.phone || req.query.phone;
  const email = req.body.email || req.query.email;
  const amount = req.body.amount || req.query.amount;
  const notification_id = req.body.notification_id || req.query.notification_id;
  const isRedirect = req.query.redirect === 'true';
  const redirectUrl = (req.query.redirect_url as string) || '/';

  const sendRes = (success: boolean, data: any) => {
    if (isRedirect) return res.redirect(302, `${redirectUrl}?payment_status=${success ? 'success' : 'failed'}&payment_id=${razorpay_payment_id || ''}`);
    return res.status(success ? 200 : 400).json({ success, ...data });
  };

  const secret = (type === 'godana' && process.env.RAZORPAY_GODANA_KEY_SECRET) ? process.env.RAZORPAY_GODANA_KEY_SECRET : (process.env.RAZORPAY_KEY_SECRET || '');
  if (!secret || !razorpay_payment_id) return sendRes(false, { message: 'Config error' });

  // Verification logic (simplified for consolidation)
  let verified = false;
  if (razorpay_signature && razorpay_order_id) {
    const expected = crypto.createHmac('sha256', secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    verified = (expected === razorpay_signature);
  } else {
    const keyId = (type === 'godana' && process.env.RAZORPAY_GODANA_KEY_ID) ? process.env.RAZORPAY_GODANA_KEY_ID : (process.env.RAZORPAY_KEY_ID || '');
    const razorpay = new Razorpay({ key_id: keyId, key_secret: secret });
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    verified = (payment.status === 'captured');
  }

  if (verified) {
    // Record to DB based on type
    try {
      if (type === 'godana') await supabase!.from('godana_payments').insert([{ name, phone, email, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed" }]);
      else if (type === 'donation') await supabase!.from('donations').insert([{ name, phone, email, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed" }]);
      else if (type === 'special_seva') await supabase!.from('special_seva_bookings').insert([{ notification_id, name, phone, email, amount: Number(amount), payment_id: razorpay_payment_id, status: "Confirmed" }]);
      else if (type === 'seva') {
        await supabase!.from('bookings').insert([{
          name, phone, email: email || null, amount: Number(amount), transaction_id: razorpay_payment_id, payment_status: 'Confirmed', 
          seva_name: req.body.seva_name || req.query.seva_name || 'Seva Booking',
          date: req.body.date || req.query.date || req.body.poojaDetails?.date || null,
          count: req.body.count || req.query.count || req.body.poojaDetails?.count || 1,
          gothra: req.body.gothra || req.query.gothra || req.body.poojaDetails?.gothra || null,
          nakshathra: req.body.nakshathra || req.query.nakshathra || req.body.poojaDetails?.nakshathra || null,
          rashi: req.body.rashi || req.query.rashi || req.body.poojaDetails?.rashi || null
        }]);
      }
      sendAdminPaymentNotification(type, { name, phone, email, amount, payment_id: razorpay_payment_id, transaction_id: razorpay_payment_id }).catch(console.error);
      return sendRes(true, { payment_id: razorpay_payment_id, amount });
    } catch (e) {
      return sendRes(true, { payment_id: razorpay_payment_id, warning: 'DB record failed' });
    }
  }
  return sendRes(false, { message: 'Verification failed' });
}
