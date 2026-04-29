import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  cloudinaryStorageEnabled,
  downloadCloudinaryRawJson,
  uploadCloudinaryRawJson,
} from './cloudinary-storage';

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'peaceful-taste-data')
  : path.join(process.cwd(), 'data');
const LOCAL_PENDING_DIR = path.join(DATA_DIR, 'pending-checkouts');
const CLOUDINARY_PENDING_PUBLIC_ID = 'peaceful-taste/records/pending-checkouts.json';

export interface PendingCheckoutRecord {
  checkoutReference: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryLocation: string;
  deliveryAddress: string;
  items: Array<{
    productId: string | number;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  status: 'pending' | 'flutterwave_initialized' | 'flutterwave_paid' | 'bank_transfer_submitted' | 'completed' | 'cancelled';
  paymentMethod?: 'flutterwave' | 'bank_transfer';
  receiptUrl?: string;
  orderNumber?: string;
  notes?: string;
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function ensureDataDir() {
  ensureDir(DATA_DIR);
  ensureDir(LOCAL_PENDING_DIR);
}

function getLocalPendingFile(checkoutReference: string) {
  return path.join(LOCAL_PENDING_DIR, `${checkoutReference}.json`);
}

async function readCloudinaryPendingRecords(): Promise<PendingCheckoutRecord[]> {
  const records = await downloadCloudinaryRawJson<PendingCheckoutRecord[]>(CLOUDINARY_PENDING_PUBLIC_ID);
  return Array.isArray(records) ? records : [];
}

function readLocalPendingRecords(): PendingCheckoutRecord[] {
  ensureDataDir();

  return fs
    .readdirSync(LOCAL_PENDING_DIR)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(LOCAL_PENDING_DIR, fileName), 'utf8')) as PendingCheckoutRecord;
      } catch {
        return null;
      }
    })
    .filter((record): record is PendingCheckoutRecord => Boolean(record));
}

async function getAllPendingRecords() {
  ensureDataDir();
  const records = cloudinaryStorageEnabled()
    ? await readCloudinaryPendingRecords()
    : readLocalPendingRecords();

  return records.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

async function writePendingRecord(record: PendingCheckoutRecord) {
  ensureDataDir();
  fs.writeFileSync(getLocalPendingFile(record.checkoutReference), JSON.stringify(record, null, 2));

  if (cloudinaryStorageEnabled()) {
    const existing = await readCloudinaryPendingRecords();
    const nextRecords = [
      ...existing.filter((item) => item.checkoutReference !== record.checkoutReference),
      record,
    ].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    await uploadCloudinaryRawJson({
      publicIdWithExtension: CLOUDINARY_PENDING_PUBLIC_ID,
      data: nextRecords,
    });
  }
}

export function createCheckoutReference() {
  return `CHK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createPendingCheckout(
  input: Omit<PendingCheckoutRecord, 'checkoutReference' | 'createdAt' | 'status'>
) {
  const record: PendingCheckoutRecord = {
    ...input,
    checkoutReference: createCheckoutReference(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  await writePendingRecord(record);
  return record;
}

export async function getPendingCheckout(checkoutReference: string) {
  const records = await getAllPendingRecords();
  return records.find((record) => record.checkoutReference === checkoutReference) || null;
}

export async function updatePendingCheckout(
  checkoutReference: string,
  updates: Partial<PendingCheckoutRecord>
) {
  const existing = await getPendingCheckout(checkoutReference);
  if (!existing) return null;

  const next = {
    ...existing,
    ...updates,
    checkoutReference: existing.checkoutReference,
  };

  await writePendingRecord(next);
  return next;
}
