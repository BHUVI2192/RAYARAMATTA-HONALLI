import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/admin/login
 * Validates admin password without touching Supabase.
 * This ensures login works even if DB is temporarily unavailable.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Accept password from body OR from x-admin-password header
  const password = req.body?.password || req.headers['x-admin-password'];

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password !== adminPassword) {
    console.log('[admin/login] Failed login attempt at', new Date().toISOString());
    return res.status(401).json({ success: false, message: 'Invalid admin password' });
  }

  console.log('[admin/login] Successful admin login at', new Date().toISOString());
  return res.status(200).json({ success: true, message: 'Login successful' });
}
