import { del, get, list, put } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';

const ORDER_WORKBOOK_BLOB = 'exports/orders.xlsx';
const INQUIRY_WORKBOOK_BLOB = 'exports/inquiries.xlsx';
let blobRuntimeAvailable = true;

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isBlobUsable() {
  return hasBlobToken() && blobRuntimeAvailable;
}

function markBlobUnavailable(error: unknown) {
  blobRuntimeAvailable = false;
  console.warn('[Blob] Disabling blob storage for this runtime:', error);
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  const arrayBuffer = await new Response(stream).arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export function blobStorageEnabled() {
  return isBlobUsable();
}

export async function uploadPrivateBlob(pathname: string, data: Buffer, contentType: string) {
  if (!isBlobUsable()) return null;

  try {
    return await put(pathname, data, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
    });
  } catch (error) {
    markBlobUnavailable(error);
    return null;
  }
}

export async function uploadPublicBlob(pathname: string, data: Buffer, contentType: string) {
  if (!isBlobUsable()) return null;

  try {
    return await put(pathname, data, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
    });
  } catch (error) {
    markBlobUnavailable(error);
    return null;
  }
}

export async function uploadPrivateJson(pathname: string, data: unknown) {
  return uploadPrivateBlob(
    pathname,
    Buffer.from(JSON.stringify(data, null, 2), 'utf8'),
    'application/json'
  );
}

export async function downloadPrivateBlob(pathname: string) {
  if (!isBlobUsable()) return null;

  try {
    const result = await get(pathname, { access: 'private' });
    if (!result || result.statusCode !== 200) {
      return null;
    }

    return {
      ...result.blob,
      buffer: await streamToBuffer(result.stream),
    };
  } catch (error) {
    markBlobUnavailable(error);
    return null;
  }
}

export async function listPrivateBlobs(prefix: string) {
  if (!isBlobUsable()) return [];

  const blobs = [];
  let cursor: string | undefined;

  try {
    do {
      const result = await list({
        prefix,
        cursor,
        limit: 1000,
      });

      blobs.push(...result.blobs);
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
  } catch (error) {
    markBlobUnavailable(error);
    return [];
  }

  return blobs;
}

export async function deletePrivateBlobs(pathnames: string[]) {
  if (!isBlobUsable() || pathnames.length === 0) return false;

  try {
    await del(pathnames);
    return true;
  } catch (error) {
    markBlobUnavailable(error);
    return false;
  }
}

export async function syncWorkbookToBlob(localPath: string, type: 'orders' | 'inquiries') {
  if (!isBlobUsable() || !fs.existsSync(localPath)) return null;

  const pathname = type === 'orders' ? ORDER_WORKBOOK_BLOB : INQUIRY_WORKBOOK_BLOB;
  const buffer = fs.readFileSync(localPath);

  return uploadPrivateBlob(pathname, buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

export async function hydrateWorkbookFromBlob(
  localPath: string,
  type: 'orders' | 'inquiries',
  options: { force?: boolean } = {}
) {
  const { force = false } = options;

  if (!isBlobUsable()) return fs.existsSync(localPath);
  if (!force && fs.existsSync(localPath)) return true;

  const pathname = type === 'orders' ? ORDER_WORKBOOK_BLOB : INQUIRY_WORKBOOK_BLOB;
  const blob = await downloadPrivateBlob(pathname);
  if (!blob) return false;

  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.writeFileSync(localPath, blob.buffer);
  return true;
}
