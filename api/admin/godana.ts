import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (req.headers['x-admin-password'] !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase
      .from('godana_payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, godana: data });
  } catch (error: any) {
    console.error('Error fetching admin godana payments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
