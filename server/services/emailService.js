const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

// Create transporter based on environment
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransporter(sgTransport({
      auth: {
        api_key: process.env.SENDGRID_API_KEY
      }
    }));
  } else {
    // Fallback to SMTP (for development)
    return nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
};

const transporter = createTransporter();

// Email templates
const templates = {
  welcome: (data) => ({
    subject: 'Welcome to NutriDash!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Welcome to NutriDash, ${data.name}!</h1>
        <p>Thank you for joining our healthy meal delivery service.</p>
        <p>We're excited to help you on your nutrition journey with fresh, delicious, and nutritious meals delivered right to your door.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What's next?</h3>
          <ul>
            <li>Complete your profile to get personalized meal recommendations</li>
            <li>Browse our menu of chef-crafted healthy meals</li>
            <li>Choose a subscription plan or order individual meals</li>
          </ul>
        </div>
        <p>If you have any questions, our support team is here to help!</p>
        <p>Best regards,<br>The NutriDash Team</p>
      </div>
    `
  }),

  'password-reset': (data) => ({
    subject: 'Password Reset - NutriDash',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Password Reset Request</h1>
        <p>Hi ${data.name},</p>
        <p>We received a request to reset your password for your NutriDash account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The NutriDash Team</p>
      </div>
    `
  }),

  'order-confirmation': (data) => ({
    subject: `Order Confirmation #${data.orderId} - NutriDash`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Order Confirmed!</h1>
        <p>Hi ${data.name},</p>
        <p>Thank you for your order! We're preparing your delicious and nutritious meals.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Total:</strong> ₹${data.total}</p>
          
          <h4>Items:</h4>
          <ul>
            ${data.items.map(item => `
              <li>${item.quantity}x ${item.meal.name}</li>
            `).join('')}
          </ul>
        </div>
        
        <p>We'll send you updates as your order progresses. You can track your order anytime in your dashboard.</p>
        <p>Estimated delivery: 45-60 minutes</p>
        
        <p>Best regards,<br>The NutriDash Team</p>
      </div>
    `
  }),

  'order-delivered': (data) => ({
    subject: `Order Delivered #${data.orderId} - NutriDash`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Order Delivered!</h1>
        <p>Hi ${data.name},</p>
        <p>Your order #${data.orderId} has been successfully delivered!</p>
        <p>We hope you enjoy your nutritious meals. Don't forget to rate your experience to help us serve you better.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/orders/${data.orderId}" 
             style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Rate Your Order
          </a>
        </div>
        
        <p>Thank you for choosing NutriDash!</p>
        <p>Best regards,<br>The NutriDash Team</p>
      </div>
    `
  })
};

const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    let emailContent = {};

    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@nutridash.com',
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

const sendBulkEmail = async (emails) => {
  try {
    const results = await Promise.allSettled(
      emails.map(email => sendEmail(email))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    return {
      success: true,
      sent: successful,
      failed,
      results
    };
  } catch (error) {
    console.error('Bulk email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail
};