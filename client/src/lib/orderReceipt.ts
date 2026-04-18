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

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
