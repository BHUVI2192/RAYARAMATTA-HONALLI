import nodemailer from 'nodemailer';

// Lazily creates the transporter only when needed.
// This prevents module-level crashes when SMTP env vars are missing on Vercel.
function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const sendSevaEmail = async (userDetails: any, seva: any, poojaDetails: any): Promise<boolean> => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[email] SMTP not configured — skipping Seva confirmation email.');
    return false;
  }

  const mailOptions = {
    from: `"Rayara Matta Honalli" <${process.env.SMTP_USER}>`,
    to: userDetails.email,
    subject: 'Seva Booking Confirmation - Rayara Matta Honalli',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; color: #333; text-align: left;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B0000; margin: 0; font-size: 24px;">Seva Booking Confirmed</h1>
          <p style="color: #666;">Rayara Matta Honalli, Honali</p>
        </div>
        
        <p>नमस्ते <strong>${userDetails.name}</strong>,</p>
        <p>Thank you for booking <strong>${seva.name}</strong>. Your payment has been received and the seva has been scheduled.</p>
        
        <div style="background: #fff8f8; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #ffebeb;">
          <p style="color: #8B0000; font-weight: bold; margin-top: 0; border-bottom: 1px solid #ffebeb; padding-bottom: 10px;">Booking Summary</p>
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 5px 0; color: #777;">Seva</td><td style="padding: 5px 0; text-align: right; font-weight: bold;">${seva.name}</td></tr>
            <tr><td style="padding: 5px 0; color: #777;">Date</td><td style="padding: 5px 0; text-align: right; font-weight: bold;">${poojaDetails.date}</td></tr>
            <tr><td style="padding: 5px 0; color: #777;">Amount Paid</td><td style="padding: 5px 0; text-align: right; font-weight: bold; color: #8B0000;">₹${seva.price * poojaDetails.count}</td></tr>
            <tr><td style="padding: 5px 0; color: #777;">Gothra</td><td style="padding: 5px 0; text-align: right;">${poojaDetails.gothra || 'N/A'}</td></tr>
            <tr><td style="padding: 5px 0; color: #777;">Nakshathra</td><td style="padding: 5px 0; text-align: right;">${poojaDetails.nakshathra || 'N/A'}</td></tr>
          </table>
        </div>
        
        <p style="line-height: 1.6;">Your seva will be performed with all rituals. May the blessings of Guru Raghavendra Swamy be with you always.</p>
        
        <div style="margin-top: 40px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
          <p>Rayara Matta Honalli, Venkateswara Nagar (West), Honali, Karnataka - 577217</p>
          <p>Contact: +91 91102 38478</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[email] Seva confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('[email] Error sending Seva email:', error);
    return false;
  }
};

export const sendGodanaEmail = async (name: string, email: string, amount: number): Promise<boolean> => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[email] SMTP not configured — skipping Godana confirmation email.');
    return false;
  }

  const mailOptions = {
    from: `"Rayara Matta Honalli" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Godana Seva Confirmation - Rayara Matta Honalli',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; color: #333; text-align: left;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B0000; margin: 0; font-size: 24px;">Godana Seva Received</h1>
          <p style="color: #666;">Rayara Matta Honalli, Honali</p>
        </div>
        
        <p>नमस्ते <strong>${name}</strong>,</p>
        <p>Thank you for your noble contribution towards <strong>Godana Seva</strong>. Your support helps us in the maintenance and care of our Goshala.</p>
        
        <div style="background: #f8fff8; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #ebffeb;">
          <p style="color: #006400; font-weight: bold; margin-top: 0; border-bottom: 1px solid #ebffeb; padding-bottom: 10px;">Contribution Summary</p>
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 5px 0; color: #777;">Service</td><td style="padding: 5px 0; text-align: right; font-weight: bold;">Godana Seva</td></tr>
            <tr><td style="padding: 5px 0; color: #777;">Amount Donated</td><td style="padding: 5px 0; text-align: right; font-weight: bold; color: #006400;">₹${amount}</td></tr>
          </table>
        </div>
        
        <p style="line-height: 1.6;">Donating to Gomata is one of the most auspicious acts. May all your desires be fulfilled by the grace of Lord Krishna and Guru Raghavendra.</p>
        
        <div style="margin-top: 40px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
          <p>Rayara Matta Honalli, Venkateswara Nagar (West), Honali, Karnataka - 577217</p>
          <p>Contact: +91 91102 38478</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[email] Godana confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('[email] Error sending Godana email:', error);
    return false;
  }
};

export const sendFailureEmail = async (email: string, name: string, amount: number, errorMsg: string): Promise<boolean> => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[email] SMTP not configured — skipping failure email.');
    return false;
  }

  const mailOptions = {
    from: `"Rayara Matta Honalli" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Payment Transaction Failed - Rayara Matta Honalli',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; color: #333; text-align: left;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d32f2f; margin: 0; font-size: 24px;">Payment Failed</h1>
          <p style="color: #666;">Rayara Matta Honalli, Honali</p>
        </div>
        
        <p>नमस्ते <strong>${name}</strong>,</p>
        <p>Your recent payment attempt of <strong>₹${amount}</strong> was not successful.</p>
        
        <div style="background: #fff8f8; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #ffebeb;">
          <p style="color: #d32f2f; font-weight: bold; margin-top: 0; border-bottom: 1px solid #ffebeb; padding-bottom: 10px;">Transaction Status</p>
          <p style="font-size: 14px; color: #777;">Details: <span style="color: #333; font-weight: bold;">${errorMsg || 'Incomplete or cancelled transaction'}</span></p>
        </div>
        
        <p style="line-height: 1.6;">If money was deducted, it will be automatically refunded by your bank. You can try performing the seva booking again.</p>
        
        <div style="margin-top: 40px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
          <p>Rayara Matta Honalli, Venkateswara Nagar (West), Honali, Karnataka - 577217</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[email] Failure email sent:', info.messageId);
    return true;
  } catch (err) {
    console.error('[email] Error sending failure email:', err);
    return false;
  }
};
