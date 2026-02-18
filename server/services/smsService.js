const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async ({ to, message }) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log('SMS service not configured, skipping SMS:', message);
      return { success: true, message: 'SMS service not configured' };
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to.startsWith('+') ? to : `+91${to}` // Add country code if not present
    });

    console.log('SMS sent successfully:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: error.message };
  }
};

const sendBulkSMS = async (messages) => {
  try {
    const results = await Promise.allSettled(
      messages.map(msg => sendSMS(msg))
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
    console.error('Bulk SMS error:', error);
    return { success: false, error: error.message };
  }
};

const sendOrderStatusSMS = async (phone, orderId, status) => {
  const statusMessages = {
    PREPARING: `Your order #${orderId} is being prepared by our chefs. Estimated delivery: 45-60 minutes.`,
    OUT_FOR_DELIVERY: `Great news! Your order #${orderId} is out for delivery. Our delivery partner will reach you soon.`,
    IN_TRANSIT: `Your order #${orderId} is on the way! Expected delivery in 10-15 minutes.`,
    DELIVERED: `Your order #${orderId} has been delivered! Enjoy your nutritious meal and don't forget to rate us.`,
    CANCELLED: `Your order #${orderId} has been cancelled. If you have any questions, please contact support.`
  };

  const message = statusMessages[status] || `Order #${orderId} status updated to ${status}.`;
  
  return await sendSMS({ to: phone, message });
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  sendOrderStatusSMS
};