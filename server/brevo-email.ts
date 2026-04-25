// @ts-nocheck
import SibApiV3Sdk from 'sib-api-v3-sdk';
import { ENV } from './_core/env';

type OrderEmailInput = {
  name: string;
  email: string;
  product: string;
  price: string | number;
};

const BREVO_SENDER = {
  email: 'theovincenzo@gmail.com',
  name: 'Peaceful Taste',
};

function getBrevoClient() {
  const client = SibApiV3Sdk.ApiClient.instance;
  const apiKey = client.authentications['api-key'];
  apiKey.apiKey = ENV.brevoApiKey;
  return new SibApiV3Sdk.TransactionalEmailsApi();
}

function formatPrice(price: string | number) {
  if (typeof price === 'number' && Number.isFinite(price)) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price);
  }

  return String(price);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function brevoEmailAvailable() {
  return Boolean(ENV.brevoApiKey);
}

export async function sendBrevoOrderEmails(input: OrderEmailInput) {
  if (!brevoEmailAvailable()) {
    throw new Error('BREVO_API_KEY is not configured.');
  }

  const transactionalApi = getBrevoClient();
  const safeName = escapeHtml(input.name);
  const safeProduct = escapeHtml(input.product);
  const safeEmail = escapeHtml(input.email);
  const formattedPrice = formatPrice(input.price);
  const safeFormattedPrice = escapeHtml(formattedPrice);

  await Promise.all([
    transactionalApi.sendTransacEmail({
      sender: BREVO_SENDER,
      to: [{ email: input.email, name: input.name }],
      subject: 'Order Received',
      htmlContent: `
        <p>Hi ${safeName}, your order for ${safeProduct} has been received.</p>
        <p>We will contact you on WhatsApp.</p>
      `,
      textContent: `Hi ${input.name}, your order for ${input.product} has been received. We will contact you on WhatsApp.`,
    }),
    transactionalApi.sendTransacEmail({
      sender: BREVO_SENDER,
      to: [{ email: ENV.ownerEmail }],
      subject: 'New Order',
      htmlContent: `
        <h2>New Order</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Product:</strong> ${safeProduct}</p>
        <p><strong>Price:</strong> ${safeFormattedPrice}</p>
      `,
      textContent: [
        'New Order',
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Product: ${input.product}`,
        `Price: ${formattedPrice}`,
      ].join('\n'),
    }),
  ]);
}
