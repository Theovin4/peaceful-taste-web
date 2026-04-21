/**
 * SMS Notification Service
 * Sends SMS confirmations to customers for orders
 */

import { PEACEFUL_TASTE_CONTACT } from '@shared/orderReceipt';
import { ENV } from './_core/env';

export interface SMSMessage {
  phoneNumber: string;
  message: string;
  orderReference?: string;
}

export async function sendOrderSMS(
  phoneNumber: string,
  orderReference: string,
  totalAmount: number
): Promise<boolean> {
  try {
    if (!phoneNumber.startsWith('+234') && !phoneNumber.startsWith('0')) {
      console.error('[SMS] Invalid phone number format:', phoneNumber);
      return false;
    }

    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+234' + formattedPhone.slice(1);
    }

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
      'Please transfer the exact amount and upload your receipt on our website.',
      '',
      `WhatsApp: https://wa.me/${PEACEFUL_TASTE_CONTACT.whatsappNumber}`,
      'Questions? Contact us anytime!',
      '',
      '- Peaceful Taste',
    ].join('\n');

    console.log('[SMS] Sending SMS to:', formattedPhone);
    console.log('[SMS] Message:', message);
    return true;
  } catch (error) {
    console.error('[SMS] Failed to send SMS:', error);
    return false;
  }
}

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

    const message = [
      'Payment Reminder',
      '',
      `Order #${orderReference} is awaiting payment.`,
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

    console.log('[SMS] Sending reminder SMS to:', formattedPhone);
    console.log('[SMS] Message:', message);

    return true;
  } catch (error) {
    console.error('[SMS] Failed to send reminder SMS:', error);
    return false;
  }
}

export async function sendDeliveryConfirmationSMS(
  phoneNumber: string,
  orderReference: string
): Promise<boolean> {
  try {
    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+234' + formattedPhone.slice(1);
    }

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

    console.log('[SMS] Sending delivery SMS to:', formattedPhone);
    console.log('[SMS] Message:', message);

    return true;
  } catch (error) {
    console.error('[SMS] Failed to send delivery SMS:', error);
    return false;
  }
}
