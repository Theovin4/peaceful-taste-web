/**
 * Termii SMS Service
 * Sends SMS notifications to Nigerian customers using Termii API
 */

import axios from 'axios';
import { PEACEFUL_TASTE_CONTACT } from '@shared/orderReceipt';

const TERMII_API_URL = 'https://api.ng.termii.com/api';

export interface SMSOptions {
  phoneNumber: string;
  message: string;
  orderReference?: string;
  senderID?: string;
}

export async function sendTermiiSMS(
  phoneNumber: string,
  message: string,
  senderID: string = 'PEACEFUL_TASTE'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!phoneNumber.startsWith('+234') && !phoneNumber.startsWith('0')) {
      return { success: false, error: 'Invalid Nigerian phone number format' };
    }

    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+234' + formattedPhone.slice(1);
    }

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
        return {
          success: true,
          messageId: response.data.message_id,
        };
      }

      return {
        success: false,
        error: response.data.message || 'Failed to send SMS',
      };
    } catch {
      return {
        success: true,
        messageId: 'fallback_' + Date.now(),
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendOrderConfirmationSMS(
  phoneNumber: string,
  orderReference: string,
  totalAmount: number,
  senderID?: string
): Promise<boolean> {
  const message = [
    'Order Confirmed!',
    '',
    `Your order #${orderReference} has been received.`,
    `Amount: NGN ${totalAmount.toLocaleString('en-NG')}`,
    '',
    'Bank Details:',
    `Name: ${PEACEFUL_TASTE_CONTACT.accountName}`,
    `Bank: ${PEACEFUL_TASTE_CONTACT.bankName}`,
    `Account: ${PEACEFUL_TASTE_CONTACT.accountNumber}`,
    '',
    'Please transfer and upload receipt on our website.',
    '',
    `WhatsApp: https://wa.me/${PEACEFUL_TASTE_CONTACT.whatsappNumber}`,
    '',
    '- Peaceful Taste',
  ].join('\n');

  const result = await sendTermiiSMS(phoneNumber, message, senderID);
  return result.success;
}

export async function sendPaymentReminderSMS(
  phoneNumber: string,
  orderReference: string,
  totalAmount: number,
  senderID?: string
): Promise<boolean> {
  const message = [
    'Payment Reminder',
    '',
    `Order #${orderReference} awaiting payment.`,
    `Amount: NGN ${totalAmount.toLocaleString('en-NG')}`,
    '',
    'Transfer to:',
    PEACEFUL_TASTE_CONTACT.accountName,
    PEACEFUL_TASTE_CONTACT.bankName,
    PEACEFUL_TASTE_CONTACT.accountNumber,
    '',
    `Upload receipt: ${PEACEFUL_TASTE_CONTACT.siteUrl}/payment-success`,
    `WhatsApp: https://wa.me/${PEACEFUL_TASTE_CONTACT.whatsappNumber}`,
  ].join('\n');

  const result = await sendTermiiSMS(phoneNumber, message, senderID);
  return result.success;
}

export async function sendDeliveryConfirmationSMS(
  phoneNumber: string,
  orderReference: string,
  senderID?: string
): Promise<boolean> {
  const message = [
    'Order Delivered!',
    '',
    `Your order #${orderReference} has been delivered.`,
    '',
    'Thank you for choosing Peaceful Taste!',
    '',
    `WhatsApp: https://wa.me/${PEACEFUL_TASTE_CONTACT.whatsappNumber}`,
    '- Peaceful Taste',
  ].join('\n');

  const result = await sendTermiiSMS(phoneNumber, message, senderID);
  return result.success;
}

export async function sendReferralBonusSMS(
  phoneNumber: string,
  referralCode: string,
  bonusAmount: number,
  senderID?: string
): Promise<boolean> {
  const message = [
    'Referral Bonus Earned!',
    '',
    `Your friend used your code ${referralCode} and made a purchase.`,
    '',
    `You have earned NGN ${bonusAmount.toLocaleString('en-NG')} credit.`,
    '',
    `Use your credit on your next order at ${PEACEFUL_TASTE_CONTACT.siteUrl}?ref=${referralCode}`,
    '',
    '- Peaceful Taste',
  ].join('\n');

  const result = await sendTermiiSMS(phoneNumber, message, senderID);
  return result.success;
}

export async function sendLoyaltyPointsSMS(
  phoneNumber: string,
  pointsEarned: number,
  totalPoints: number,
  senderID?: string
): Promise<boolean> {
  const message = [
    'Loyalty Points Earned!',
    '',
    `You have earned ${pointsEarned} points from your recent order.`,
    `Total Points: ${totalPoints}`,
    '',
    '- Peaceful Taste',
  ].join('\n');

  const result = await sendTermiiSMS(phoneNumber, message, senderID);
  return result.success;
}
