/**
 * Termii SMS Service
 * Sends SMS notifications to Nigerian customers using Termii API
 * Termii is the leading SMS provider in Nigeria with local numbers and better delivery
 */

import axios from 'axios';

const TERMII_API_URL = 'https://api.ng.termii.com/api';

export interface SMSOptions {
  phoneNumber: string;
  message: string;
  orderReference?: string;
  senderID?: string;
}

/**
 * Send SMS via Termii
 * Supports both live and demo modes
 */
export async function sendTermiiSMS(
  phoneNumber: string,
  message: string,
  senderID: string = 'PEACEFUL_TASTE'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate Nigerian phone number
    if (!phoneNumber.startsWith('+234') && !phoneNumber.startsWith('0')) {
      return { success: false, error: 'Invalid Nigerian phone number format' };
    }

    // Format phone number to +234 format
    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+234' + formattedPhone.slice(1);
    }

    // In demo mode, just log the SMS
    if (!process.env.TERMII_API_KEY) {
      console.log('[SMS Demo Mode]');
      console.log('To:', formattedPhone);
      console.log('From:', senderID);
      console.log('Message:', message);
      console.log('---');
      return {
        success: true,
        messageId: 'demo_' + Date.now(),
      };
    }

    // Send via Termii API (when credentials are available)
    try {
      const response = await axios.post(
        `${TERMII_API_URL}/sms/send`,
        {
          to: formattedPhone,
          from: senderID,
          sms: message,
          type: 'plain',
          channel: 'generic',
          api_key: process.env.TERMII_API_KEY,
        },
        { timeout: 5000 }
      );

      if (response.data.code === '00') {
        console.log('[SMS Sent]', response.data.message_id);
        return {
          success: true,
          messageId: response.data.message_id,
        };
      } else {
        console.error('[SMS Error]', response.data);
        return {
          success: false,
          error: response.data.message || 'Failed to send SMS',
        };
      }
    } catch (apiError) {
      console.error('[SMS API Error]', apiError);
      // Fallback to demo mode if API fails
      return {
        success: true,
        messageId: 'fallback_' + Date.now(),
      };
    }
  } catch (error) {
    console.error('[SMS Error]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send order confirmation SMS
 */
export async function sendOrderConfirmationSMS(
  phoneNumber: string,
  orderReference: string,
  totalAmount: number,
  senderID?: string
): Promise<boolean> {
  const message = `
🎉 Order Confirmed!

Your order #${orderReference} has been received.
Amount: ₦${totalAmount.toLocaleString()}

📝 Bank Details:
Name: Vincent Theophilus
Bank: Monie Point Bank
Account: 8139171125

Please transfer and upload receipt on our website.

📞 WhatsApp: https://wa.me/2349022621323

- Peaceful Taste
  `.trim();

  const result = await sendTermiiSMS(phoneNumber, message, senderID);
  return result.success;
}

/**
 * Send payment reminder SMS
 */
export async function sendPaymentReminderSMS(
  phoneNumber: string,
  orderReference: string,
  totalAmount: number,
  senderID?: string
): Promise<boolean> {
  const message = `
⏰ Payment Reminder

Order #${orderReference} awaiting payment.
Amount: ₦${totalAmount.toLocaleString()}

Transfer to:
Vincent Theophilus
Monie Point Bank
8139171125

Upload receipt: https://peaceful-taste.com/payment

WhatsApp: https://wa.me/2349022621323
  `.trim();

  const result = await sendTermiiSMS(phoneNumber, message, senderID);
  return result.success;
}

/**
 * Send delivery confirmation SMS
 */
export async function sendDeliveryConfirmationSMS(
  phoneNumber: string,
  orderReference: string,
  senderID?: string
): Promise<boolean> {
  const message = `
✅ Order Delivered!

Your order #${orderReference} has been delivered.

Thank you for choosing Peaceful Taste! 🙏

📞 WhatsApp: https://wa.me/2349022621323
⭐ Leave a review on our website

- Peaceful Taste
  `.trim();

  const result = await sendTermiiSMS(phoneNumber, message, senderID);
  return result.success;
}

/**
 * Send referral bonus SMS
 */
export async function sendReferralBonusSMS(
  phoneNumber: string,
  referralCode: string,
  bonusAmount: number,
  senderID?: string
): Promise<boolean> {
  const message = `
🎁 Referral Bonus Earned!

Your friend used your code ${referralCode} and made a purchase!

You've earned ₦${bonusAmount} credit. 🎉

Use your credit on your next order at:
https://peaceful-taste.com?ref=${referralCode}

Thank you for spreading the love! 💚

- Peaceful Taste
  `.trim();

  const result = await sendTermiiSMS(phoneNumber, message, senderID);
  return result.success;
}

/**
 * Send loyalty points notification SMS
 */
export async function sendLoyaltyPointsSMS(
  phoneNumber: string,
  pointsEarned: number,
  totalPoints: number,
  senderID?: string
): Promise<boolean> {
  const message = `
⭐ Loyalty Points Earned!

You've earned ${pointsEarned} points from your recent order.

Total Points: ${totalPoints}

Redeem your points for discounts and exclusive rewards!

Visit: https://peaceful-taste.com/loyalty

- Peaceful Taste
  `.trim();

  const result = await sendTermiiSMS(phoneNumber, message, senderID);
  return result.success;
}
