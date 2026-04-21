/**
 * PDF Receipt Generation Service
 * Generates professional PDF receipts for orders
 */

import { PDFDocument, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { PEACEFUL_TASTE_CONTACT, type OrderReceiptPayload } from '@shared/orderReceipt';

export interface ReceiptData extends OrderReceiptPayload {}

function formatPdfAmount(amount: number) {
  return `NGN ${amount.toLocaleString('en-NG')}`;
}

export async function generateOrderReceipt(data: ReceiptData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const margin = 40;
  let yPosition = height - margin;

  const drawText = (
    text: string,
    fontSize: number = 12,
    _bold: boolean = false,
    color: [number, number, number] = [0, 0, 0]
  ) => {
    page.drawText(text, {
      x: margin,
      y: yPosition,
      size: fontSize,
      color: rgb(...color),
    });
    yPosition -= fontSize + 5;
  };

  const drawLine = () => {
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    yPosition -= 15;
  };

  drawText('PEACEFUL TASTE', 22, true, [0.07, 0.27, 0.15]);
  drawText('Premium Catering Order Receipt', 13, true, [0.45, 0.29, 0.14]);
  drawLine();

  drawText(`Order Number: ${data.orderNumber}`, 11, true);
  drawText(`Receipt Date: ${new Date(data.createdAt).toLocaleString('en-NG')}`, 11);
  drawText('Payment Method: Bank Transfer', 11);
  drawText('Payment Status: Awaiting confirmation', 11);
  yPosition -= 10;

  drawText('CUSTOMER INFORMATION', 12, true);
  drawText(`Name: ${data.customerName}`, 10);
  drawText(`Email: ${data.customerEmail}`, 10);
  if (data.customerPhone) {
    drawText(`Phone: ${data.customerPhone}`, 10);
  }
  drawText(`Delivery Location: ${data.deliveryLocation}`, 10);
  drawLine();

  drawText('ORDER ITEMS', 12, true);
  yPosition -= 5;

  page.drawText('Item', { x: margin, y: yPosition, size: 10 });
  page.drawText('Qty', { x: margin + 300, y: yPosition, size: 10 });
  page.drawText('Price', { x: margin + 350, y: yPosition, size: 10 });
  page.drawText('Total', { x: margin + 430, y: yPosition, size: 10 });
  yPosition -= 15;

  data.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    page.drawText(item.name, { x: margin, y: yPosition, size: 9 });
    page.drawText(item.quantity.toString(), { x: margin + 300, y: yPosition, size: 9 });
    page.drawText(formatPdfAmount(item.price), { x: margin + 350, y: yPosition, size: 9 });
    page.drawText(formatPdfAmount(itemTotal), { x: margin + 430, y: yPosition, size: 9 });
    yPosition -= 12;
  });

  drawLine();
  yPosition -= 5;

  page.drawText('Subtotal:', { x: margin + 350, y: yPosition, size: 10 });
  page.drawText(formatPdfAmount(data.subtotal), { x: margin + 430, y: yPosition, size: 10 });
  yPosition -= 12;

  page.drawText('Tax (10%):', { x: margin + 350, y: yPosition, size: 10 });
  page.drawText(formatPdfAmount(data.tax), { x: margin + 430, y: yPosition, size: 10 });
  yPosition -= 12;

  page.drawText('Delivery Fee:', { x: margin + 350, y: yPosition, size: 10 });
  page.drawText(formatPdfAmount(data.shippingCost), { x: margin + 430, y: yPosition, size: 10 });
  yPosition -= 15;

  page.drawText('TOTAL:', { x: margin + 350, y: yPosition, size: 12, color: rgb(0.78, 0.39, 0.2) });
  page.drawText(formatPdfAmount(data.totalAmount), { x: margin + 430, y: yPosition, size: 12, color: rgb(0.78, 0.39, 0.2) });
  yPosition -= 25;

  drawLine();

  drawText('PAYMENT INSTRUCTIONS', 12, true);
  drawText(`Account Holder: ${PEACEFUL_TASTE_CONTACT.accountName}`, 10);
  drawText(`Bank: ${PEACEFUL_TASTE_CONTACT.bankName}`, 10);
  drawText(`Account Number: ${PEACEFUL_TASTE_CONTACT.accountNumber}`, 10, true);
  drawText(`Transfer Amount: ${formatPdfAmount(data.totalAmount)}`, 10, true);
  drawText(`Payment Reference: ${data.orderNumber}`, 10, true);
  drawText('Upload or send your transfer receipt after payment for manual confirmation.', 9);
  yPosition -= 15;

  drawText('Thank you for your order!', 10, true, [0.07, 0.27, 0.15]);
  drawText(`Contact: ${PEACEFUL_TASTE_CONTACT.phone} | WhatsApp: https://wa.me/${PEACEFUL_TASTE_CONTACT.whatsappNumber}`, 9);
  drawText(`Email: ${PEACEFUL_TASTE_CONTACT.email}`, 9);
  drawText(`Address: ${PEACEFUL_TASTE_CONTACT.address}`, 9);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function saveReceiptToFile(data: ReceiptData, outputPath: string): Promise<string> {
  const pdfBuffer = await generateOrderReceipt(data);
  const filePath = path.join(outputPath, `receipt-${data.orderNumber}.pdf`);

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  fs.writeFileSync(filePath, pdfBuffer);
  return filePath;
}
