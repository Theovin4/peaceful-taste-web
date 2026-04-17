// @ts-nocheck
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";
import { addOrderToExcel, addInquiryToExcel, initializeAllWorkbooks } from "./excel-storage";
import { sendOrderConfirmationSMS } from "./termii-sms";

// Initialize Excel workbooks on startup
initializeAllWorkbooks().catch(err => console.error('[Excel] Initialization error:', err));

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Orders and Payments routers
  orders: router({
    // Create order with manual payment
    createOrder: publicProcedure
      .input(z.object({
        customerEmail: z.string().email().max(255),
        customerName: z.string().min(1).max(100),
        customerPhone: z.string().regex(/^[0-9+\-() ]{10,20}$/).optional(),
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
          const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

          // Initialize Excel workbooks
          await initializeAllWorkbooks();

          // Add order to Excel
          await addOrderToExcel({
            orderNumber,
            createdAt: new Date().toISOString(),
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            items: input.items,
            subtotal: input.subtotal,
            tax: input.tax,
            shippingCost: input.shippingCost,
            totalAmount: totalAmount,
            paymentMethod: 'bank_transfer',
            status: 'pending',
          });

          // Send email notification to owner
          await notifyOwner({
            title: `New Order: ${orderNumber}`,
            content: `Customer: ${input.customerName} (${input.customerEmail})\nPhone: ${input.customerPhone || 'N/A'}\nTotal: ₦${totalAmount.toLocaleString()}\n\nItems:\n${input.items.map(i => `- ${i.name} x${i.quantity} @ ₦${i.price}`).join('\n')}`,
          });

          // Send SMS confirmation to customer (if phone provided)
          if (input.customerPhone) {
            sendOrderConfirmationSMS(input.customerPhone, orderNumber, totalAmount).catch(err => 
              console.error('[SMS] Failed to send order confirmation:', err)
            );
          }

          return {
            success: true,
            orderNumber,
            totalAmount,
          };
        } catch (error) {
          console.error('Order creation error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to create order',
          });
        }
      }),

    // Upload payment receipt
    uploadReceipt: publicProcedure
      .input(z.object({
        orderNumber: z.string().regex(/^ORD-\d+-[a-z0-9]{5}$/).max(50),
        receiptUrl: z.string().url().max(2048),
      }))
      .mutation(async ({ input }) => {
        try {
          // Send email notification
          await notifyOwner({
            title: `Payment Receipt: ${input.orderNumber}`,
            content: `Order ${input.orderNumber} receipt uploaded.\nReceipt URL: ${input.receiptUrl}`,
          });

          return {
            success: true,
            message: 'Receipt uploaded successfully',
          };
        } catch (error) {
          console.error('Receipt upload error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to upload receipt',
          });
        }
      }),
  }),

  // Contact and Inquiries routers
  inquiries: router({
    // Create inquiry
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
          // Initialize Excel workbooks
          await initializeAllWorkbooks();

          // Add inquiry to Excel
          await addInquiryToExcel({
            name: input.name,
            email: input.email,
            phone: input.phone,
            subject: input.subject,
            message: input.message,
            inquiryType: input.inquiryType,
            status: 'new',
          });

          // Send email notification
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

    // Get all inquiries
    getAllInquiries: publicProcedure
      .query(async () => {
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
