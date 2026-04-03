import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

// Diagnostic endpoint
app.get('/api/debug-env', (req, res) => {
  res.json({
    supabase_url: process.env.SUPABASE_URL ? 'PRESENT' : 'MISSING',
    supabase_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE_PRESENT' : (process.env.SUPABASE_ANON_KEY ? 'ANON_KEY_PRESENT' : 'MISSING'),
    admin_password: process.env.ADMIN_PASSWORD ? 'PRESENT' : 'MISSING',
    razorpay_key: process.env.RAZORPAY_KEY_ID ? 'PRESENT' : 'MISSING',
    smtp_user: process.env.SMTP_USER ? 'PRESENT' : 'MISSING',
    port: port
  });
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Supabase tables are assumed to be created via the SQL schema

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // Use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take messages');
  }
});

app.post('/api/notify-failure', async (req, res) => {
  const { name, email, amount, errorMsg } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const mailOptions = {
    from: `"Rayara Matta Honalli" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Payment Not Completed - Rayara Matta Honalli`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B0000; margin: 0; font-size: 24px;">Payment Not Completed</h1>
          <p style="color: #666;">Rayara Matta Honalli, Honali</p>
        </div>
        
        <p>नमस्ते${name ? ' <strong>' + name + '</strong>' : ''},</p>
        <p>Your recent payment attempt of <strong>₹${amount}</strong> was not completed or was cancelled.</p>
        <p style="color: #8B0000; background: #fff8f8; padding: 10px; border-left: 4px solid #8B0000;">
          Reason: ${errorMsg || 'Transaction incomplete'}
        </p>
        <p>If any money was mistakenly deducted from your account, it will be refunded automatically by your bank within 5-7 working days. Please try again or contact us if you need help.</p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
          <p>Rayara Matta Honalli, Venkateswara Nagar (West), Honali, Karnataka - 577217</p>
          <p>Contact: +91 99403 83604</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Failure email sent to:', email);
    res.json({ success: true, message: 'Failure notification sent' });
  } catch (mailError) {
    console.error('Error sending failure email:', mailError);
    res.status(500).json({ success: false, error: 'Could not send email' });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { seva, userDetails, poojaDetails } = req.body;

  try {
    const { error: dbError } = await supabase
      .from('bookings')
      .insert([
        {
          seva_name: seva.name,
          seva_price: seva.price,
          name: userDetails.name,
          phone: userDetails.phone,
          email: userDetails.email,
          address: userDetails.address,
          date: poojaDetails.date,
          count: poojaDetails.count,
          total_price: seva.price * poojaDetails.count,
          gothra: poojaDetails.gothra,
          nakshathra: poojaDetails.nakshathra,
          rashi: poojaDetails.rashi,
          vedha: poojaDetails.vedha,
          message: poojaDetails.message,
          transaction_id: poojaDetails.transactionId,
          payment_status: req.body.payment_status || 'Pending Verification'
        }
      ]);

    if (dbError) throw dbError;

    // Send confirmation email for Seva
    const mailOptions = {
      from: `"Rayara Matta Honalli" <${process.env.SMTP_USER}>`,
      to: userDetails.email,
      subject: `Seva Booking Confirmation - ${seva.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B0000; margin: 0; font-size: 24px;">Seva Booking Confirmed</h1>
            <p style="color: #666;">Rayara Matta Honalli, Honali</p>
          </div>
          
          <p>नमस्ते <strong>${userDetails.name}</strong>,</p>
          <p>Your booking for <strong>${seva.name}</strong> has been successfully received. May the blessings of Guru Raghavendra Swamy be with you.</p>
          
          <div style="background: #fff8f8; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #ffebeb;">
            <p style="color: #8B0000; font-weight: bold; margin-top: 0; border-bottom: 1px solid #ffebeb; padding-bottom: 10px;">Booking Summary</p>
            <table style="width: 100%; font-size: 14px;">
              <tr><td style="padding: 5px 0; color: #777;">Seva</td><td style="padding: 5px 0; text-align: right; font-weight: bold;">${seva.name}</td></tr>
              <tr><td style="padding: 5px 0; color: #777;">Date</td><td style="padding: 5px 0; text-align: right; font-weight: bold;">${poojaDetails.date}</td></tr>
              <tr><td style="padding: 5px 0; color: #777;">Amount Paid</td><td style="padding: 5px 0; text-align: right; font-weight: bold; color: #8B0000;">₹${seva.price * poojaDetails.count}</td></tr>
              <tr><td style="padding: 5px 0; color: #777;">Gothra</td><td style="padding: 5px 0; text-align: right;">${poojaDetails.gothra || 'N/A'}</td></tr>
              <tr><td style="padding: 5px 0; color: #777;">Nakshathra</td><td style="padding: 5px 0; text-align: right;">${poojaDetails.nakshathra || 'N/A'}</td></tr>
              <tr><td style="padding: 5px 0; color: #777;">Transaction ID</td><td style="padding: 5px 0; text-align: right; font-family: monospace;">${poojaDetails.transactionId || 'N/A'}</td></tr>
            </table>
          </div>
          
          <p style="line-height: 1.6;">Your seva will be performed with all rituals. May the blessings of Guru Raghavendra Swamy be with you always.</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
            <p>Rayara Matta Honalli, Venkateswara Nagar (West), Honali, Karnataka - 577217</p>
            <p>Contact: +91 99403 83604</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Confirmation email sent to:', userDetails.email);
    } catch (mailError) {
      console.error('Error sending confirmation email:', mailError);
    }

    res.status(201).json({ success: true, message: 'Booking saved successfully' });
    } catch (err: any) {
      console.error('Login Error:', err);
      res.status(500).json({ success: false, error: `Connection failed: ${err.message || 'Unknown error'}. Please check if the backend server is running.` });
    }
});

app.post('/api/godana', async (req, res) => {
  const { name, phone, email, amount, payment_id } = req.body;

  try {
    const { error: dbError } = await supabase
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

    if (dbError) throw dbError;

    // Send confirmation email for Godana
    const mailOptions = {
      from: `"Rayara Matta Honalli" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Godana Seva Confirmation - Rayara Matta Honalli',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B0000; margin: 0; font-size: 24px;">Godana Seva Received</h1>
            <p style="color: #666;">Rayara Matta Honalli, Honali</p>
          </div>
          
          <p>नमस्ते <strong>${name}</strong>,</p>
          <p>Thank you for your noble contribution towards <strong>Godana Seva</strong>. Your support helps us in the maintenance and care of our Goshala.</p>
          
          <div style="background: #f8fff8; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #ebffeb;">
            <p style="color: #2e7d32; font-weight: bold; margin-top: 0; border-bottom: 1px solid #ebffeb; padding-bottom: 10px;">Contribution Details</p>
            <table style="width: 100%; font-size: 14px;">
              <tr><td style="padding: 5px 0; color: #777;">Service</td><td style="padding: 5px 0; text-align: right; font-weight: bold;">Godana Seva</td></tr>
              <tr><td style="padding: 5px 0; color: #777;">Amount Contributed</td><td style="padding: 5px 0; text-align: right; font-weight: bold; color: #8B0000;">₹${amount}</td></tr>
              <tr><td style="padding: 5px 0; color: #777;">Transaction ID</td><td style="padding: 5px 0; text-align: right; font-family: monospace;">${payment_id}</td></tr>
            </table>
          </div>
          
          <p style="line-height: 1.6;">Your contribution has been successfully recorded. May the blessings of Guru Raghavendra Swamy and Gomatha be with you and your family.</p>
          
          <div style="margin-top: 40px; pt-20; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
            <p>Rayara Matta Honalli, Venkateswara Nagar (West), Honali, Karnataka - 577217</p>
            <p>Contact: +91 99403 83604</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Error sending Godana email:', mailError);
    }

    res.status(201).json({ success: true, message: 'Godana payment recorded successfully' });
  } catch (error) {
    console.error('Error handling Godana payment:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/admin/bookings', async (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Bookings Error:', error);
      return res.status(500).json({ success: false, error: `Supabase Error: ${error.message} (${error.code})` });
    }
    res.json({ success: true, bookings });
  } catch (error: any) {
    console.error('Fetch Bookings System Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

app.get('/api/admin/godana', async (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { data: godana, error } = await supabase
      .from('godana_payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Godana Error:', error);
      return res.status(500).json({ success: false, error: `Supabase Error: ${error.message} (${error.code})` });
    }
    res.json({ success: true, godana });
  } catch (error: any) {
    console.error('Fetch Godana System Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

app.post('/api/admin/confirm-booking', async (req, res) => {
  const password = req.headers['x-admin-password'];
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { bookingId, status } = req.body;
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ payment_status: status || 'Confirmed' })
      .eq('id', bookingId)
      .select();

    if (error) throw error;
    res.json({ success: true, message: 'Status updated', booking: data[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/create-order', async (req, res) => {
  const { amount, type } = req.body; // type: 'seva', 'godana', or 'donate'

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    // If type is 'donate', we will eventually add transfer logic here
    // For now, it goes to the main account.
    
    const order = await razorpay.orders.create(options);
    res.json({ 
      success: true, 
      order,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(sign.toString())
    .digest('hex');

  if (razorpay_signature === expectedSign) {
    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});

app.post('/api/notify-failure', async (req, res) => {
  const { email, name, amount, errorMsg } = req.body;
  try {
    const mailOptions = {
      from: `"Rayara Matta Honalli" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Payment Failed - Rayara Matta Honalli',
      html: `<p>नमस्ते ${name},</p><p>Your payment of ₹${amount} failed. Reason: ${errorMsg || 'Cancelled by user'}</p>`
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
