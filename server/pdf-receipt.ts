/**
 * PDF Receipt Generation Service
 * Generates professional PDF receipts for orders
 */

import { PDFDocument, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  deliveryLocation: string;
  createdAt: string;
}

export async function generateOrderReceipt(data: ReceiptData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const margin = 40;
  const contentWidth = width - 2 * margin;
  let yPosition = height - margin;

  // Helper function to draw text
  const drawText = (
    text: string,
    fontSize: number = 12,
    bold: boolean = false,
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
      color: rgb(200, 200, 200),
    });
    yPosition -= 15;
  };

  // Header
  drawText('PEACEFUL TASTE', 20, true, [200, 100, 50]);
  drawText('Order Receipt', 14, true);
  drawLine();

  // Order Info
  drawText(`Order Number: ${data.orderNumber}`, 11, true);
  drawText(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 11);
  yPosition -= 10;

  // Customer Info
  drawText('CUSTOMER INFORMATION', 12, true);
  drawText(`Name: ${data.customerName}`, 10);
  drawText(`Email: ${data.customerEmail}`, 10);
  if (data.customerPhone) {
    drawText(`Phone: ${data.customerPhone}`, 10);
  }
  drawText(`Delivery: ${data.deliveryLocation}`, 10);
  drawLine();

  // Items
  drawText('ORDER ITEMS', 12, true);
  yPosition -= 5;

  // Table headers
  page.drawText('Item', { x: margin, y: yPosition, size: 10 });
  page.drawText('Qty', { x: margin + 300, y: yPosition, size: 10 });
  page.drawText('Price', { x: margin + 350, y: yPosition, size: 10 });
  page.drawText('Total', { x: margin + 430, y: yPosition, size: 10 });
  yPosition -= 15;

  // Items list
  data.items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    page.drawText(item.name, { x: margin, y: yPosition, size: 9 });
    page.drawText(item.quantity.toString(), { x: margin + 300, y: yPosition, size: 9 });
    page.drawText(`₦${item.price.toLocaleString()}`, { x: margin + 350, y: yPosition, size: 9 });
    page.drawText(`₦${itemTotal.toLocaleString()}`, { x: margin + 430, y: yPosition, size: 9 });
    yPosition -= 12;
  });

  drawLine();

  // Summary
  yPosition -= 5;
  page.drawText('Subtotal:', { x: margin + 350, y: yPosition, size: 10 });
  page.drawText(`₦${data.subtotal.toLocaleString()}`, { x: margin + 430, y: yPosition, size: 10 });
  yPosition -= 12;

  page.drawText('Tax (10%):', { x: margin + 350, y: yPosition, size: 10 });
  page.drawText(`₦${data.tax.toLocaleString()}`, { x: margin + 430, y: yPosition, size: 10 });
  yPosition -= 12;

  page.drawText('Delivery Fee:', { x: margin + 350, y: yPosition, size: 10 });
  page.drawText(`₦${data.shippingCost.toLocaleString()}`, { x: margin + 430, y: yPosition, size: 10 });
  yPosition -= 15;

  // Total
  page.drawText('TOTAL:', { x: margin + 350, y: yPosition, size: 12, color: rgb(200, 100, 50) });
  page.drawText(`₦${data.totalAmount.toLocaleString()}`, { x: margin + 430, y: yPosition, size: 12, color: rgb(200, 100, 50) });
  yPosition -= 25;

  drawLine();

  // Payment Instructions
  drawText('PAYMENT INSTRUCTIONS', 12, true);
  drawText('Account Holder: Vincent Theophilus', 10);
  drawText('Bank: Monie Point Bank', 10);
  drawText('Account Number: 8139171125', 10, true);
  drawText(`Amount: ₦${data.totalAmount.toLocaleString()}`, 10, true);
  yPosition -= 15;

  // Footer
  drawText('Thank you for your order!', 10, true, [200, 100, 50]);
  drawText('Contact: +234 902 262 1323 | WhatsApp: https://wa.me/2349022621323', 9);
  drawText('Email: queenofpeace323@gmail.com', 9);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function saveReceiptToFile(data: ReceiptData, outputPath: string): Promise<string> {
  const pdfBuffer = await generateOrderReceipt(data);
  const filePath = path.join(outputPath, `receipt-${data.orderNumber}.pdf`);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  fs.writeFileSync(filePath, pdfBuffer);
  return filePath;
}
