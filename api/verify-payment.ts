import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import Razorpay from 'razorpay';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET || '';

  // 1. Standard verification if signature is present (Desktop inline popup flow)
  if (razorpay_signature && razorpay_order_id) {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ success: true, message: 'Payment verified via signature' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  }

  // 2. Fallback verification for mobile UPI flows where signature drops from URL
  if (razorpay_payment_id) {
    try {
      const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || '',
        key_secret: secret,
      });

      const payment = await rzp.payments.fetch(razorpay_payment_id);
      
      if (payment && (payment.status === 'captured' || payment.status === 'authorized')) {
        return res.status(200).json({ success: true, message: 'Payment verified via API lookup' });
      } else {
        return res.status(400).json({ success: false, message: `Payment not completed. Status: ${payment?.status}` });
      }
    } catch (error) {
      console.error('Error fetching Razorpay payment:', error);
      return res.status(500).json({ success: false, message: 'Could not fetch payment details from Razorpay' });
    }
  }

  return res.status(400).json({ success: false, message: 'Missing payment information' });
}
