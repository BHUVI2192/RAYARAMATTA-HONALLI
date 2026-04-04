import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'application/json');

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const providedPassword = req.headers['x-admin-password'] || req.body?.password;

  if (providedPassword !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!supabase) {
    return res.status(503).json({ success: false, error: 'Database not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel Environment Variables.' });
  }

  try {
    const { data, error } = await supabase
      .from('godana_payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/godana] Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: `Database error: ${error.message} (code: ${error.code})`
      });
    }

    return res.status(200).json({ success: true, godana: data || [] });
  } catch (error: any) {
    console.error('[admin/godana] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
