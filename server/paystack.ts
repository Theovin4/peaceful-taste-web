import axios from 'axios';

const PAYSTACK_API_KEY = process.env.PAYSTACK_API_KEY || '';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    paid_at: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
      first_name: string;
      last_name: string;
    };
    status: string;
  };
}

export interface PaymentInitializeData {
  email: string;
  amount: number; // Amount in Naira (will be multiplied by 100 for Paystack)
  reference?: string;
  metadata?: Record<string, any>;
}

/**
 * Initialize a Paystack payment transaction
 * @param data Payment initialization data
 * @returns Authorization URL and transaction reference
 */
export async function initializePayment(data: PaymentInitializeData) {
  if (!PAYSTACK_API_KEY) {
    throw new Error('PAYSTACK_API_KEY is not configured');
  }

  try {
    const response = await axios.post<PaystackInitializeResponse>(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: data.email,
        amount: Math.round(data.amount * 100), // Convert to kobo (Paystack uses kobo)
        reference: data.reference,
        metadata: data.metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to initialize payment');
    }

    return {
      success: true,
      authorizationUrl: response.data.data.authorization_url,
      accessCode: response.data.data.access_code,
      reference: response.data.data.reference,
    };
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw new Error(`Payment initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify a Paystack payment transaction
 * @param reference Transaction reference
 * @returns Transaction details
 */
export async function verifyPayment(reference: string) {
  if (!PAYSTACK_API_KEY) {
    throw new Error('PAYSTACK_API_KEY is not configured');
  }

  try {
    const response = await axios.get<PaystackVerifyResponse>(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_API_KEY}`,
        },
      }
    );

    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to verify payment');
    }

    return {
      success: true,
      status: response.data.data.status,
      amount: response.data.data.amount / 100, // Convert back from kobo to Naira
      reference: response.data.data.reference,
      paidAt: response.data.data.paid_at,
      customer: {
        email: response.data.data.customer.email,
        firstName: response.data.data.customer.first_name,
        lastName: response.data.data.customer.last_name,
      },
    };
  } catch (error) {
    console.error('Paystack verification error:', error);
    throw new Error(`Payment verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create a unique payment reference
 */
export function generatePaymentReference(): string {
  return `PT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
