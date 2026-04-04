import type { VercelRequest, VercelResponse } from '@vercel/node';
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

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
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
      console.log('[verify-payment] Signature valid for payment:', razorpay_payment_id);
      return res.status(200).json({ success: true, message: 'Payment verified via signature' });
    } else {
      console.warn('[verify-payment] Signature MISMATCH for payment:', razorpay_payment_id);
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Possible tampering detected.' });
    }
  }

  // ── Path 2: API-based fallback (Mobile UPI redirect — signature lost in URL) ──
  console.log('[verify-payment] Signature missing — falling back to API lookup for:', razorpay_payment_id);
  
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  if (!keyId) {
    return res.status(500).json({ success: false, message: 'Payment gateway not configured. Contact admin.' });
  }

  try {
    // Instantiate inside handler to avoid module-level crash
    const rzp = new Razorpay({ key_id: keyId, key_secret: secret });
    const payment = await rzp.payments.fetch(razorpay_payment_id);

    console.log('[verify-payment] Payment status from API:', payment?.status);

    if (payment && (payment.status === 'captured' || payment.status === 'authorized')) {
      return res.status(200).json({ success: true, message: 'Payment verified via API lookup' });
    } else {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${payment?.status || 'unknown'}`
      });
    }
  } catch (error: any) {
    console.error('[verify-payment] Error fetching payment from Razorpay:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch payment details from Razorpay',
      error: error?.error?.description || error?.message || 'Unknown error'
    });
  }
}
