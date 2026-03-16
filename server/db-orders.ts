import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { orders, inquiries, InsertOrder, InsertInquiry, Order, Inquiry } from "../drizzle/schema";

/**
 * Create a new order
 */
export async function createOrder(orderData: InsertOrder): Promise<Order> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(orders).values(orderData);
  const insertedOrder = await db.select().from(orders).where(eq(orders.id, Number(result[0].insertId))).limit(1);
  
  if (!insertedOrder.length) throw new Error("Failed to create order");
  return insertedOrder[0];
}

/**
 * Get order by ID
 */
export async function getOrderById(id: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get orders by customer email
 */
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(orders).where(eq(orders.customerEmail, email));
}

/**
 * Update order status
 */
export async function updateOrderStatus(id: number, status: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set({ status: status as any }).where(eq(orders.id, id));
}

/**
 * Update order receipt URL
 */
export async function updateOrderReceiptUrl(id: number, receiptUrl: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set({ receiptUrl }).where(eq(orders.id, id));
}

/**
 * Create a new inquiry
 */
export async function createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(inquiries).values(inquiryData);
  const insertedInquiry = await db.select().from(inquiries).where(eq(inquiries.id, Number(result[0].insertId))).limit(1);
  
  if (!insertedInquiry.length) throw new Error("Failed to create inquiry");
  return insertedInquiry[0];
}

/**
 * Get all inquiries
 */
export async function getAllInquiries(): Promise<Inquiry[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(inquiries);
}

/**
 * Get inquiry by ID
 */
export async function getInquiryById(id: number): Promise<Inquiry | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Update inquiry status
 */
export async function updateInquiryStatus(id: number, status: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(inquiries).set({ status: status as any }).where(eq(inquiries.id, id));
}
