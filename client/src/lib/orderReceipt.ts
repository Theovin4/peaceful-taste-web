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

export function downloadPdfReceipt(fileName: string, pdfBase64: string) {
  const href = `data:application/pdf;base64,${pdfBase64}`;
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  link.click();
}

export function saveLatestReceipt(receipt: OrderReceiptClientPackage) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(receipt));
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
  sessionStorage.removeItem(STORAGE_KEY);
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
