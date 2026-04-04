import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendFailureEmail } from './_lib/email';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { email, name, amount, errorMsg } = req.body || {};

  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Email and Name are required' });
  }

  try {
    const sent = await sendFailureEmail(email, name, Number(amount) || 0, errorMsg || 'Payment not completed');
    return res.status(200).json({
      success: true,
      message: sent ? 'Failure email sent' : 'Email skipped (SMTP not configured)'
    });
  } catch (error: any) {
    console.error('[notify-failure] Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
