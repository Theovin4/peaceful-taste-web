import ExcelJS from 'exceljs';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  blobStorageEnabled,
  deletePrivateBlobs,
  downloadPrivateBlob,
  listPrivateBlobs,
  uploadPrivateJson,
} from './blob-storage';
import {
  cloudinaryStorageEnabled,
  downloadCloudinaryRawJson,
  uploadCloudinaryRawJson,
} from './cloudinary-storage';

const { Workbook } = ExcelJS;

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'peaceful-taste-data')
  : path.join(process.cwd(), 'data');

const ORDERS_FILE = path.join(DATA_DIR, 'orders.xlsx');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.xlsx');
const ORDER_RECORD_PREFIX = 'records/orders/';
const INQUIRY_RECORD_PREFIX = 'records/inquiries/';
const CLOUDINARY_ORDER_RECORDS_PUBLIC_ID = 'peaceful-taste/records/orders.json';
const CLOUDINARY_INQUIRY_RECORDS_PUBLIC_ID = 'peaceful-taste/records/inquiries.json';
const LOCAL_ORDER_RECORDS_DIR = path.join(DATA_DIR, 'records', 'orders');
const LOCAL_INQUIRY_RECORDS_DIR = path.join(DATA_DIR, 'records', 'inquiries');

export interface OrderWorkbookRow {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryLocation: string;
  deliveryAddress: string;
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

type OrderRecord = OrderWorkbookRow;
type InquiryRecord = InquiryWorkbookRow;

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function ensureDataDir() {
  ensureDir(DATA_DIR);
  ensureDir(LOCAL_ORDER_RECORDS_DIR);
  ensureDir(LOCAL_INQUIRY_RECORDS_DIR);
}

function orderRecordPath(orderNumber: string) {
  return `${ORDER_RECORD_PREFIX}${orderNumber}.json`;
}

function inquiryRecordPath(createdAt: string, email: string) {
  const safeCreatedAt = createdAt.replace(/[^0-9]/g, '');
  const safeEmail = email.replace(/[^a-zA-Z0-9._-]/g, '-');
  return `${INQUIRY_RECORD_PREFIX}${safeCreatedAt}-${safeEmail}.json`;
}

function localOrderRecordFile(orderNumber: string) {
  return path.join(LOCAL_ORDER_RECORDS_DIR, `${orderNumber}.json`);
}

function localInquiryRecordFile(createdAt: string, email: string) {
  const safeCreatedAt = createdAt.replace(/[^0-9]/g, '');
  const safeEmail = email.replace(/[^a-zA-Z0-9._-]/g, '-');
  return path.join(LOCAL_INQUIRY_RECORDS_DIR, `${safeCreatedAt}-${safeEmail}.json`);
}

async function writeOrderRecord(record: OrderRecord) {
  ensureDataDir();
  fs.writeFileSync(localOrderRecordFile(record.orderNumber), JSON.stringify(record, null, 2));

  if (cloudinaryStorageEnabled()) {
    const records = await readCloudinaryOrderRecords();
    const nextRecords = [
      ...records.filter((existing) => existing.orderNumber !== record.orderNumber),
      record,
    ].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    await uploadCloudinaryRawJson({
      publicIdWithExtension: CLOUDINARY_ORDER_RECORDS_PUBLIC_ID,
      data: nextRecords,
    });
  }

  if (blobStorageEnabled()) {
    await uploadPrivateJson(orderRecordPath(record.orderNumber), record);
  }
}

async function writeInquiryRecord(record: InquiryRecord) {
  ensureDataDir();
  fs.writeFileSync(
    localInquiryRecordFile(record.createdAt, record.email),
    JSON.stringify(record, null, 2)
  );

  if (cloudinaryStorageEnabled()) {
    const records = await readCloudinaryInquiryRecords();
    const nextRecords = [
      ...records.filter(
        (existing) => !(existing.createdAt === record.createdAt && existing.email === record.email)
      ),
      record,
    ].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    await uploadCloudinaryRawJson({
      publicIdWithExtension: CLOUDINARY_INQUIRY_RECORDS_PUBLIC_ID,
      data: nextRecords,
    });
  }

  if (blobStorageEnabled()) {
    await uploadPrivateJson(inquiryRecordPath(record.createdAt, record.email), record);
  }
}

async function readBlobJson<T>(pathname: string): Promise<T | null> {
  const blob = await downloadPrivateBlob(pathname);
  if (!blob) return null;

  try {
    return JSON.parse(blob.buffer.toString('utf8')) as T;
  } catch (error) {
    console.error('[Storage] Failed to parse blob JSON:', pathname, error);
    return null;
  }
}

async function readAllBlobRecords<T>(prefix: string): Promise<T[]> {
  const blobs = await listPrivateBlobs(prefix);
  const records = await Promise.all(
    blobs.map((blob) => readBlobJson<T>(blob.pathname))
  );

  return records.filter(Boolean) as T[];
}

async function readCloudinaryOrderRecords(): Promise<OrderRecord[]> {
  const records = await downloadCloudinaryRawJson<OrderRecord[]>(CLOUDINARY_ORDER_RECORDS_PUBLIC_ID);
  return Array.isArray(records) ? records : [];
}

async function readCloudinaryInquiryRecords(): Promise<InquiryRecord[]> {
  const records = await downloadCloudinaryRawJson<InquiryRecord[]>(CLOUDINARY_INQUIRY_RECORDS_PUBLIC_ID);
  return Array.isArray(records) ? records : [];
}

function readLocalJsonRecords<T>(dirPath: string): T[] {
  ensureDir(dirPath);

  return fs
    .readdirSync(dirPath)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dirPath, fileName), 'utf8')) as T;
      } catch (error) {
        console.error('[Storage] Failed to parse local JSON:', fileName, error);
        return null;
      }
    })
    .filter((record): record is T => Boolean(record));
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function getOrderRecords(): Promise<OrderRecord[]> {
  ensureDataDir();
  const records = cloudinaryStorageEnabled()
    ? await readCloudinaryOrderRecords()
    : blobStorageEnabled()
      ? await readAllBlobRecords<OrderRecord>(ORDER_RECORD_PREFIX)
      : readLocalJsonRecords<OrderRecord>(LOCAL_ORDER_RECORDS_DIR);

  return records.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

async function getInquiryRecords(): Promise<InquiryRecord[]> {
  ensureDataDir();
  const records = cloudinaryStorageEnabled()
    ? await readCloudinaryInquiryRecords()
    : blobStorageEnabled()
      ? await readAllBlobRecords<InquiryRecord>(INQUIRY_RECORD_PREFIX)
      : readLocalJsonRecords<InquiryRecord>(LOCAL_INQUIRY_RECORDS_DIR);

  return records.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

async function buildOrdersWorkbookFile() {
  ensureDataDir();
  const orders = await getOrderRecords();
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Orders');

  worksheet.columns = [
    { header: 'Order Number', key: 'orderNumber', width: 20 },
    { header: 'Date', key: 'createdAt', width: 20 },
    { header: 'Customer Name', key: 'customerName', width: 25 },
    { header: 'Email', key: 'customerEmail', width: 30 },
    { header: 'Phone', key: 'customerPhone', width: 15 },
    { header: 'Delivery Location', key: 'deliveryLocation', width: 20 },
    { header: 'Delivery Address', key: 'deliveryAddress', width: 40 },
    { header: 'Items', key: 'items', width: 40 },
    { header: 'Subtotal (Naira)', key: 'subtotal', width: 15 },
    { header: 'Shipping (Naira)', key: 'shippingCost', width: 15 },
    { header: 'Tax (Naira)', key: 'tax', width: 15 },
    { header: 'Total (Naira)', key: 'totalAmount', width: 15 },
    { header: 'Status', key: 'status', width: 18 },
    { header: 'Payment Method', key: 'paymentMethod', width: 18 },
    { header: 'Receipt URL', key: 'receiptUrl', width: 50 },
    { header: 'Notes', key: 'notes', width: 30 },
  ];

  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF8B4513' },
  };

  orders.forEach((order) => worksheet.addRow(order));
  return workbook;
}

async function writeOrdersWorkbookFile() {
  const workbook = await buildOrdersWorkbookFile();
  await workbook.xlsx.writeFile(ORDERS_FILE);
  return ORDERS_FILE;
}

async function buildInquiriesWorkbookFile() {
  ensureDataDir();
  const inquiries = await getInquiryRecords();
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Inquiries');

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

  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF8B4513' },
  };

  inquiries.forEach((inquiry) => worksheet.addRow(inquiry));
  return workbook;
}

