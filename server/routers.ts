// @ts-nocheck
import { COOKIE_NAME } from '@shared/const';
import { getSessionCookieOptions } from './_core/cookies';
import { systemRouter } from './_core/systemRouter';
import { publicProcedure, router } from './_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { notifyOwner } from './_core/notification';
import { addOrderToExcel, addInquiryToExcel, getWorkbookSummary, initializeAllWorkbooks, updateOrderReceiptInExcel } from './excel-storage';
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
import path from 'node:path';
import { uploadPrivateBlob } from './blob-storage';

initializeAllWorkbooks().catch((err) => console.error('[Excel] Initialization error:', err));

function ensureReceiptDir() {
  const receiptDir = path.join(process.cwd(), 'data', 'receipts');
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

export const appRouter = router({
  system: systemRouter,
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

  orders: router({
    createOrder: publicProcedure
      .input(z.object({
        customerEmail: z.string().email().max(255),
        customerName: z.string().min(1).max(100),
        customerPhone: z.string().regex(/^[0-9+\-() ]{10,20}$/).optional(),
        deliveryLocation: z.string().min(1).max(100).default('Lagos'),
        items: z.array(z.object({
          productId: z.number().positive(),
          name: z.string().min(1).max(200),
          quantity: z.number().int().positive().max(1000),
          price: z.number().positive().max(1000000),
        })).min(1).max(100),
        subtotal: z.number().positive(),
        tax: z.number().nonnegative(),
        shippingCost: z.number().nonnegative().default(500),
      }))
      .mutation(async ({ input }) => {
        try {
          const totalAmount = input.subtotal + input.tax + input.shippingCost;
          const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          const createdAt = new Date().toISOString();
          const receiptPayload: OrderReceiptPayload = {
            orderNumber,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            deliveryLocation: input.deliveryLocation,
            createdAt,
            items: input.items,
            subtotal: input.subtotal,
            tax: input.tax,
            shippingCost: input.shippingCost,
            totalAmount,
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
            items: input.items,
            subtotal: input.subtotal,
            tax: input.tax,
            shippingCost: input.shippingCost,
            totalAmount,
            paymentMethod: 'bank_transfer',
            status: 'pending',
          });

          await notifyOwner({
            title: `New Order: ${orderNumber}`,
            content: `Customer: ${input.customerName} (${input.customerEmail})\nPhone: ${input.customerPhone || 'N/A'}\nTotal: ${formatNairaAmount(totalAmount)}\n\nItems:\n${input.items.map((i) => `- ${i.name} x${i.quantity} @ ${formatNairaAmount(i.price)}`).join('\n')}`,
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

    uploadReceipt: publicProcedure
      .input(z.object({
        orderNumber: z.string().regex(/^ORD-\d+-[a-z0-9]{5}$/).max(50),
        receiptName: z.string().min(1).max(255),
        receiptDataUrl: z.string().min(32).max(8_000_000),
      }))
      .mutation(async ({ input }) => {
        try {
          const persistedReceipt = await persistReceipt(input.orderNumber, input.receiptName, input.receiptDataUrl);
          const workbookUpdated = await updateOrderReceiptInExcel(input.orderNumber, persistedReceipt.storedLocation);

          await notifyOwner({
            title: `Payment Receipt: ${input.orderNumber}`,
            content: `Order ${input.orderNumber} receipt uploaded.\nStored at: ${persistedReceipt.storedLocation}\nWorkbook updated: ${workbookUpdated ? 'yes' : 'no'}`,
          });

          sendOwnerPaymentProofEmail(input.orderNumber, persistedReceipt.storedLocation).catch((error) =>
            console.warn('[Email] Failed to send payment proof email:', error)
          );

          return {
            success: true,
            message: 'Receipt uploaded successfully',
            savedReceiptPath: persistedReceipt.storedLocation,
            savedReceiptUrl: persistedReceipt.storedUrl,
            workbookUpdated,
          };
        } catch (error) {
          console.error('Receipt upload error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to upload receipt',
          });
        }
      }),

    dashboardSummary: publicProcedure.query(async () => {
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
      .mutation(async ({ input }) => {
        try {
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
