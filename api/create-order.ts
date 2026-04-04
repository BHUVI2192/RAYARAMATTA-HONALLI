import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Always set JSON content type so every response is parseable
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { amount, type } = req.body || {};

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount. Must be a positive number.' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('[create-order] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set');
    return res.status(500).json({ success: false, error: 'Payment gateway not configured. Contact admin.' });
  }

  // Instantiate inside handler — prevents module-level crash if env vars are absent
  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const options = {
      amount: Math.round(Number(amount) * 100), // Amount in paise, must be integer
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { type: type || 'general' }
    };

    console.log('[create-order] Creating order:', options);
    const order = await razorpay.orders.create(options);
    console.log('[create-order] Order created:', order.id);

    return res.status(200).json({
      success: true,
      order,
      keyId // Send key_id back so frontend can use it
    });
  } catch (error: any) {
    console.error('[create-order] Razorpay Order Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.error?.description || error?.message || 'Failed to create order'
    });
  }
}