async function writeInquiriesWorkbookFile() {
  const workbook = await buildInquiriesWorkbookFile();
  await workbook.xlsx.writeFile(INQUIRIES_FILE);
  return INQUIRIES_FILE;
}

export async function addOrderToExcel(orderData: {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryLocation: string;
  deliveryAddress: string;
  items: { name: string; quantity: number }[] | unknown;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  receiptUrl?: string;
  notes?: string;
}) {
  const itemsString = Array.isArray(orderData.items)
    ? orderData.items.map((item) => `${item.name} x${item.quantity}`).join(', ')
    : JSON.stringify(orderData.items);

  const record: OrderRecord = {
    orderNumber: orderData.orderNumber,
    createdAt: orderData.createdAt,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    customerPhone: orderData.customerPhone || 'N/A',
    deliveryLocation: orderData.deliveryLocation,
    deliveryAddress: orderData.deliveryAddress,
    items: itemsString,
    subtotal: orderData.subtotal,
    shippingCost: orderData.shippingCost,
    tax: orderData.tax,
    totalAmount: orderData.totalAmount,
    status: orderData.status,
    paymentMethod: orderData.paymentMethod,
    receiptUrl: orderData.receiptUrl || 'Pending',
    notes: orderData.notes || '',
  };

  await writeOrderRecord(record);
  await writeOrdersWorkbookFile();
  return true;
}

