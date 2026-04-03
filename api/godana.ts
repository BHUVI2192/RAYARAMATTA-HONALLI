import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';
import { sendGodanaEmail } from './_lib/email';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, phone, email, amount, payment_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('godana_payments')
      .insert([
        {
          name,
          phone,
          email,
          amount,
          payment_id,
          status: req.body.status || 'Confirmed'
        }
      ]);

    if (error) throw error;

    // Send confirmation email
    await sendGodanaEmail(name, email, amount);

    res.status(201).json({ success: true, message: 'Godana payment saved successfully' });
  } catch (error: any) {
    console.error('Error handling Godana payment:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
