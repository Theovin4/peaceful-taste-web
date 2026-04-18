import { get, put } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';

const ORDER_WORKBOOK_BLOB = 'exports/orders.xlsx';
const INQUIRY_WORKBOOK_BLOB = 'exports/inquiries.xlsx';

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  const arrayBuffer = await new Response(stream).arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export function blobStorageEnabled() {
  return hasBlobToken();
}

export async function uploadPrivateBlob(pathname: string, data: Buffer, contentType: string) {
  if (!hasBlobToken()) return null;

  return put(pathname, data, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
  });
}

export async function downloadPrivateBlob(pathname: string) {
  if (!hasBlobToken()) return null;

  const result = await get(pathname, { access: 'private' });
  if (!result || result.statusCode !== 200) {
    return null;
  }

  return {
    ...result.blob,
    buffer: await streamToBuffer(result.stream),
  };
}

export async function syncWorkbookToBlob(localPath: string, type: 'orders' | 'inquiries') {
  if (!hasBlobToken() || !fs.existsSync(localPath)) return null;

  const pathname = type === 'orders' ? ORDER_WORKBOOK_BLOB : INQUIRY_WORKBOOK_BLOB;
  const buffer = fs.readFileSync(localPath);

  return uploadPrivateBlob(pathname, buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

export async function hydrateWorkbookFromBlob(localPath: string, type: 'orders' | 'inquiries') {
  if (fs.existsSync(localPath) || !hasBlobToken()) return fs.existsSync(localPath);

  const pathname = type === 'orders' ? ORDER_WORKBOOK_BLOB : INQUIRY_WORKBOOK_BLOB;
  const blob = await downloadPrivateBlob(pathname);
  if (!blob) return false;

  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.writeFileSync(localPath, blob.buffer);
  return true;
}
