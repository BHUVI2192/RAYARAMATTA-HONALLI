import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../api/_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  const adminPassword = req.headers['x-admin-password'];
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase!
        .from('special_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, notifications: data || [] });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, amount, is_active } = req.body;
      const { data, error } = await supabase!
        .from('special_notifications')
        .insert([{ title, description, amount, is_active }])
        .select();

      if (error) throw error;
      return res.status(200).json({ success: true, notification: data?.[0] });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: 'Failed to create notification' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, title, description, amount, is_active } = req.body;
      const { data, error } = await supabase!
        .from('special_notifications')
        .update({ title, description, amount, is_active })
        .eq('id', id)
        .select();

      if (error) throw error;
      return res.status(200).json({ success: true, notification: data?.[0] });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: 'Failed to update notification' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = req.query.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Notification ID is required' });
      }

      const { error } = await supabase!
        .from('special_notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Delete error:', error);
      return res.status(500).json({ success: false, error: 'Failed to delete notification: ' + error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
