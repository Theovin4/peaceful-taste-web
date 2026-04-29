// @ts-nocheck
import { COOKIE_NAME } from '@shared/const';
import { PEACEFUL_TASTE_CONTACT } from '@shared/orderReceipt';
import {
  clearAdminSessionCookie,
  createAdminSessionToken,
  isValidAdminPassword,
  setAdminSessionCookie,
} from './_core/adminSession';
import { getSessionCookieOptions } from './_core/cookies';
import { systemRouter } from './_core/systemRouter';
import { adminSessionProcedure, publicProcedure, router } from './_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { notifyOwner } from './_core/notification';
import { addOrderToExcel, addInquiryToExcel, deleteOrdersFromExcel, getWorkbookSummary, initializeAllWorkbooks, updateOrderInExcel, updateOrderReceiptInExcel } from './excel-storage';
import { sendOrderConfirmationSMS } from './termii-sms';
import { generateOrderReceipt } from './pdf-receipt';
import { sendCustomerReceiptEmail, sendOwnerOrderEmail, sendOwnerPaymentProofEmail } from './email';
import {
  buildBusinessEmailUrl,
  buildBusinessWhatsAppUrl,
  buildReceiptText,
  formatNairaAmount,
  type OrderReceiptPayload,
} from '@shared/orderReceipt';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { uploadPrivateBlob } from './blob-storage';
import { initializeFlutterwaveCheckout, parseAndValidateFlutterwaveTxRef, verifyFlutterwaveTransaction } from './flutterwave';
import { enforceRateLimit } from './_core/rateLimit';
import { createPendingCheckout, getPendingCheckout, updatePendingCheckout } from './pending-checkouts';
import {
  clearAllProductImages,
  clearProductImage,
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getCatalog,
  updateProduct,
  updateSiteSettings,
} from './catalog-storage';

