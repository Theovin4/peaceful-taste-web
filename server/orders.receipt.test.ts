import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const originalCwd = process.cwd();
let tempDir = '';

describe('order receipt flow', () => {
  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'peaceful-taste-order-test-'));
    process.chdir(tempDir);
  });

  afterAll(() => {
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates an order receipt and stores uploaded proof', async () => {
    const { appRouter } = await import('./routers');

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
      isAdminSession: false,
    });

    const created = await caller.orders.createOrder({
      customerEmail: 'customer@example.com',
      customerName: 'Receipt Test Customer',
      customerPhone: '+2348012345678',
      deliveryLocation: 'Lagos Mainland',
      deliveryAddress: '12 Example Street, Magboro, Ogun State, near the expressway bridge',
      items: [
        {
          productId: 1,
          name: 'Berry Bliss Parfait',
          quantity: 2,
          price: 3500,
        },
      ],
      subtotal: 7000,
      tax: 700,
      shippingCost: 1500,
    });

    expect(created.success).toBe(true);
    expect(created.orderNumber).toMatch(/^ORD-\d+-[a-z0-9]{5}$/);
    expect(created.receipt.fileName).toContain(created.orderNumber);
    expect(Buffer.from(created.receipt.pdfBase64, 'base64').subarray(0, 4).toString()).toBe('%PDF');
    expect(created.receipt.businessWhatsAppUrl).toContain('wa.me');
    expect(created.receipt.businessEmailUrl).toContain('mailto:');

    const uploaded = await caller.orders.uploadReceipt({
      orderNumber: created.orderNumber,
      receiptName: 'bank-transfer-proof.png',
      receiptDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6n0AAAAASUVORK5CYII=',
    });

    expect(uploaded.success).toBe(true);
    expect(fs.existsSync(uploaded.savedReceiptPath)).toBe(true);
    expect(path.basename(uploaded.savedReceiptPath)).toContain(created.orderNumber);
    expect(fs.existsSync(path.join(tempDir, 'data', 'orders.xlsx'))).toBe(true);
  }, 15000);
});
