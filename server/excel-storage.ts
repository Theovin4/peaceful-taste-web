/**
 * Excel Storage Service
 * Stores all orders and inquiries in Excel workbooks
 */

import ExcelJS from 'exceljs';
const { Workbook } = ExcelJS;
import * as fs from 'fs';
import * as path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.xlsx');
const INQUIRIES_FILE = path.join(process.cwd(), 'data', 'inquiries.xlsx');

export interface OrderWorkbookRow {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  receiptUrl: string;
  notes: string;
}

export interface InquiryWorkbookRow {
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
  status: string;
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Initialize orders workbook
 */
async function initializeOrdersWorkbook() {
  ensureDataDir();
  
  if (fs.existsSync(ORDERS_FILE)) {
    return;
  }

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Orders');

  // Set column widths
  worksheet.columns = [
    { header: 'Order Number', key: 'orderNumber', width: 20 },
    { header: 'Date', key: 'createdAt', width: 20 },
    { header: 'Customer Name', key: 'customerName', width: 25 },
    { header: 'Email', key: 'customerEmail', width: 30 },
    { header: 'Phone', key: 'customerPhone', width: 15 },
    { header: 'Items', key: 'items', width: 40 },
    { header: 'Subtotal (₦)', key: 'subtotal', width: 15 },
    { header: 'Shipping (₦)', key: 'shippingCost', width: 15 },
    { header: 'Tax (₦)', key: 'tax', width: 15 },
    { header: 'Total (₦)', key: 'totalAmount', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Payment Method', key: 'paymentMethod', width: 15 },
    { header: 'Receipt URL', key: 'receiptUrl', width: 40 },
    { header: 'Notes', key: 'notes', width: 30 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B4513' } };

  await workbook.xlsx.writeFile(ORDERS_FILE);
  console.log('[Excel] Orders workbook initialized');
}

/**
 * Initialize inquiries workbook
 */
async function initializeInquiriesWorkbook() {
  ensureDataDir();
  
  if (fs.existsSync(INQUIRIES_FILE)) {
    return;
  }

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Inquiries');

  // Set column widths
  worksheet.columns = [
    { header: 'Date', key: 'createdAt', width: 20 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Subject', key: 'subject', width: 30 },
    { header: 'Message', key: 'message', width: 50 },
    { header: 'Type', key: 'inquiryType', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B4513' } };

  await workbook.xlsx.writeFile(INQUIRIES_FILE);
  console.log('[Excel] Inquiries workbook initialized');
}

/**
 * Add order to Excel
 */
export async function addOrderToExcel(orderData: {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: any;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  receiptUrl?: string;
  notes?: string;
}) {
  try {
    await initializeOrdersWorkbook();

    const workbook = new Workbook();
    await workbook.xlsx.readFile(ORDERS_FILE);
    const worksheet = workbook.getWorksheet('Orders');
    if (!worksheet) throw new Error('Orders worksheet not found');

    // Format items as string
    const itemsString = Array.isArray(orderData.items)
      ? orderData.items.map((i: any) => `${i.name} x${i.quantity}`).join(', ')
      : JSON.stringify(orderData.items);

    // Add row
    worksheet.addRow({
      orderNumber: orderData.orderNumber,
      createdAt: new Date().toLocaleString('en-NG'),
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone || 'N/A',
      items: itemsString,
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost,
      tax: orderData.tax,
      totalAmount: orderData.totalAmount,
      status: orderData.status,
      paymentMethod: orderData.paymentMethod,
      receiptUrl: orderData.receiptUrl || 'Pending',
      notes: orderData.notes || '',
    });

    await workbook.xlsx.writeFile(ORDERS_FILE);
    console.log(`[Excel] Order ${orderData.orderNumber} added to workbook`);
    return true;
  } catch (error) {
    console.error('[Excel] Error adding order:', error);
    throw error;
  }
}

export async function updateOrderReceiptInExcel(orderNumber: string, receiptUrl: string, status: string = 'receipt_uploaded') {
  try {
    await initializeOrdersWorkbook();

    const workbook = new Workbook();
    await workbook.xlsx.readFile(ORDERS_FILE);
    const worksheet = workbook.getWorksheet('Orders');
    if (!worksheet) throw new Error('Orders worksheet not found');

    let updated = false;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const currentOrderNumber = row.getCell(1).text?.trim() || row.getCell(1).value?.toString().trim();
      if (currentOrderNumber === orderNumber) {
        row.getCell(11).value = status;
        row.getCell(13).value = receiptUrl;
        updated = true;
      }
    });

    await workbook.xlsx.writeFile(ORDERS_FILE);
    return updated;
  } catch (error) {
    console.error('[Excel] Error updating order receipt:', error);
    throw error;
  }
}

export async function getOrdersFromExcel(): Promise<OrderWorkbookRow[]> {
  await initializeOrdersWorkbook();

  const workbook = new Workbook();
  await workbook.xlsx.readFile(ORDERS_FILE);
  const worksheet = workbook.getWorksheet('Orders');
  if (!worksheet) throw new Error('Orders worksheet not found');

  const orders: OrderWorkbookRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    orders.push({
      orderNumber: row.getCell(1).text || '',
      createdAt: row.getCell(2).text || '',
      customerName: row.getCell(3).text || '',
      customerEmail: row.getCell(4).text || '',
      customerPhone: row.getCell(5).text || '',
      items: row.getCell(6).text || '',
      subtotal: Number(row.getCell(7).value || 0),
      shippingCost: Number(row.getCell(8).value || 0),
      tax: Number(row.getCell(9).value || 0),
      totalAmount: Number(row.getCell(10).value || 0),
      status: row.getCell(11).text || '',
      paymentMethod: row.getCell(12).text || '',
      receiptUrl: row.getCell(13).text || '',
      notes: row.getCell(14).text || '',
    });
  });

  return orders.filter((order) => order.orderNumber);
}

export async function getInquiriesFromExcel(): Promise<InquiryWorkbookRow[]> {
  await initializeInquiriesWorkbook();

  const workbook = new Workbook();
  await workbook.xlsx.readFile(INQUIRIES_FILE);
  const worksheet = workbook.getWorksheet('Inquiries');
  if (!worksheet) throw new Error('Inquiries worksheet not found');

  const inquiries: InquiryWorkbookRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    inquiries.push({
      createdAt: row.getCell(1).text || '',
      name: row.getCell(2).text || '',
      email: row.getCell(3).text || '',
      phone: row.getCell(4).text || '',
      subject: row.getCell(5).text || '',
      message: row.getCell(6).text || '',
      inquiryType: row.getCell(7).text || '',
      status: row.getCell(8).text || '',
    });
  });

  return inquiries.filter((inquiry) => inquiry.email || inquiry.subject);
}

export async function getWorkbookSummary() {
  const [orders, inquiries] = await Promise.all([getOrdersFromExcel(), getInquiriesFromExcel()]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  const receiptUploadedOrders = orders.filter((order) => order.status === 'receipt_uploaded').length;
  const uniqueCustomers = new Set(orders.map((order) => order.customerEmail).filter(Boolean)).size;

  return {
    ordersCount: orders.length,
    inquiriesCount: inquiries.length,
    totalRevenue,
    pendingOrders,
    receiptUploadedOrders,
    uniqueCustomers,
    recentOrders: orders.slice(-10).reverse(),
    recentInquiries: inquiries.slice(-10).reverse(),
  };
}

/**
 * Add inquiry to Excel
 */
export async function addInquiryToExcel(inquiryData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: string;
  status: string;
}) {
  try {
    await initializeInquiriesWorkbook();

    const workbook = new Workbook();
    await workbook.xlsx.readFile(INQUIRIES_FILE);
    const worksheet = workbook.getWorksheet('Inquiries');
    if (!worksheet) throw new Error('Inquiries worksheet not found');

    // Add row
    worksheet.addRow({
      createdAt: new Date().toLocaleString('en-NG'),
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone || 'N/A',
      subject: inquiryData.subject,
      message: inquiryData.message,
      inquiryType: inquiryData.inquiryType,
      status: inquiryData.status,
    });

    await workbook.xlsx.writeFile(INQUIRIES_FILE);
    console.log(`[Excel] Inquiry from ${inquiryData.name} added to workbook`);
    return true;
  } catch (error) {
    console.error('[Excel] Error adding inquiry:', error);
    throw error;
  }
}

/**
 * Get orders Excel file path
 */
export function getOrdersFilePath(): string {
  return ORDERS_FILE;
}

/**
 * Get inquiries Excel file path
 */
export function getInquiriesFilePath(): string {
  return INQUIRIES_FILE;
}

/**
 * Initialize all workbooks
 */
export async function initializeAllWorkbooks() {
  await initializeOrdersWorkbook();
  await initializeInquiriesWorkbook();
  console.log('[Excel] All workbooks initialized');
}
