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

type OrderNotificationPayload = {
  name: string;
  email: string;
  product: string;
  price: string | number;
};

function formatNairaValue(value: string | number) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `₦${value.toLocaleString('en-NG')}`;
  }

  return String(value);
}

export async function sendOrderNotificationEmails(payload: OrderNotificationPayload) {
  if (!canSendEmail()) {
    throw new Error('Resend email configuration is not available.');
  }

  const formattedPrice = formatNairaValue(payload.price);

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #101418;">
      <h1>Order Received</h1>
      <p>Hi ${payload.name}, your order for ${payload.product} has been received.</p>
      <p>We will contact you on WhatsApp.</p>
    </div>
  `;

  const customerText = `Hi ${payload.name}, your order for ${payload.product} has been received. We will contact you on WhatsApp.`;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #101418;">
      <h1>New Order</h1>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Product:</strong> ${payload.product}</p>
      <p><strong>Price:</strong> ${formattedPrice}</p>
    </div>
  `;

  const adminText = [
    'New Order',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Product: ${payload.product}`,
    `Price: ${formattedPrice}`,
  ].join('\n');

  const [customerSent, ownerSent] = await Promise.all([
    sendEmail({
      to: payload.email,
      subject: 'Order Received',
      html: customerHtml,
      text: customerText,
    }),
    sendEmail({
      to: ENV.ownerEmail,
      subject: 'New Order',
      html: adminHtml,
      text: adminText,
    }),
  ]);

  if (!customerSent || !ownerSent) {
    throw new Error('Failed to send one or more order notification emails.');
  }

  return true;
}
