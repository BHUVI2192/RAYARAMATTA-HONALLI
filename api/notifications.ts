import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabase!
      .from('special_notifications')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true, notifications: data || [] });
  } catch (error: any) {
    console.error('[notifications] Supabase error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
}
