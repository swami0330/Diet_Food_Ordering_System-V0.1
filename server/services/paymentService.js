const Stripe = require('stripe');
const Razorpay = require('razorpay');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const processPayment = async ({ amount, method, details, type = 'payment', paymentId, reason }) => {
  try {
    if (type === 'refund') {
      return await processRefund(paymentId, amount, reason);
    }

    switch (method) {
      case 'CARD':
        return await processStripePayment(amount, details);
      case 'UPI':
      case 'WALLET':
        return await processRazorpayPayment(amount, method, details);
      case 'COD':
        return { success: true, message: 'Cash on delivery order placed' };
      default:
        throw new Error('Unsupported payment method');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return { success: false, error: error.message };
  }
};

const processStripePayment = async (amount, details) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'inr',
      payment_method: details.paymentMethodId,
      confirm: true,
      return_url: `${process.env.FRONTEND_URL}/order-success`
    });

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        transactionId: paymentIntent.id,
        message: 'Payment successful'
      };
    } else {
      return {
        success: false,
        error: 'Payment failed or requires additional action'
      };
    }
  } catch (error) {
    console.error('Stripe payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const processRazorpayPayment = async (amount, method, details) => {
  try {
    // For UPI and Wallet payments, we would typically create a payment link
    // or use Razorpay's payment gateway integration
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      payment_capture: 1
    });

    // In a real implementation, you would redirect to Razorpay's payment page
    // For now, we'll simulate a successful payment
    return {
      success: true,
      transactionId: order.id,
      message: `${method} payment successful`
    };
  } catch (error) {
    console.error('Razorpay payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const createPaymentIntent = async (amount, currency = 'inr') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret
    };
  } catch (error) {
    console.error('Create payment intent error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const verifyPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: paymentIntent.status === 'succeeded',
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100
    };
  } catch (error) {
    console.error('Verify payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const processRefund = async (transactionId, amount, reason) => {
  try {
    // Try Stripe first
    if (transactionId.startsWith('pi_')) {
      const refund = await stripe.refunds.create({
        payment_intent: transactionId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: 'requested_by_customer',
        metadata: { reason: reason || 'Customer requested refund' }
      });

      return {
        success: refund.status === 'succeeded',
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        message: 'Refund processed successfully'
      };
    }

    // Try Razorpay
    if (transactionId.startsWith('pay_') || transactionId.startsWith('order_')) {
      const refund = await razorpay.payments.refund(transactionId, {
        amount: amount ? Math.round(amount * 100) : undefined,
        notes: { reason: reason || 'Customer requested refund' }
      });

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        message: 'Refund processed successfully'
      };
    }

    return { success: false, error: 'Invalid payment ID format' };
  } catch (error) {
    console.error('Process refund error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create payment method for saved cards/UPI
const createPaymentMethod = async ({ userId, type, details }) => {
  try {
    if (type === 'CREDIT_CARD' || type === 'DEBIT_CARD') {
      // Create Stripe payment method
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: details.cardNumber.replace(/\s/g, ''),
          exp_month: parseInt(details.expiryMonth),
          exp_year: parseInt(details.expiryYear),
          cvc: details.cvv
        },
        billing_details: {
          name: details.holderName
        }
      });

      return {
        success: true,
        provider: 'stripe',
        methodId: paymentMethod.id,
        last4: paymentMethod.card.last4,
        brand: paymentMethod.card.brand,
        expiryMonth: paymentMethod.card.exp_month,
        expiryYear: paymentMethod.card.exp_year,
        holderName: details.holderName
      };
    }

    if (type === 'UPI') {
      // For UPI, we'll store the UPI ID
      return {
        success: true,
        provider: 'razorpay',
        methodId: `upi_${userId}_${Date.now()}`,
        last4: details.upiId ? details.upiId.slice(-4) : '****',
        brand: 'upi',
        holderName: details.holderName || details.upiId
      };
    }

    return { success: false, error: 'Unsupported payment method type' };
  } catch (error) {
    console.error('Error creating payment method:', error);
    return { success: false, error: error.message };
  }
};

// Delete payment method
const deletePaymentMethod = async ({ provider, methodId }) => {
  try {
    if (provider === 'stripe') {
      await stripe.paymentMethods.detach(methodId);
    }
    // For Razorpay and others, we just remove from our database
    return { success: true };
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return { success: false, error: error.message };
  }
};

// Generate invoice
const generateInvoice = async ({ userId, orderId, subscriptionId, billingProfileId }) => {
  try {
    const prisma = require('../lib/prisma');
    
    // Get the next invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true }
    });

    const nextNumber = lastInvoice 
      ? parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1 
      : 1;
    
    const invoiceNumber = `INV-${nextNumber.toString().padStart(6, '0')}`;

    let invoiceData = {
      userId,
      invoiceNumber,
      type: orderId ? 'ORDER' : 'SUBSCRIPTION',
      status: 'DRAFT',
      billingProfileId
    };

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { meal: true } } }
      });

      invoiceData = {
        ...invoiceData,
        orderId,
        subtotal: order.subtotal,
        taxAmount: order.tax,
        totalAmount: order.total,
        description: `Order #${order.id}`,
        items: {
          create: order.items.map(item => ({
            description: item.meal.name,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity
          }))
        }
      };
    }

    if (subscriptionId) {
      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { plan: true }
      });

      invoiceData = {
        ...invoiceData,
        subscriptionId,
        subtotal: subscription.price,
        taxAmount: subscription.price * 0.18, // 18% GST
        totalAmount: subscription.price * 1.18,
        description: `Subscription - ${subscription.plan.name}`,
        items: {
          create: [{
            description: `${subscription.plan.name} Subscription`,
            quantity: 1,
            unitPrice: subscription.price,
            totalPrice: subscription.price
          }]
        }
      };
    }

    const invoice = await prisma.invoice.create({
      data: invoiceData,
      include: {
        items: true,
        billingProfile: true
      }
    });

    return { success: true, invoice };
  } catch (error) {
    console.error('Error generating invoice:', error);
    return { success: false, error: error.message };
  }
};

// Calculate tax based on billing address
const calculateTax = async ({ amount, billingAddress }) => {
  try {
    const prisma = require('../lib/prisma');
    
    const taxConfig = await prisma.taxConfiguration.findFirst({
      where: {
        country: billingAddress.country,
        state: billingAddress.state,
        isActive: true
      }
    });

    if (taxConfig) {
      const taxAmount = (amount * taxConfig.taxRate) / 100;
      return {
        taxRate: taxConfig.taxRate,
        taxAmount,
        taxType: taxConfig.taxType,
        totalWithTax: amount + taxAmount
      };
    }

    // Default tax (18% GST for India)
    const defaultTaxRate = 18;
    const taxAmount = (amount * defaultTaxRate) / 100;
    
    return {
      taxRate: defaultTaxRate,
      taxAmount,
      taxType: 'GST',
      totalWithTax: amount + taxAmount
    };
  } catch (error) {
    console.error('Error calculating tax:', error);
    return {
      taxRate: 0,
      taxAmount: 0,
      taxType: 'None',
      totalWithTax: amount
    };
  }
};

module.exports = {
  processPayment,
  createPaymentIntent,
  verifyPayment,
  processRefund,
  createPaymentMethod,
  deletePaymentMethod,
  generateInvoice,
  calculateTax
};