import type { OrderReceiptPayload } from "@shared/orderReceipt";

export interface OrderReceiptClientPackage {
  fileName: string;
  pdfBase64: string;
  receiptText: string;
  businessWhatsAppUrl: string;
  businessEmailUrl: string;
  payload: OrderReceiptPayload;
}

const STORAGE_KEY = "peaceful-taste-last-order-receipt";

function base64ToBlob(base64: string, mimeType: string) {
  const binary = atob(base64);
  const chunkSize = 1024;
  const byteArrays: ArrayBuffer[] = [];

  for (let offset = 0; offset < binary.length; offset += chunkSize) {
    const slice = binary.slice(offset, offset + chunkSize);
    const byteNumbers = new Array(slice.length);

    for (let index = 0; index < slice.length; index += 1) {
      byteNumbers[index] = slice.charCodeAt(index);
    }

    byteArrays.push(new Uint8Array(byteNumbers).buffer);
  }

  return new Blob(byteArrays, { type: mimeType });
}

export function downloadPdfReceipt(fileName: string, pdfBase64: string) {
  try {
    const blob = base64ToBlob(pdfBase64, "application/pdf");
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    globalThis.setTimeout(() => URL.revokeObjectURL(href), 1_000);
    return true;
  } catch {
    return false;
  }
}

export function saveLatestReceipt(receipt: OrderReceiptClientPackage) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(receipt));
    return true;
  } catch {
    return false;
  }
}

export function loadLatestReceipt(): OrderReceiptClientPackage | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as OrderReceiptClientPackage;
  } catch {
    return null;
  }
}

export function clearLatestReceipt() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures so receipt cleanup never blocks payment flow.
  }
}

export function copyTextToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

export type ImageCropOptions = {
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  aspectRatio?: number;
};

async function compressImageFile(file: File, cropOptions: ImageCropOptions = {}) {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
    return fileToPlainDataUrl(file);
  }

  const imageBitmap = await createImageBitmap(file);
  const aspectRatio = cropOptions.aspectRatio ?? 1;
  const targetWidth = 1200;
  const targetHeight = Math.round(targetWidth / aspectRatio);
  const zoom = Math.min(Math.max(cropOptions.zoom ?? 1, 1), 2.5);
  const offsetX = Math.min(Math.max(cropOptions.offsetX ?? 50, 0), 100);
  const offsetY = Math.min(Math.max(cropOptions.offsetY ?? 50, 0), 100);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    imageBitmap.close();
    return fileToPlainDataUrl(file);
  }

  const sourceAspectRatio = imageBitmap.width / imageBitmap.height;
  const cropAspectRatio = targetWidth / targetHeight;
  let sourceWidth = imageBitmap.width;
  let sourceHeight = imageBitmap.height;

  if (sourceAspectRatio > cropAspectRatio) {
    sourceWidth = imageBitmap.height * cropAspectRatio;
  } else {
    sourceHeight = imageBitmap.width / cropAspectRatio;
  }

  sourceWidth = Math.max(1, sourceWidth / zoom);
  sourceHeight = Math.max(1, sourceHeight / zoom);

  const maxSourceX = Math.max(0, imageBitmap.width - sourceWidth);
  const maxSourceY = Math.max(0, imageBitmap.height - sourceHeight);
  const sourceX = maxSourceX * (offsetX / 100);
  const sourceY = maxSourceY * (offsetY / 100);

  context.drawImage(
    imageBitmap,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight
  );
  imageBitmap.close();

  const compressedType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
  const quality = compressedType === 'image/webp' ? 0.82 : 0.8;

  return canvas.toDataURL(compressedType, quality);
}

function fileToPlainDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function fileToDataUrl(file: File, cropOptions?: ImageCropOptions): Promise<string> {
  if (!file.type.startsWith('image/')) {
    return fileToPlainDataUrl(file);
  }

  return compressImageFile(file, cropOptions).catch(() => fileToPlainDataUrl(file));
}
