/**
 * SMS Notification Service
 * Sends SMS confirmations to customers for orders
 * Uses Manus built-in notification API
 */

import { ENV } from './_core/env';

export interface SMSMessage {
  phoneNumber: string;
  message: string;
  orderReference?: string;
}

/**
 * Send SMS notification to customer
 * Format: +234XXXXXXXXXX (Nigerian format)
 */
export async function sendOrderSMS(
  phoneNumber: string,
  orderReference: string,
  totalAmount: number
): Promise<boolean> {
  try {
    // Validate Nigerian phone number format
    if (!phoneNumber.startsWith('+234') && !phoneNumber.startsWith('0')) {
      console.error('[SMS] Invalid phone number format:', phoneNumber);
      return false;
    }

    // Format phone number to +234 format if needed
    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+234' + formattedPhone.slice(1);
    }

    const message = `
🎉 Order Confirmed!

Your order #${orderReference} has been received.
Amount: ₦${totalAmount.toLocaleString()}

📝 Bank Details:
Name: Vincent Theophilus
Bank: Monie Point Bank
Account: 8139171125

Please transfer the exact amount and upload your receipt on our website.

📞 WhatsApp: https://wa.me/2349022621323
Questions? Contact us anytime!

- Peaceful Taste
    `.trim();

    // Log SMS for demonstration (in production, integrate with Twilio or local SMS provider)
    console.log('[SMS] Sending SMS to:', formattedPhone);
    console.log('[SMS] Message:', message);

    // TODO: Integrate with actual SMS provider (Twilio, Termii, etc.)
    // For now, we'll log it and return true
    return true;
  } catch (error) {
    console.error('[SMS] Failed to send SMS:', error);
    return false;
  }
}

/**
 * Send payment reminder SMS
 */
export async function sendPaymentReminderSMS(
  phoneNumber: string,
  orderReference: string,
  totalAmount: number
): Promise<boolean> {
  try {
    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+234' + formattedPhone.slice(1);
    }

    const message = `
⏰ Payment Reminder

Order #${orderReference} is awaiting payment.
Amount: ₦${totalAmount.toLocaleString()}

Transfer to:
Vincent Theophilus
Monie Point Bank
8139171125

Upload receipt: https://peaceful-taste.com/payment

WhatsApp: https://wa.me/2349022621323
    `.trim();

    console.log('[SMS] Sending reminder SMS to:', formattedPhone);
    console.log('[SMS] Message:', message);

    return true;
  } catch (error) {
    console.error('[SMS] Failed to send reminder SMS:', error);
    return false;
  }
}

/**
 * Send delivery confirmation SMS
 */
export async function sendDeliveryConfirmationSMS(
  phoneNumber: string,
  orderReference: string
): Promise<boolean> {
  try {
    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+234' + formattedPhone.slice(1);
    }

    const message = `
✅ Order Delivered!

Your order #${orderReference} has been delivered.

Thank you for choosing Peaceful Taste! 🙏

📞 WhatsApp: https://wa.me/2349022621323
⭐ Leave us a review on our website

- Peaceful Taste
    `.trim();

    console.log('[SMS] Sending delivery SMS to:', formattedPhone);
    console.log('[SMS] Message:', message);

    return true;
  } catch (error) {
    console.error('[SMS] Failed to send delivery SMS:', error);
    return false;
  }
}
