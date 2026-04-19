import { ENV } from './_core/env';
import type { OrderReceiptPayload } from '@shared/orderReceipt';

type EmailAttachment = {
  filename: string;
  content: string;
};

type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
};

function canSendEmail() {
  return Boolean(ENV.resendApiKey && ENV.resendFromEmail);
}

async function sendEmail({ to, subject, html, text, attachments = [] }: SendEmailArgs) {
  if (!canSendEmail()) {
    return false;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ENV.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: ENV.resendFromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      attachments,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    console.warn(`[Email] Resend send failed (${response.status}): ${errorText}`);
    return false;
  }

  return true;
}

function buildOrderLines(payload: OrderReceiptPayload) {
  return payload.items
    .map((item) => `<li>${item.name} x${item.quantity}</li>`)
    .join('');
}

export async function sendCustomerReceiptEmail(payload: OrderReceiptPayload, receiptPdfBase64: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #101418;">
      <h1>Peaceful Taste Receipt</h1>
      <p>Thank you for your order, ${payload.customerName}.</p>
      <p><strong>Order Number:</strong> ${payload.orderNumber}</p>
      <p><strong>Total:</strong> ₦${payload.totalAmount.toLocaleString('en-NG')}</p>
      <p>Your receipt is attached as a PDF. Please keep it for your records and use your order number when sending payment proof.</p>
      <ul>${buildOrderLines(payload)}</ul>
    </div>
  `;

  const text = `Peaceful Taste Receipt\nOrder Number: ${payload.orderNumber}\nTotal: ₦${payload.totalAmount.toLocaleString('en-NG')}\nThank you for your order.`;

  return sendEmail({
    to: payload.customerEmail,
    subject: `Your Peaceful Taste receipt - ${payload.orderNumber}`,
    html,
    text,
    attachments: [
      {
        filename: `receipt-${payload.orderNumber}.pdf`,
        content: receiptPdfBase64,
      },
    ],
  });
}

export async function sendOwnerOrderEmail(payload: OrderReceiptPayload, receiptPdfBase64: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #101418;">
      <h1>New Peaceful Taste Order</h1>
      <p><strong>Order Number:</strong> ${payload.orderNumber}</p>
      <p><strong>Customer:</strong> ${payload.customerName} (${payload.customerEmail})</p>
      <p><strong>Phone:</strong> ${payload.customerPhone || 'N/A'}</p>
      <p><strong>Total:</strong> ₦${payload.totalAmount.toLocaleString('en-NG')}</p>
      <ul>${buildOrderLines(payload)}</ul>
    </div>
  `;

  const text = `New Peaceful Taste Order\nOrder Number: ${payload.orderNumber}\nCustomer: ${payload.customerName} (${payload.customerEmail})\nTotal: ₦${payload.totalAmount.toLocaleString('en-NG')}`;

  return sendEmail({
    to: ENV.ownerEmail,
    subject: `New Order - ${payload.orderNumber}`,
    html,
    text,
    attachments: [
      {
        filename: `receipt-${payload.orderNumber}.pdf`,
        content: receiptPdfBase64,
      },
    ],
  });
}

export async function sendOwnerPaymentProofEmail(orderNumber: string, receiptLocation: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #101418;">
      <h1>Payment Proof Uploaded</h1>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Stored Location:</strong> ${receiptLocation}</p>
    </div>
  `;

  const text = `Payment proof uploaded for order ${orderNumber}. Stored location: ${receiptLocation}`;

  return sendEmail({
    to: ENV.ownerEmail,
    subject: `Payment Proof - ${orderNumber}`,
    html,
    text,
  });
}

export function emailAutomationAvailable() {
  return canSendEmail();
}
