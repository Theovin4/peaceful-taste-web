import crypto from 'node:crypto';
import { PEACEFUL_TASTE_CONTACT } from '@shared/orderReceipt';

const FLUTTERWAVE_API_BASE = 'https://api.flutterwave.com/v3';
const FLUTTERWAVE_REFERENCE_PREFIX = 'ptflw';
const FLUTTERWAVE_REFERENCE_TTL_MS = 1000 * 60 * 60 * 6;
const FLUTTERWAVE_VERIFY_RETRY_DELAYS_MS = [0, 1500, 3000, 5000, 8000];

export interface FlutterwaveReferencePayload {
  checkoutReference: string;
  createdAt: number;
}

export interface FlutterwaveInitializeInput {
  requestOrigin?: string;
  checkoutReference: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
}

type FlutterwaveVerifiedTransaction = {
  id: string | number;
  amount: number;
  currency: string;
  status: string;
  tx_ref: string;
  charged_amount?: number;
  created_at?: string;
  customer?: {
    email?: string;
    name?: string;
    phone_number?: string;
  };
};

function getFlutterwaveSecretKey() {
  const key = String(process.env.FLW_SECRET_KEY || '').trim();
  if (!key) {
    throw new Error('FLW_SECRET_KEY is required.');
  }

  return key;
}

function getFlutterwavePublicKey() {
  return String(process.env.FLW_PUBLIC_KEY || '').trim();
}

function getSigningSecret() {
  return String(process.env.JWT_SECRET || process.env.FLW_SECRET_KEY || '').trim();
}

function signReference(encodedPayload: string) {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error('JWT_SECRET or FLW_SECRET_KEY is required to sign Flutterwave references.');
  }

  return crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url').slice(0, 16);
}

function encodeReferencePayload(payload: FlutterwaveReferencePayload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodeReferencePayload(value: string): FlutterwaveReferencePayload {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as FlutterwaveReferencePayload;
}

export function createFlutterwaveTxRef(
  payload: Omit<FlutterwaveReferencePayload, 'createdAt'>
) {
  const fullPayload: FlutterwaveReferencePayload = {
    ...payload,
    createdAt: Date.now(),
  };

  const encoded = encodeReferencePayload(fullPayload);
  const signature = signReference(encoded);
  return `${FLUTTERWAVE_REFERENCE_PREFIX}.${encoded}.${signature}`;
}

export function parseAndValidateFlutterwaveTxRef(txRef: string) {
  const [prefix, encoded, signature] = String(txRef || '').split('.');

  if (prefix !== FLUTTERWAVE_REFERENCE_PREFIX || !encoded || !signature) {
    throw new Error('Invalid Flutterwave transaction reference.');
  }

  const expectedSignature = signReference(encoded);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error('Flutterwave transaction reference signature mismatch.');
  }

  const payload = decodeReferencePayload(encoded);
  if (!payload.checkoutReference) {
    throw new Error('Flutterwave transaction reference is incomplete.');
  }

  if (Date.now() - Number(payload.createdAt) > FLUTTERWAVE_REFERENCE_TTL_MS) {
    throw new Error('Flutterwave transaction reference has expired.');
  }

  return payload;
}

export function getFlutterwaveRedirectBaseUrl(requestOrigin?: string) {
  const configuredSiteUrl = String(
    process.env.VITE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || ''
  ).trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/+$/, '');
  }

  if (requestOrigin) {
    return requestOrigin.replace(/\/+$/, '');
  }

  return PEACEFUL_TASTE_CONTACT.siteUrl;
}

export async function initializeFlutterwaveCheckout(input: FlutterwaveInitializeInput) {
  const txRef = createFlutterwaveTxRef({
    checkoutReference: input.checkoutReference,
  });

  const redirectBaseUrl = getFlutterwaveRedirectBaseUrl(input.requestOrigin);

  const response = await fetch(`${FLUTTERWAVE_API_BASE}/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getFlutterwaveSecretKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount: Number(input.amount).toFixed(2),
      currency: 'NGN',
      redirect_url: `${redirectBaseUrl}/payment-status`,
      customer: {
        email: input.customerEmail,
        name: input.customerName,
        phonenumber: input.customerPhone || undefined,
      },
      customizations: {
        title: 'Peaceful Taste Checkout',
        description: `Payment for checkout ${input.checkoutReference}`,
        logo: PEACEFUL_TASTE_CONTACT.logoUrl,
      },
      meta: {
        checkoutReference: input.checkoutReference,
      },
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.status !== 'success' || !payload?.data?.link) {
    throw new Error(payload?.message || 'Flutterwave checkout initialization failed.');
  }

  return {
    checkoutUrl: String(payload.data.link),
    txRef,
    publicKeyConfigured: Boolean(getFlutterwavePublicKey()),
  };
}

export async function verifyFlutterwaveTransaction(transactionId: string) {
  let lastError: Error | null = null;

  for (const delayMs of FLUTTERWAVE_VERIFY_RETRY_DELAYS_MS) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const response = await fetch(`${FLUTTERWAVE_API_BASE}/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getFlutterwaveSecretKey()}`,
        'Content-Type': 'application/json',
      },
    });

    const payload = await response.json().catch(() => null);
    const data = payload?.data as FlutterwaveVerifiedTransaction | undefined;
    const status = String(data?.status || '').toLowerCase();

    if (response.ok && payload?.status === 'success' && data) {
      if (status === 'successful') {
        return data;
      }

      lastError = new Error(
        payload?.message ||
          (status ? `Flutterwave payment is still ${status}.` : 'Flutterwave payment is not yet confirmed.')
      );
      continue;
    }

    lastError = new Error(payload?.message || 'Flutterwave transaction verification failed.');
  }

  throw lastError || new Error('Flutterwave transaction verification failed.');
}
