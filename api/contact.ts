import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendContactEmail } from './_lib/email';
import { supabase } from './_lib/supabase';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const data = req.body;

  if (!data || !data.name || (!data.message && !data.comments)) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    // 1. Send Email Notification to Admin
    const emailSent = await sendContactEmail(data);

    // 2. Save to Supabase (Optional but good for history)
    if (supabase) {
      const table = data.type === 'feedback' ? 'feedback' : 'messages';
      const { error } = await supabase
        .from(table)
        .insert([{
          name: data.name,
          email: data.email || null,
          location: data.location || null,
          subject: data.subject || null,
          message: data.message || data.comments,
          rating: data.rating || null,
          created_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error(`[contact] Supabase error saving ${data.type}:`, error);
      }
    }

    if (!emailSent) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send email notification, but message might have been saved.' 
      });
    }

    return res.status(200).json({
      success: true,
      message: data.type === 'feedback' ? 'Feedback submitted successfully' : 'Message sent successfully'
    });
  } catch (error: any) {
    console.error('[contact] Error processing submission:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
}
