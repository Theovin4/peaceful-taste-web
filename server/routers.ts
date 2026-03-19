import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createOrder, getOrderByNumber, updateOrderReceiptUrl, createInquiry, getAllInquiries } from "./db-orders";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";

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
        customerEmail: z.string().email(),
        customerName: z.string().min(1),
        customerPhone: z.string().optional(),
        items: z.array(z.object({
          productId: z.number(),
          name: z.string(),
          quantity: z.number(),
          price: z.number(),
        })),
        subtotal: z.number(),
        tax: z.number(),
        shippingCost: z.number().default(500),
      }))
      .mutation(async ({ input }) => {
        try {
          const totalAmount = input.subtotal + input.tax + input.shippingCost;
          const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

          const order = await createOrder({
            orderNumber,
            customerEmail: input.customerEmail,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            items: input.items as any,
            subtotal: input.subtotal as any,
            tax: input.tax as any,
            shippingCost: input.shippingCost as any,
            totalAmount: totalAmount as any,
            paymentMethod: 'bank_transfer',
            status: 'pending',
          });

          // Send email notification to owner
          await notifyOwner({
            title: `New Order: ${orderNumber}`,
            content: `Customer: ${input.customerName} (${input.customerEmail})\nPhone: ${input.customerPhone || 'N/A'}\nTotal: ₦${totalAmount.toLocaleString()}\n\nItems:\n${input.items.map(i => `- ${i.name} x${i.quantity} @ ₦${i.price}`).join('\n')}`,
          });

          return {
            success: true,
            orderId: order.id,
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
        orderNumber: z.string(),
        receiptUrl: z.string().url(),
      }))
      .mutation(async ({ input }) => {
        try {
          const order = await getOrderByNumber(input.orderNumber);
          if (!order) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Order not found',
            });
          }

          await updateOrderReceiptUrl(order.id, input.receiptUrl);

          // Send email notification
          await notifyOwner({
            title: `Payment Receipt Uploaded: ${input.orderNumber}`,
            content: `Customer: ${order.customerName} (${order.customerEmail})\nReceipt URL: ${input.receiptUrl}`,
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

    // Get order details
    getOrder: publicProcedure
      .input(z.object({
        orderNumber: z.string(),
      }))
      .query(async ({ input }) => {
        try {
          const order = await getOrderByNumber(input.orderNumber);
          if (!order) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Order not found',
            });
          }

          return order;
        } catch (error) {
          console.error('Get order error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to get order',
          });
        }
      }),
  }),

  // Contact and Inquiries
  inquiries: router({
    // Submit contact form
    submitInquiry: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().min(1),
        message: z.string().min(1),
        inquiryType: z.enum(['general', 'catering', 'bulk_order', 'complaint', 'feedback']).default('general'),
      }))
      .mutation(async ({ input }) => {
        try {
          const inquiry = await createInquiry({
            name: input.name,
            email: input.email,
            phone: input.phone,
            subject: input.subject,
            message: input.message,
            inquiryType: input.inquiryType,
            status: 'new',
          });

          // Send email notification to owner
          await notifyOwner({
            title: `New ${input.inquiryType.replace('_', ' ').toUpperCase()} Inquiry from ${input.name}`,
            content: `Email: ${input.email}\nPhone: ${input.phone || 'N/A'}\nSubject: ${input.subject}\n\nMessage:\n${input.message}`,
          });

          return {
            success: true,
            inquiryId: inquiry.id,
            message: 'Thank you for your inquiry. We will get back to you soon!',
          };
        } catch (error) {
          console.error('Inquiry submission error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to submit inquiry',
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