const imageUrlInputSchema = z
  .string()
  .optional()
  .refine((value) => {
    if (!value || value === '') return true;
    if (value.startsWith('data:image/')) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, 'Image must be a valid URL or uploaded image data.');

function ensureReceiptDir() {
  const baseDir = process.env.VERCEL
    ? path.join(os.tmpdir(), 'peaceful-taste-data')
    : path.join(process.cwd(), 'data');
  const receiptDir = path.join(baseDir, 'receipts');
  if (!fs.existsSync(receiptDir)) {
    fs.mkdirSync(receiptDir, { recursive: true });
  }
  return receiptDir;
}

function saveDataUrlToFile(orderNumber: string, receiptName: string, receiptDataUrl: string) {
  const dataUrlMatch = receiptDataUrl.match(/^data:(.+?);base64,(.+)$/);

  if (!dataUrlMatch) {
    throw new Error('Receipt file must be uploaded as a valid data URL.');
  }

  const [, mimeType, base64Content] = dataUrlMatch;
  const extension = mimeType.includes('pdf')
    ? 'pdf'
    : mimeType.includes('png')
      ? 'png'
      : mimeType.includes('jpeg') || mimeType.includes('jpg')
        ? 'jpg'
        : 'bin';
  const safeName = receiptName.replace(/[^a-zA-Z0-9._-]/g, '-');
  const outputPath = path.join(ensureReceiptDir(), `${orderNumber}-${Date.now()}-${safeName}.${extension}`);

  fs.writeFileSync(outputPath, Buffer.from(base64Content, 'base64'));
  return outputPath;
}

async function persistReceipt(orderNumber: string, receiptName: string, receiptDataUrl: string) {
  const localPath = saveDataUrlToFile(orderNumber, receiptName, receiptDataUrl);
  const fileBuffer = fs.readFileSync(localPath);
  const mimeType = receiptDataUrl.match(/^data:(.+?);base64,/)?.[1] || 'application/octet-stream';
  const blobPathname = `receipts/${orderNumber}/${Date.now()}-${receiptName.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
  const blob = await uploadPrivateBlob(blobPathname, fileBuffer, mimeType);

  return {
    localPath,
    storedLocation: blob?.pathname || localPath,
    storedUrl: blob?.url || null,
  };
}

async function createFinalizedOrderArtifacts(input: {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  deliveryLocation: string;
  deliveryAddress: string;
  items: Array<{ productId: string | number; name: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  paymentMethod: 'flutterwave' | 'bank_transfer';
  status: string;
  paymentStatus: string;
  notes?: string;
  receiptUrl?: string;
}) {
  const totalAmount = input.subtotal + input.tax + input.shippingCost;
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const createdAt = new Date().toISOString();
  const receiptPayload: OrderReceiptPayload = {
    orderNumber,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    deliveryLocation: input.deliveryLocation,
    deliveryAddress: input.deliveryAddress,
    createdAt,
    items: input.items,
    subtotal: input.subtotal,
    tax: input.tax,
    shippingCost: input.shippingCost,
    totalAmount,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus,
  };

  const receiptBuffer = await generateOrderReceipt(receiptPayload);
  const receiptBase64 = receiptBuffer.toString('base64');
  const receiptText = buildReceiptText(receiptPayload);
  const businessWhatsAppUrl = buildBusinessWhatsAppUrl(receiptPayload);
  const businessEmailUrl = buildBusinessEmailUrl(receiptPayload);

  await initializeAllWorkbooks();
  await addOrderToExcel({
    orderNumber,
    createdAt,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    deliveryLocation: input.deliveryLocation,
    deliveryAddress: input.deliveryAddress,
    items: input.items,
    subtotal: input.subtotal,
    tax: input.tax,
    shippingCost: input.shippingCost,
    totalAmount,
    paymentMethod: input.paymentMethod,
    status: input.status,
    receiptUrl: input.receiptUrl,
    notes: input.notes,
  });

  await notifyOwner({
    title: `New Paid Order: ${orderNumber}`,
    content: `Customer: ${input.customerName} (${input.customerEmail})\nPhone: ${input.customerPhone || 'N/A'}\nDelivery: ${input.deliveryLocation}\nAddress: ${input.deliveryAddress}\nTotal: ${formatNairaAmount(totalAmount)}\nPayment Method: ${input.paymentMethod}\n\nItems:\n${input.items.map((i) => `- ${i.name} x${i.quantity} @ ${formatNairaAmount(i.price)}`).join('\n')}`,
  });

  sendOwnerOrderEmail(receiptPayload, receiptBase64).catch((error) =>
    console.warn('[Email] Failed to send owner order email:', error)
  );
  sendCustomerReceiptEmail(receiptPayload, receiptBase64).catch((error) =>
    console.warn('[Email] Failed to send customer receipt email:', error)
  );

  if (input.customerPhone) {
    sendOrderConfirmationSMS(input.customerPhone, orderNumber, totalAmount).catch((err) =>
      console.error('[SMS] Failed to send order confirmation:', err)
    );
  }

  return {
    success: true,
    orderNumber,
    totalAmount,
    receipt: {
      fileName: `receipt-${orderNumber}.pdf`,
      pdfBase64: receiptBase64,
      receiptText,
      businessWhatsAppUrl,
      businessEmailUrl,
      payload: receiptPayload,
    },
  };
}

async function waitForPendingCheckoutRecord(checkoutReference: string) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const pending = await getPendingCheckout(checkoutReference);
    if (pending) {
      return pending;
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  return null;
}

export const appRouter = router({
  system: systemRouter,
  catalog: router({
    getCatalog: publicProcedure.query(async () => {
      return getCatalog();
    }),

    createCategory: adminSessionProcedure
      .input(z.object({
        name: z.string().min(2).max(80),
        description: z.string().min(4).max(180),
      }))
      .mutation(async ({ input }) => {
        try {
          return await createCategory(input);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to create category',
          });
        }
      }),

    deleteCategory: adminSessionProcedure
      .input(z.object({ categoryId: z.string().min(1) }))
      .mutation(async ({ input }) => {
        try {
          return await deleteCategory(input.categoryId);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to delete category',
          });
        }
      }),

    createProduct: adminSessionProcedure
      .input(z.object({
        name: z.string().min(2).max(120),
        categoryId: z.string().min(1).max(60),
        price: z.number().positive().max(1000000),
        imageUrl: imageUrlInputSchema,
        imageDataUrl: z.string().optional(),
        imageFileName: z.string().optional(),
        description: z.string().min(8).max(500),
        size: z.string().max(60).optional().or(z.literal('')),
        isBestSeller: z.boolean().optional(),
        isNew: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          return await createProduct(input);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to create product',
          });
        }
      }),

    updateProduct: adminSessionProcedure
      .input(z.object({
        productId: z.string().min(1).max(120),
        name: z.string().min(2).max(120),
        categoryId: z.string().min(1).max(60),
        price: z.number().positive().max(1000000),
        clearImage: z.boolean().optional(),
        imageUrl: imageUrlInputSchema,
        imageDataUrl: z.string().optional(),
        imageFileName: z.string().optional(),
        description: z.string().min(8).max(500),
        size: z.string().max(60).optional().or(z.literal('')),
        isBestSeller: z.boolean().optional(),
        isNew: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          return await updateProduct(input);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to update product',
          });
        }
      }),

    clearProductImage: adminSessionProcedure
      .input(z.object({ productId: z.string().min(1).max(120) }))
      .mutation(async ({ input }) => {
        try {
          return await clearProductImage(input.productId);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to clear product image',
          });
        }
      }),

    deleteProduct: adminSessionProcedure
      .input(z.object({ productId: z.string().min(1) }))
      .mutation(async ({ input }) => {
        try {
          return await deleteProduct(input.productId);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to delete product',
          });
        }
      }),

    clearAllProductImages: adminSessionProcedure
      .mutation(async () => {
        try {
          return await clearAllProductImages();
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to clear product images',
          });
        }
      }),

    updateSiteSettings: adminSessionProcedure
      .input(z.object({
        featuredStoryProductId: z.string().min(1).max(120),
        flashDealProductIds: z.array(z.string().min(1).max(120)).min(1).max(6),
      }))
      .mutation(async ({ input }) => {
        try {
          return await updateSiteSettings(input);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to update site settings',
          });
        }
      }),
  }),

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  admin: router({
    status: publicProcedure.query(({ ctx }) => ({
      isAuthenticated: ctx.isAdminSession,
    })),

    login: publicProcedure
      .input(z.object({
        password: z.string().min(1).max(200),
      }))
      .mutation(({ ctx, input }) => {
        try {
          enforceRateLimit(ctx.req, 'admin-login', 8, 1000 * 60 * 10);
        } catch (error) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: error instanceof Error ? error.message : 'Too many login attempts',
          });
        }

        if (!isValidAdminPassword(input.password)) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Invalid admin password',
          });
        }

        setAdminSessionCookie(ctx.res, createAdminSessionToken());
        return { success: true } as const;
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      clearAdminSessionCookie(ctx.res);
      return { success: true } as const;
    }),

    deleteOrderRecords: adminSessionProcedure
      .input(
        z.object({
          orderNumbers: z.array(z.string().regex(/^ORD-\d+-[a-z0-9]{5}$/)).min(1).max(50),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await deleteOrdersFromExcel(input.orderNumbers);
          return {
            success: true,
            removedCount: result.removedCount,
            removedOrderNumbers: result.removedOrderNumbers,
          } as const;
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to delete order records',
          });
        }
      }),
  }),

  orders: router({
    createPendingCheckout: publicProcedure
      .input(z.object({
        customerEmail: z.string().email().max(255),
        customerName: z.string().min(1).max(100),
        customerPhone: z.string().regex(/^[0-9+\-() ]{10,20}$/).optional(),
        deliveryLocation: z.string().min(1).max(100),
        deliveryAddress: z.string().min(8).max(300),
        items: z.array(z.object({
          productId: z.union([z.number().positive(), z.string().min(1).max(120)]),
          name: z.string().min(1).max(200),
          quantity: z.number().int().positive().max(1000),
          price: z.number().positive().max(1000000),
        })).min(1).max(100),
        subtotal: z.number().positive(),
        tax: z.number().nonnegative(),
        shippingCost: z.number().nonnegative(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          enforceRateLimit(ctx.req, 'create-pending-checkout', 12, 1000 * 60 * 15);

          const checkout = await createPendingCheckout({
            customerEmail: input.customerEmail,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            deliveryLocation: input.deliveryLocation,
            deliveryAddress: input.deliveryAddress,
            items: input.items,
            subtotal: input.subtotal,
            tax: input.tax,
            shippingCost: input.shippingCost,
            totalAmount: input.subtotal + input.tax + input.shippingCost,
          });

          return {
            success: true,
            checkoutReference: checkout.checkoutReference,
            totalAmount: checkout.totalAmount,
            subtotal: checkout.subtotal,
            tax: checkout.tax,
            shippingCost: checkout.shippingCost,
            deliveryLocation: checkout.deliveryLocation,
            deliveryAddress: checkout.deliveryAddress,
            items: checkout.items,
            customerName: checkout.customerName,
            customerEmail: checkout.customerEmail,
            customerPhone: checkout.customerPhone,
          };
        } catch (error) {
          console.error('Pending checkout creation error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to start checkout',
          });
        }
      }),

    createOrder: publicProcedure
      .input(z.object({
        customerEmail: z.string().email().max(255),
        customerName: z.string().min(1).max(100),
        customerPhone: z.string().regex(/^[0-9+\-() ]{10,20}$/).optional(),
        deliveryLocation: z.string().min(1).max(100).default('Lagos'),
        deliveryAddress: z.string().min(8).max(300),
        items: z.array(z.object({
          productId: z.union([z.number().positive(), z.string().min(1).max(120)]),
          name: z.string().min(1).max(200),
          quantity: z.number().int().positive().max(1000),
          price: z.number().positive().max(1000000),
        })).min(1).max(100),
        subtotal: z.number().positive(),
        tax: z.number().nonnegative(),
        shippingCost: z.number().nonnegative().default(500),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          enforceRateLimit(ctx.req, 'create-order', 10, 1000 * 60 * 15);
          const totalAmount = input.subtotal + input.tax + input.shippingCost;
          const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          const createdAt = new Date().toISOString();
          const receiptPayload: OrderReceiptPayload = {
            orderNumber,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            deliveryLocation: input.deliveryLocation,
            deliveryAddress: input.deliveryAddress,
            createdAt,
            items: input.items,
            subtotal: input.subtotal,
            tax: input.tax,
            shippingCost: input.shippingCost,
            totalAmount,
            paymentMethod: 'pending_customer_choice',
            paymentStatus: 'Awaiting payment',
          };

          const receiptBuffer = await generateOrderReceipt(receiptPayload);
          const receiptBase64 = receiptBuffer.toString('base64');
          const receiptText = buildReceiptText(receiptPayload);
          const businessWhatsAppUrl = buildBusinessWhatsAppUrl(receiptPayload);
          const businessEmailUrl = buildBusinessEmailUrl(receiptPayload);

          await initializeAllWorkbooks();

          await addOrderToExcel({
            orderNumber,
            createdAt,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            deliveryAddress: input.deliveryAddress,
            items: input.items,
            subtotal: input.subtotal,
            tax: input.tax,
            shippingCost: input.shippingCost,
            totalAmount,
            paymentMethod: 'pending_customer_choice',
            status: 'pending',
          });

          await notifyOwner({
            title: `New Order: ${orderNumber}`,
            content: `Customer: ${input.customerName} (${input.customerEmail})\nPhone: ${input.customerPhone || 'N/A'}\nDelivery: ${input.deliveryLocation}\nAddress: ${input.deliveryAddress}\nTotal: ${formatNairaAmount(totalAmount)}\nPayment Bank: ${PEACEFUL_TASTE_CONTACT.bankName}\nAccount: ${PEACEFUL_TASTE_CONTACT.accountNumber}\n\nItems:\n${input.items.map((i) => `- ${i.name} x${i.quantity} @ ${formatNairaAmount(i.price)}`).join('\n')}`,
          });

          sendOwnerOrderEmail(receiptPayload, receiptBase64).catch((error) =>
            console.warn('[Email] Failed to send owner order email:', error)
          );
          sendCustomerReceiptEmail(receiptPayload, receiptBase64).catch((error) =>
            console.warn('[Email] Failed to send customer receipt email:', error)
          );

          if (input.customerPhone) {
            sendOrderConfirmationSMS(input.customerPhone, orderNumber, totalAmount).catch((err) =>
              console.error('[SMS] Failed to send order confirmation:', err)
            );
          }

          return {
            success: true,
            orderNumber,
            totalAmount,
            receipt: {
              fileName: `receipt-${orderNumber}.pdf`,
              pdfBase64: receiptBase64,
              receiptText,
              businessWhatsAppUrl,
              businessEmailUrl,
              payload: receiptPayload,
            },
          };
        } catch (error) {
          console.error('Order creation error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to create order',
          });
        }
      }),

    initializeFlutterwaveCheckout: publicProcedure
      .input(z.object({
        checkoutReference: z.string().regex(/^CHK-\d+-[A-Z0-9]{6}$/).max(60),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          enforceRateLimit(ctx.req, 'flutterwave-init', 10, 1000 * 60 * 15);
          const pending = await waitForPendingCheckoutRecord(input.checkoutReference);
          if (!pending) {
            throw new Error('Checkout reference not found.');
          }

          const requestOrigin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.get('host')}`;
          const checkout = await initializeFlutterwaveCheckout({
            requestOrigin,
            checkoutReference: pending.checkoutReference,
            amount: pending.totalAmount,
            customerName: pending.customerName,
            customerEmail: pending.customerEmail,
            customerPhone: pending.customerPhone,
          });

          await updatePendingCheckout(input.checkoutReference, {
            paymentMethod: 'flutterwave',
            status: 'flutterwave_initialized',
            notes: 'Flutterwave checkout initialized.',
          });

          return {
            success: true,
            checkoutUrl: checkout.checkoutUrl,
            txRef: checkout.txRef,
          };
        } catch (error) {
          console.error('Flutterwave checkout initialization error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to initialize Flutterwave checkout',
          });
        }
      }),

    verifyFlutterwavePayment: publicProcedure
      .input(z.object({
        transactionId: z.string().min(1).max(120),
        txRef: z.string().min(10).max(300),
        status: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const reference = parseAndValidateFlutterwaveTxRef(input.txRef);
          enforceRateLimit(
            ctx.req,
            'flutterwave-verify',
            8,
            1000 * 60 * 10,
            `${reference.checkoutReference}:${input.transactionId}`
          );
          const pending = await waitForPendingCheckoutRecord(reference.checkoutReference);
          if (!pending) {
            throw new Error('Checkout reference not found.');
          }

          if (pending.orderNumber) {
            return {
              success: true,
              status: 'successful' as const,
              message: 'Flutterwave payment was already verified.',
              orderNumber: pending.orderNumber,
            };
          }

          if (String(input.status || '').toLowerCase() === 'cancelled') {
            await updatePendingCheckout(reference.checkoutReference, {
              paymentMethod: 'flutterwave',
              status: 'cancelled',
              notes: 'Customer cancelled Flutterwave checkout before completion.',
            });

            return {
              success: false,
              status: 'cancelled' as const,
              message: 'You cancelled the Flutterwave payment before it completed.',
            };
          }

          const verified = await verifyFlutterwaveTransaction(input.transactionId);

          const verifiedStatus = String(verified.status || '').toLowerCase();
          const verifiedTxRef = String(verified.tx_ref || '');
          const verifiedAmount = Number(verified.charged_amount || verified.amount || 0);
          const amountMatches = verifiedAmount >= Number(pending.totalAmount);
          const referenceMatches = verifiedTxRef === input.txRef;
          const currencyMatches = String(verified.currency || '').toUpperCase() === 'NGN';

          if (!referenceMatches || !amountMatches || !currencyMatches || verifiedStatus !== 'successful') {
            await updatePendingCheckout(reference.checkoutReference, {
              paymentMethod: 'flutterwave',
              status: 'cancelled',
              notes: `Flutterwave verification failed for transaction ${input.transactionId}. Verified status: ${verifiedStatus || 'unknown'}, tx_ref match: ${referenceMatches}, amount: ${verifiedAmount}, currency: ${String(verified.currency || 'unknown')}.`,
            });

            return {
              success: false,
              status: 'failed' as const,
              message: 'We could not confirm this Flutterwave payment.',
            };
          }

          const finalizedOrder = await createFinalizedOrderArtifacts({
            customerEmail: pending.customerEmail,
            customerName: pending.customerName,
            customerPhone: pending.customerPhone,
            deliveryLocation: pending.deliveryLocation,
            deliveryAddress: pending.deliveryAddress,
            items: pending.items,
            subtotal: pending.subtotal,
            tax: pending.tax,
            shippingCost: pending.shippingCost,
            paymentMethod: 'flutterwave',
            status: 'payment_verified',
            paymentStatus: 'Payment verified successfully',
            notes: `Flutterwave payment verified. Transaction ${verified.id}.`,
          });

          await updatePendingCheckout(reference.checkoutReference, {
            paymentMethod: 'flutterwave',
            status: 'completed',
            orderNumber: finalizedOrder.orderNumber,
            notes: `Flutterwave payment verified. Transaction ${verified.id}.`,
          });

          await notifyOwner({
            title: `Flutterwave Payment Verified: ${finalizedOrder.orderNumber}`,
            content: `Order ${finalizedOrder.orderNumber} was verified successfully via Flutterwave.\nTransaction ID: ${verified.id}\nAmount: ${formatNairaAmount(Number(verified.amount))}\nCustomer: ${pending.customerName} (${pending.customerEmail})`,
          });

          return {
            success: true,
            status: 'successful' as const,
            message: 'Flutterwave payment verified successfully.',
            orderNumber: finalizedOrder.orderNumber,
            receipt: finalizedOrder.receipt,
            payment: {
              transactionId: String(verified.id),
              txRef: verifiedTxRef,
              amount: verifiedAmount,
              currency: verified.currency,
              customerName: verified.customer?.name || pending.customerName,
              customerEmail: verified.customer?.email || pending.customerEmail,
              customerPhone: verified.customer?.phone_number || pending.customerPhone || '',
              paidAt: verified.created_at || '',
            },
          };
        } catch (error) {
          console.error('Flutterwave payment verification error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to verify Flutterwave payment',
          });
        }
      }),

    uploadReceipt: publicProcedure
      .input(z.object({
        orderNumber: z.string().regex(/^ORD-\d+-[a-z0-9]{5}$/).max(50).optional(),
        checkoutReference: z.string().regex(/^CHK-\d+-[A-Z0-9]{6}$/).max(60).optional(),
        receiptName: z.string().min(1).max(255),
        receiptDataUrl: z.string().min(32).max(8_000_000),
        paymentMethod: z.enum(['bank_transfer', 'flutterwave']).default('bank_transfer'),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          enforceRateLimit(ctx.req, 'upload-receipt', 12, 1000 * 60 * 15);
          const receiptKey = input.orderNumber || input.checkoutReference;
          if (!receiptKey) {
            throw new Error('Order number or checkout reference is required.');
          }

          const persistedReceipt = await persistReceipt(receiptKey, input.receiptName, input.receiptDataUrl);

          if (input.orderNumber) {
            const workbookUpdated = await updateOrderReceiptInExcel(
              input.orderNumber,
              persistedReceipt.storedLocation,
              'receipt_uploaded',
              {
                paymentMethod: input.paymentMethod,
                notes: `Payment proof uploaded via ${input.paymentMethod === 'flutterwave' ? 'Flutterwave' : 'bank transfer'}.`,
              }
            );

            await notifyOwner({
              title: `Payment Receipt: ${input.orderNumber}`,
              content: `Order ${input.orderNumber} receipt uploaded.\nPayment method: ${input.paymentMethod}\nStored at: ${persistedReceipt.storedLocation}\nWorkbook updated: ${workbookUpdated ? 'yes' : 'no'}`,
            });

            sendOwnerPaymentProofEmail(
              `${input.orderNumber} (${input.paymentMethod === 'flutterwave' ? 'Flutterwave' : 'Bank Transfer'})`,
              persistedReceipt.storedLocation
            ).catch((error) =>
              console.warn('[Email] Failed to send payment proof email:', error)
            );

            return {
              success: true,
              message: 'Receipt uploaded successfully',
              savedReceiptPath: persistedReceipt.storedLocation,
              savedReceiptUrl: persistedReceipt.storedUrl,
              workbookUpdated,
            };
          }

          const pending = await waitForPendingCheckoutRecord(input.checkoutReference!);
          if (!pending) {
            throw new Error('Checkout reference not found.');
          }

          if (pending.orderNumber) {
            return {
              success: true,
              message: 'Receipt already uploaded and order already created.',
              savedReceiptPath: persistedReceipt.storedLocation,
              savedReceiptUrl: persistedReceipt.storedUrl,
              workbookUpdated: true,
              orderNumber: pending.orderNumber,
            };
          }

          const finalizedOrder = await createFinalizedOrderArtifacts({
            customerEmail: pending.customerEmail,
            customerName: pending.customerName,
            customerPhone: pending.customerPhone,
            deliveryLocation: pending.deliveryLocation,
            deliveryAddress: pending.deliveryAddress,
            items: pending.items,
            subtotal: pending.subtotal,
            tax: pending.tax,
            shippingCost: pending.shippingCost,
            paymentMethod: 'bank_transfer',
            status: 'receipt_uploaded',
            paymentStatus: 'Payment proof uploaded',
            notes: 'Bank transfer proof uploaded by customer.',
            receiptUrl: persistedReceipt.storedLocation,
          });

          await updatePendingCheckout(input.checkoutReference!, {
            paymentMethod: 'bank_transfer',
            status: 'bank_transfer_submitted',
            orderNumber: finalizedOrder.orderNumber,
            receiptUrl: persistedReceipt.storedLocation,
            notes: 'Bank transfer proof uploaded by customer.',
          });

          await notifyOwner({
            title: `Bank Transfer Receipt: ${finalizedOrder.orderNumber}`,
            content: `Checkout ${input.checkoutReference} created order ${finalizedOrder.orderNumber} after bank transfer proof upload.\nStored at: ${persistedReceipt.storedLocation}`,
          });

          sendOwnerPaymentProofEmail(
            `${finalizedOrder.orderNumber} (Bank Transfer)`,
            persistedReceipt.storedLocation
          ).catch((error) =>
            console.warn('[Email] Failed to send payment proof email:', error)
          );

          return {
            success: true,
            message: 'Receipt uploaded successfully',
            savedReceiptPath: persistedReceipt.storedLocation,
            savedReceiptUrl: persistedReceipt.storedUrl,
            workbookUpdated: true,
            orderNumber: finalizedOrder.orderNumber,
            receipt: finalizedOrder.receipt,
          };
        } catch (error) {
          console.error('Receipt upload error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to upload receipt',
          });
        }
      }),

    dashboardSummary: adminSessionProcedure.query(async () => {
      try {
        return await getWorkbookSummary();
      } catch (error) {
        console.error('Dashboard summary error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to load dashboard summary',
        });
      }
    }),
  }),

  inquiries: router({
    createInquiry: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        email: z.string().email().max(255),
        phone: z.string().regex(/^[0-9+\-() ]{10,20}$/).optional(),
        subject: z.string().min(1).max(200),
        message: z.string().min(1).max(5000),
        inquiryType: z.enum(['general', 'catering', 'bulk_order', 'complaint', 'feedback']).default('general'),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          enforceRateLimit(ctx.req, 'create-inquiry', 10, 1000 * 60 * 15);
          await initializeAllWorkbooks();

          await addInquiryToExcel({
            name: input.name,
            email: input.email,
            phone: input.phone,
            subject: input.subject,
            message: input.message,
            inquiryType: input.inquiryType,
            status: 'new',
          });

          await notifyOwner({
            title: `New Inquiry: ${input.subject}`,
            content: `From: ${input.name} (${input.email})\nPhone: ${input.phone || 'N/A'}\nType: ${input.inquiryType}\n\nMessage:\n${input.message}`,
          });

          return {
            success: true,
            message: 'Inquiry submitted successfully',
          };
        } catch (error) {
          console.error('Inquiry creation error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to create inquiry',
          });
        }
      }),

    getAllInquiries: publicProcedure.query(async () => {
      try {
        return { success: true, message: 'Check Excel file for inquiries' };
      } catch (error) {
        console.error('Get inquiries error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get inquiries',
        });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
