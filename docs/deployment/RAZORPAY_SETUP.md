# Razorpay Payment Gateway Integration

This document explains how to set up and configure Razorpay payment gateway for the Gold & Silver App.

## Prerequisites

1. Razorpay account (Sign up at https://razorpay.com/)
2. Access to Razorpay Dashboard
3. Backend server running on Node.js

## Setup Steps

### 1. Get Razorpay API Keys

1. Log in to your Razorpay Dashboard: https://dashboard.razorpay.com/
2. Navigate to **Settings** → **API Keys**
3. Generate API keys:
   - For testing: Use **Test Mode** keys
   - For production: Use **Live Mode** keys
4. Copy your **Key ID** and **Key Secret**

### 2. Configure Environment Variables

Add the following environment variables to your `.env` file in the backend directory:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

**Important:**
- Never commit `.env` files to version control
- Use different keys for test and production environments
- Keep your Key Secret secure and never expose it in frontend code

### 3. Set Up Webhook (Optional but Recommended)

Webhooks allow Razorpay to notify your server about payment events automatically.

1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Click **Add New Webhook**
3. Set the webhook URL: `https://yourdomain.com/api/payments/webhook`
4. Select events to listen to:
   - `payment.captured` (when payment is successful)
   - `payment.failed` (when payment fails)
5. Copy the webhook secret and add it to your `.env` file as `RAZORPAY_WEBHOOK_SECRET`

### 4. Test the Integration

#### Test Mode
- Use Razorpay test cards: https://razorpay.com/docs/payments/test-cards/
- Test UPI IDs: `success@razorpay`, `failure@razorpay`
- Test PhonePe: `success@phonepe`, `failure@phonepe`

#### Test Flow
1. Create a purchase order
2. Payment gateway should open automatically
3. Use test credentials to complete payment
4. Verify payment status updates in your dashboard

## API Endpoints

### Create Payment Order
```
POST /api/payments/create-order
Authorization: Bearer <token>
Body: {
  "paymentId": "payment_id",
  "amount": 1000
}
```

### Verify Payment
```
POST /api/payments/verify
Authorization: Bearer <token>
Body: {
  "paymentId": "payment_id",
  "razorpayOrderId": "order_id",
  "razorpayPaymentId": "payment_id",
  "razorpaySignature": "signature"
}
```

### Webhook Endpoint
```
POST /api/payments/webhook
Headers: {
  "x-razorpay-signature": "signature"
}
Body: <Razorpay webhook payload>
```

## Payment Flow

1. **User creates purchase** → Purchase record created with status `pending`
2. **Payment record created** → Payment record created with status `pending`
3. **Razorpay order created** → Backend creates order via Razorpay API
4. **Checkout opens** → Frontend opens Razorpay checkout modal
5. **User completes payment** → Payment processed by Razorpay
6. **Payment verified** → Backend verifies payment signature
7. **Status updated** → Payment status set to `completed`, Purchase status set to `paid`

## Security Considerations

1. **Never expose Key Secret**: The Key Secret should only be used on the backend
2. **Verify signatures**: Always verify Razorpay signatures before updating payment status
3. **Use HTTPS**: Always use HTTPS in production for webhook endpoints
4. **Validate amounts**: Verify payment amounts match order amounts
5. **Handle failures**: Implement proper error handling for failed payments

## Troubleshooting

### Payment Gateway Not Opening
- Check if Razorpay script is loaded: `window.Razorpay` should exist
- Verify API keys are correct
- Check browser console for errors

### Payment Verification Fails
- Verify webhook secret is correct
- Check signature verification logic
- Ensure order ID matches between order creation and verification

### Webhook Not Working
- Verify webhook URL is accessible
- Check webhook secret configuration
- Verify webhook events are enabled in Razorpay dashboard
- Check server logs for webhook errors

## Support

For Razorpay-specific issues:
- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: support@razorpay.com

For application-specific issues:
- Check backend logs for detailed error messages
- Verify environment variables are set correctly
- Ensure database connection is working

## Production Checklist

- [ ] Switch to Live Mode API keys
- [ ] Configure production webhook URL
- [ ] Set up webhook secret
- [ ] Test payment flow end-to-end
- [ ] Set up monitoring for payment failures
- [ ] Configure proper error handling
- [ ] Set up payment failure notifications
- [ ] Test refund flow (if applicable)

