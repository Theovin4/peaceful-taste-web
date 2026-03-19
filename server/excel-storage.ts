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