export async function updateOrderReceiptInExcel(
  orderNumber: string,
  receiptUrl: string,
  status: string = 'receipt_uploaded',
  updates?: Partial<Pick<OrderWorkbookRow, 'paymentMethod' | 'notes'>>
) {
  let existing: OrderRecord | undefined;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const records = await getOrderRecords();
    existing = records.find((record) => record.orderNumber === orderNumber);
    if (existing) break;
    await wait(500);
  }

  if (!existing) return false;

  await writeOrderRecord({
    ...existing,
    receiptUrl,
    status,
    paymentMethod: updates?.paymentMethod ?? existing.paymentMethod,
    notes: updates?.notes ?? existing.notes,
  });
  await writeOrdersWorkbookFile();

  return true;
}

export async function updateOrderInExcel(
  orderNumber: string,
  updates: Partial<Pick<OrderWorkbookRow, 'status' | 'paymentMethod' | 'notes' | 'receiptUrl'>>
) {
  let existing: OrderRecord | undefined;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const records = await getOrderRecords();
    existing = records.find((record) => record.orderNumber === orderNumber);
    if (existing) break;
    await wait(500);
  }

  if (!existing) return false;

  await writeOrderRecord({
    ...existing,
    status: updates.status ?? existing.status,
    paymentMethod: updates.paymentMethod ?? existing.paymentMethod,
    notes: updates.notes ?? existing.notes,
    receiptUrl: updates.receiptUrl ?? existing.receiptUrl,
  });
  await writeOrdersWorkbookFile();

  return true;
}

export async function deleteOrdersFromExcel(orderNumbers: string[]) {
  const uniqueOrderNumbers = Array.from(
    new Set(orderNumbers.map((orderNumber) => String(orderNumber || '').trim()).filter(Boolean))
  );

  if (uniqueOrderNumbers.length === 0) {
    return { removedCount: 0, removedOrderNumbers: [] as string[] };
  }

  const existingOrders = await getOrderRecords();
  const removalSet = new Set(uniqueOrderNumbers);
  const removedOrders = existingOrders.filter((order) => removalSet.has(order.orderNumber));

  if (removedOrders.length === 0) {
    return { removedCount: 0, removedOrderNumbers: [] as string[] };
  }

  const nextOrders = existingOrders.filter((order) => !removalSet.has(order.orderNumber));

  ensureDataDir();

  for (const order of removedOrders) {
    const localFile = localOrderRecordFile(order.orderNumber);
    if (fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }
  }

  if (cloudinaryStorageEnabled()) {
    await uploadCloudinaryRawJson({
      publicIdWithExtension: CLOUDINARY_ORDER_RECORDS_PUBLIC_ID,
      data: nextOrders,
    });
  } else if (blobStorageEnabled()) {
    await deletePrivateBlobs(removedOrders.map((order) => orderRecordPath(order.orderNumber)));
  }

  await writeOrdersWorkbookFile();

  return {
    removedCount: removedOrders.length,
    removedOrderNumbers: removedOrders.map((order) => order.orderNumber),
  };
}

export async function getOrdersFromExcel(): Promise<OrderWorkbookRow[]> {
  return getOrderRecords();
}

export async function getInquiriesFromExcel(): Promise<InquiryWorkbookRow[]> {
  return getInquiryRecords();
}

export async function getWorkbookSummary() {
  const [orders, inquiries] = await Promise.all([
    getOrderRecords(),
    getInquiryRecords(),
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  const receiptUploadedOrders = orders.filter(
    (order) => order.status === 'receipt_uploaded'
  ).length;
  const uniqueCustomers = new Set(
    orders.map((order) => order.customerEmail).filter(Boolean)
  ).size;

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

export async function addInquiryToExcel(inquiryData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: string;
  status: string;
}) {
  const record: InquiryRecord = {
    createdAt: new Date().toISOString(),
    name: inquiryData.name,
    email: inquiryData.email,
    phone: inquiryData.phone || 'N/A',
    subject: inquiryData.subject,
    message: inquiryData.message,
    inquiryType: inquiryData.inquiryType,
    status: inquiryData.status,
  };

  await writeInquiryRecord(record);
  await writeInquiriesWorkbookFile();
  return true;
}

export async function prepareOrdersWorkbookDownload() {
  return writeOrdersWorkbookFile();
}

export async function prepareInquiriesWorkbookDownload() {
  return writeInquiriesWorkbookFile();
}

export async function prepareOrdersWorkbookBuffer() {
  const workbook = await buildOrdersWorkbookFile();
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
}

export async function prepareInquiriesWorkbookBuffer() {
  const workbook = await buildInquiriesWorkbookFile();
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
}

export function getOrdersFilePath(): string {
  return ORDERS_FILE;
}

export function getInquiriesFilePath(): string {
  return INQUIRIES_FILE;
}

export async function initializeAllWorkbooks() {
  ensureDataDir();
}
