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

async function compressImageFile(file: File) {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
    return fileToPlainDataUrl(file);
  }

  const imageBitmap = await createImageBitmap(file);
  const maxDimension = 1400;
  const scale = Math.min(1, maxDimension / Math.max(imageBitmap.width, imageBitmap.height));
  const targetWidth = Math.max(1, Math.round(imageBitmap.width * scale));
  const targetHeight = Math.max(1, Math.round(imageBitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    imageBitmap.close();
    return fileToPlainDataUrl(file);
  }

  context.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
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

export function fileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    return fileToPlainDataUrl(file);
  }

  return compressImageFile(file).catch(() => fileToPlainDataUrl(file));
}
