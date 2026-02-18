# 💳 NutriDash Billing & Payment System

## 🎯 Overview

The NutriDash billing and payment system provides comprehensive financial management for the meal delivery platform, including billing profiles, payment methods, invoicing, payment processing, and financial reporting.

## 🏗️ System Architecture

### Database Models

#### 1. BillingProfile
- **Purpose**: Store customer billing information for invoices
- **Fields**: Company details, billing address, tax information
- **Features**: Multiple profiles per user, default profile selection

#### 2. SavedPaymentMethod
- **Purpose**: Store encrypted payment method details
- **Supported Types**: Credit/Debit Cards, UPI, Net Banking, Wallets
- **Security**: Tokenized storage via Stripe/Razorpay

#### 3. Payment
- **Purpose**: Track all payment transactions
- **Features**: Multi-provider support, refund tracking, attempt logging
- **Status**: PENDING, COMPLETED, FAILED, REFUNDED

#### 4. Invoice
- **Purpose**: Generate detailed invoices for orders and subscriptions
- **Types**: ORDER, SUBSCRIPTION, REFUND, ADJUSTMENT
- **Features**: Tax calculation, itemized billing, PDF generation

#### 5. BillingCycle
- **Purpose**: Manage subscription billing cycles
- **Features**: Automated billing, cycle tracking, payment scheduling

#### 6. PaymentAttempt
- **Purpose**: Log all payment attempts for debugging
- **Features**: Failure reason tracking, retry logic

#### 7. TaxConfiguration
- **Purpose**: Configure tax rates by location
- **Features**: Country/state-specific rates, multiple tax types

## 💰 Payment Processing

### Supported Payment Methods

#### Credit/Debit Cards (Stripe)
```javascript
// Card payment processing
const payment = await processPayment({
  amount: 1500,
  method: 'CARD',
  details: {
    paymentMethodId: 'pm_1234567890',
    cardNumber: '4242424242424242',
    expiryMonth: 12,
    expiryYear: 2025,
    cvv: '123'
  }
});
```

#### UPI/Wallets (Razorpay)
```javascript
// UPI payment processing
const payment = await processPayment({
  amount: 1500,
  method: 'UPI',
  details: {
    upiId: 'user@paytm'
  }
});
```

#### Cash on Delivery
```javascript
// COD order
const payment = await processPayment({
  amount: 1500,
  method: 'COD',
  details: {}
});
```

### Payment Flow

1. **Order Creation**: User places order with selected payment method
2. **Payment Processing**: System processes payment via appropriate provider
3. **Payment Recording**: Transaction details stored in database
4. **Invoice Generation**: Automatic invoice creation for successful payments
5. **Notification**: User receives payment confirmation

## 🧾 Invoicing System

### Invoice Generation

#### Automatic Invoice Creation
```javascript
const invoice = await generateInvoice({
  userId: 'user123',
  orderId: 'order456',
  billingProfileId: 'profile789'
});
```

#### Invoice Components
- **Header**: Invoice number, dates, billing information
- **Line Items**: Detailed breakdown of charges
- **Tax Calculation**: Automatic tax computation based on location
- **Payment Status**: Tracking of payment against invoice
- **PDF Generation**: Downloadable invoice documents

### Tax Calculation

#### Location-Based Tax Rates
```javascript
const taxInfo = await calculateTax({
  amount: 1000,
  billingAddress: {
    country: 'India',
    state: 'Maharashtra'
  }
});
// Returns: { taxRate: 18, taxAmount: 180, totalWithTax: 1180 }
```

## 🔄 Subscription Billing

### Billing Cycle Management

#### Automated Billing
- **Cycle Creation**: Automatic billing cycle generation
- **Payment Processing**: Scheduled payment attempts
- **Retry Logic**: Failed payment retry mechanism
- **Notifications**: Billing reminders and confirmations

#### Subscription Lifecycle
1. **Activation**: Initial payment and cycle setup
2. **Renewal**: Automatic billing on cycle dates
3. **Pause/Resume**: Temporary suspension handling
4. **Cancellation**: Prorated refunds and cycle termination

## 🔒 Security Features

### Payment Security
- **Tokenization**: All payment methods tokenized via providers
- **PCI Compliance**: No sensitive card data stored locally
- **Encryption**: All financial data encrypted at rest
- **Audit Trail**: Complete transaction logging

### Data Protection
- **Access Control**: Role-based access to financial data
- **Data Masking**: Sensitive information masked in logs
- **Secure APIs**: All endpoints protected with authentication
- **Compliance**: GDPR and PCI DSS compliance

## 📊 Financial Reporting

### Admin Dashboard Metrics
- **Revenue Tracking**: Daily, weekly, monthly revenue
- **Payment Success Rates**: Transaction success analytics
- **Refund Analytics**: Refund patterns and reasons
- **Subscription Metrics**: Churn, retention, LTV analysis

### User Financial Dashboard
- **Payment History**: Complete transaction history
- **Invoice Management**: Download and view invoices
- **Subscription Overview**: Active plans and billing dates
- **Refund Requests**: Self-service refund initiation

## 🛠️ API Endpoints

### Billing Profiles
```
GET    /api/billing/profiles              # List billing profiles
POST   /api/billing/profiles              # Create billing profile
PUT    /api/billing/profiles/:id          # Update billing profile
DELETE /api/billing/profiles/:id          # Delete billing profile
```

