import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase';
import { sendSevaEmail } from './_lib/email';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userDetails, seva, poojaDetails } = req.body;

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          name: userDetails.name,
          phone: userDetails.phone,
          email: userDetails.email,
          address: userDetails.address,
          seva_id: seva.id,
          seva_name: seva.name,
          seva_price: seva.price,
          date: poojaDetails.date,
          gothra: poojaDetails.gothra,
          nakshathra: poojaDetails.nakshathra,
          rashi: poojaDetails.rashi,
          vedha: poojaDetails.vedha,
          count: poojaDetails.count,
          total_price: seva.price * poojaDetails.count,
          payment_status: req.body.payment_status || 'Pending Verification',
          message: poojaDetails.message,
          transaction_id: poojaDetails.transactionId,
          transaction_details: req.body.transactionDetails // For Razorpay raw response if needed
        }
      ]);

    if (error) throw error;

    // Send confirmation email
    await sendSevaEmail(userDetails, seva, poojaDetails);

    res.status(201).json({ success: true, message: 'Booking saved successfully' });
  } catch (error: any) {
    console.error('Error handling booking:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
