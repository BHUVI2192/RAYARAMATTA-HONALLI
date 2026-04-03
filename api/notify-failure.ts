import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendFailureEmail } from './_lib/email';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, name, amount, errorMsg } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Email and Name are required' });
  }

  try {
    await sendFailureEmail(email, name, amount, errorMsg);
    res.status(200).json({ success: true, message: 'Failure email sent' });
  } catch (error: any) {
    console.error('Error in notify-failure handler:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