### Payment Methods
```
GET    /api/billing/payment-methods       # List saved payment methods
POST   /api/billing/payment-methods       # Add payment method
DELETE /api/billing/payment-methods/:id   # Remove payment method
```

### Payments
```
GET    /api/billing/payments              # Payment history
GET    /api/billing/payments/:id          # Payment details
POST   /api/billing/payments/:id/refund   # Request refund
```

### Invoices
```
GET    /api/billing/invoices              # List invoices
GET    /api/billing/invoices/:id          # Invoice details
GET    /api/billing/invoices/:id/download # Download PDF
```

## 🎨 Frontend Components

### Billing Dashboard (`/billing`)
- **Overview Tab**: Financial summary and metrics
- **Billing Profiles**: Manage billing information
- **Payment Methods**: Saved payment method management
- **Payment History**: Transaction history with filters
- **Invoices**: Invoice management and downloads

### Key Features
- **Responsive Design**: Mobile-optimized interface
- **Real-time Updates**: Live payment status updates
- **Search & Filter**: Advanced filtering options
- **Export Options**: CSV/PDF export capabilities

## 🔧 Configuration

### Environment Variables
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Tax Configuration
DEFAULT_TAX_RATE=18
TAX_CALCULATION_MODE=location_based
```

### Payment Provider Setup

#### Stripe Setup
1. Create Stripe account
2. Configure webhook endpoints
3. Set up payment methods
4. Configure tax rates

#### Razorpay Setup
1. Create Razorpay account
2. Configure payment gateway
3. Set up UPI/wallet options
4. Configure webhooks

## 📈 Analytics & Monitoring

### Key Metrics
- **Payment Success Rate**: % of successful transactions
- **Average Order Value**: Mean transaction amount
- **Refund Rate**: % of transactions refunded
- **Payment Method Distribution**: Usage by payment type

### Monitoring
- **Transaction Monitoring**: Real-time payment tracking
- **Error Alerting**: Failed payment notifications
- **Performance Metrics**: API response times
- **Fraud Detection**: Suspicious transaction flagging

## 🚀 Deployment Considerations

### Production Setup
1. **SSL Certificates**: Ensure HTTPS for all payment pages
2. **Database Security**: Encrypt sensitive financial data
3. **Backup Strategy**: Regular financial data backups
4. **Compliance**: PCI DSS compliance verification

### Scaling Considerations
- **Database Optimization**: Index financial tables properly
- **Caching Strategy**: Cache tax rates and configurations
- **Load Balancing**: Distribute payment processing load
- **Monitoring**: Comprehensive financial metrics tracking

## 🔄 Integration Points

### Order System Integration
- **Order Payment**: Seamless payment during checkout
- **Status Updates**: Real-time payment status sync
- **Refund Processing**: Automated refund workflows

### Subscription System Integration
- **Billing Automation**: Automatic subscription billing
- **Plan Changes**: Prorated billing for plan modifications
- **Cancellation Handling**: Refund processing on cancellation

### Notification System Integration
- **Payment Confirmations**: Instant payment notifications
- **Billing Reminders**: Subscription renewal reminders
- **Failed Payment Alerts**: Payment failure notifications

## 📚 Usage Examples

### Creating a Billing Profile
```typescript
const profile = await fetch('/api/billing/profiles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    billingName: 'John Doe',
    billingEmail: 'john@example.com',
    billingAddress: {
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '400001'
    },
    isDefault: true
  })
});
```

### Processing a Payment
```typescript
const payment = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    deliveryAddress: {...},
    paymentMethod: 'CARD',
    paymentDetails: {
      paymentMethodId: 'pm_1234567890'
    }
  })
});
```

### Requesting a Refund
```typescript
const refund = await fetch(`/api/billing/payments/${paymentId}/refund`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    reason: 'Order cancelled by customer',
    amount: 1500 // Optional partial refund
  })
});
```

## 🎯 Future Enhancements

### Planned Features
- **Multi-currency Support**: International payment processing
- **Cryptocurrency Payments**: Bitcoin/Ethereum support
- **Advanced Analytics**: ML-powered financial insights
- **Automated Accounting**: Integration with accounting software
- **Loyalty Points**: Points-based payment system
- **Split Payments**: Multiple payment method support
- **Installment Plans**: EMI and BNPL options

### Technical Improvements
- **Real-time Reconciliation**: Automated payment matching
- **Advanced Fraud Detection**: ML-based fraud prevention
- **Performance Optimization**: Sub-second payment processing
- **Enhanced Reporting**: Advanced financial dashboards
- **API Rate Limiting**: Enhanced security measures

---

## 🎉 Summary

The NutriDash billing and payment system provides:

✅ **Comprehensive Payment Processing** - Multiple payment methods and providers
✅ **Advanced Invoicing** - Automated invoice generation with tax calculation
✅ **Subscription Management** - Automated billing cycles and renewals
✅ **Security & Compliance** - PCI DSS compliant payment processing
✅ **User-Friendly Interface** - Intuitive billing dashboard
✅ **Financial Analytics** - Detailed reporting and insights
✅ **Refund Management** - Self-service and automated refunds
✅ **Multi-Provider Support** - Stripe, Razorpay, and COD options

The system is production-ready and scalable, supporting the complete financial lifecycle of the NutriDash platform.