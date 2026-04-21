import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { PEACEFUL_TASTE_CONTACT, type OrderReceiptPayload } from '@shared/orderReceipt';

export interface ReceiptData extends OrderReceiptPayload {}

function formatPdfAmount(amount: number) {
  return `NGN ${amount.toLocaleString('en-NG')}`;
}

async function fetchLogoBytes() {
  try {
    const response = await fetch(PEACEFUL_TASTE_CONTACT.logoUrl);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  }
}

export async function generateOrderReceipt(data: ReceiptData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const logoBytes = await fetchLogoBytes();
  const logoImage = logoBytes ? await pdfDoc.embedJpg(logoBytes) : null;

  const colors = {
    bg: rgb(0.97, 0.95, 0.9),
    green: rgb(0.08, 0.26, 0.14),
    brown: rgb(0.47, 0.29, 0.14),
    gold: rgb(0.84, 0.66, 0.43),
    text: rgb(0.09, 0.11, 0.12),
    muted: rgb(0.37, 0.39, 0.41),
    white: rgb(1, 1, 1),
    line: rgb(0.82, 0.79, 0.73),
  };

  page.drawRectangle({ x: 0, y: 0, width, height, color: colors.bg });
  page.drawRectangle({ x: 0, y: height - 118, width, height: 118, color: colors.green });
  page.drawRectangle({ x: 0, y: 0, width, height: 78, color: colors.green });
  page.drawRectangle({ x: 40, y: height - 152, width: width - 80, height: 4, color: colors.gold });

  if (logoImage) {
    page.drawImage(logoImage, {
      x: 42,
      y: height - 96,
      width: 56,
      height: 56,
    });
  }

  page.drawText('PEACEFUL TASTE', {
    x: 112,
    y: height - 58,
    size: 25,
    font: fontBold,
    color: colors.white,
  });
  page.drawText('Premium Catering', {
    x: 114,
    y: height - 80,
    size: 11,
    font: fontRegular,
    color: colors.white,
  });
  page.drawText('ORDER RECEIPT', {
    x: width - 180,
    y: height - 58,
    size: 20,
    font: fontBold,
    color: colors.white,
  });
  page.drawText(`Receipt Date: ${new Date(data.createdAt).toLocaleString('en-NG')}`, {
    x: width - 180,
    y: height - 80,
    size: 10,
    font: fontRegular,
    color: colors.white,
  });

  let y = height - 182;

  const drawSectionTitle = (title: string) => {
    page.drawText(title, {
      x: 42,
      y,
      size: 12,
      font: fontBold,
      color: colors.brown,
    });
    y -= 8;
    page.drawLine({
      start: { x: 42, y },
      end: { x: width - 42, y },
      thickness: 1,
      color: colors.line,
    });
    y -= 18;
  };

  const drawLabelValue = (label: string, value: string, valueX = 175) => {
    page.drawText(label, {
      x: 42,
      y,
      size: 10,
      font: fontBold,
      color: colors.text,
    });
    page.drawText(value, {
      x: valueX,
      y,
      size: 10,
      font: fontRegular,
      color: colors.text,
    });
    y -= 16;
  };

  drawSectionTitle('Receipt Summary');
  drawLabelValue('Order Number', data.orderNumber);
  drawLabelValue('Payment Method', 'Bank Transfer');
  drawLabelValue('Payment Status', 'Awaiting confirmation');
  drawLabelValue('Transfer Amount', formatPdfAmount(data.totalAmount));
  drawLabelValue('Payment Reference', data.orderNumber);

  y -= 8;
  drawSectionTitle('Customer & Delivery Details');
  drawLabelValue('Customer Name', data.customerName);
  drawLabelValue('Customer Email', data.customerEmail);
  drawLabelValue('Customer Phone', data.customerPhone || 'N/A');
  drawLabelValue('Delivery Location', data.deliveryLocation);

  page.drawText('Full Delivery Address', {
    x: 42,
    y,
    size: 10,
    font: fontBold,
    color: colors.text,
  });
  y -= 15;
  const addressLines = [data.deliveryAddress].flatMap((line) =>
    line.match(/.{1,62}(|$)/g)?.map((part) => part.trim()).filter(Boolean) || [line]
  );
  addressLines.forEach((line) => {
    page.drawText(line, {
      x: 42,
      y,
      size: 10,
      font: fontRegular,
      color: colors.text,
    });
    y -= 14;
  });

  y -= 6;
  drawSectionTitle('Order Items');

  const headers = [
    { label: 'Item', x: 42 },
    { label: 'Qty', x: 315 },
    { label: 'Price', x: 365 },
    { label: 'Total', x: 455 },
  ];
  headers.forEach((header) => {
    page.drawText(header.label, {
      x: header.x,
      y,
      size: 10,
      font: fontBold,
      color: colors.muted,
    });
  });
  y -= 14;
  page.drawLine({
    start: { x: 42, y },
    end: { x: width - 42, y },
    thickness: 1,
    color: colors.line,
  });
  y -= 16;

  data.items.forEach((item) => {
    const total = item.price * item.quantity;
    page.drawText(item.name.slice(0, 42), {
      x: 42,
      y,
      size: 10,
      font: fontRegular,
      color: colors.text,
    });
    page.drawText(String(item.quantity), {
      x: 320,
      y,
      size: 10,
      font: fontRegular,
      color: colors.text,
    });
    page.drawText(formatPdfAmount(item.price), {
      x: 365,
      y,
      size: 10,
      font: fontRegular,
      color: colors.text,
    });
    page.drawText(formatPdfAmount(total), {
      x: 455,
      y,
      size: 10,
      font: fontBold,
      color: colors.text,
    });
    y -= 16;
  });

  y -= 2;
  page.drawLine({
    start: { x: 42, y },
    end: { x: width - 42, y },
    thickness: 1,
    color: colors.line,
  });
  y -= 18;

  const totals = [
    ['Subtotal', formatPdfAmount(data.subtotal)],
    ['Tax (10%)', formatPdfAmount(data.tax)],
    ['Delivery Fee', formatPdfAmount(data.shippingCost)],
  ];
  totals.forEach(([label, value]) => {
    page.drawText(label, {
      x: 350,
      y,
      size: 10,
      font: fontRegular,
      color: colors.text,
    });
    page.drawText(value, {
      x: 455,
      y,
      size: 10,
      font: fontRegular,
      color: colors.text,
    });
    y -= 16;
  });

  page.drawText('TOTAL', {
    x: 350,
    y,
    size: 12,
    font: fontBold,
    color: colors.brown,
  });
  page.drawText(formatPdfAmount(data.totalAmount), {
    x: 455,
    y,
    size: 12,
    font: fontBold,
    color: colors.brown,
  });

  y -= 30;
  drawSectionTitle('Bank Transfer Details');
  drawLabelValue('Bank', PEACEFUL_TASTE_CONTACT.bankName);
  drawLabelValue('Account Name', PEACEFUL_TASTE_CONTACT.accountName);
  drawLabelValue('Account Number', PEACEFUL_TASTE_CONTACT.accountNumber);
  drawLabelValue('Reference', data.orderNumber);

  page.drawText('Please transfer the exact amount and upload your proof of payment for confirmation.', {
    x: 42,
    y,
    size: 9,
    font: fontRegular,
    color: colors.muted,
  });

  page.drawText(`WhatsApp: ${PEACEFUL_TASTE_CONTACT.phone}`, {
    x: 42,
    y: 48,
    size: 9,
    font: fontRegular,
    color: colors.white,
  });
  page.drawText(`Email: ${PEACEFUL_TASTE_CONTACT.email}`, {
    x: 210,
    y: 48,
    size: 9,
    font: fontRegular,
    color: colors.white,
  });
  page.drawText(`IG: ${PEACEFUL_TASTE_CONTACT.instagram} | FB: ${PEACEFUL_TASTE_CONTACT.facebook} | TikTok: ${PEACEFUL_TASTE_CONTACT.tiktok}`, {
    x: 42,
    y: 32,
    size: 8.5,
    font: fontRegular,
    color: colors.white,
  });
  page.drawText(PEACEFUL_TASTE_CONTACT.address, {
    x: 42,
    y: 17,
    size: 8.5,
    font: fontRegular,
    color: colors.white,
  });

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
