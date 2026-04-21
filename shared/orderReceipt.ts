export const PEACEFUL_TASTE_CONTACT = {
  phone: "+234 902 262 1323",
  whatsappNumber: "2349022621323",
  email: "queenofpeace323@gmail.com",
  bankName: "Monie Point Bank",
  accountName: "Vincent Theophilus",
  accountNumber: "8139171125",
  siteUrl: "https://peacefultaste.vercel.app",
  address: "Lagos-Ibadan Expressway, Nigeria",
} as const;

export interface OrderReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderReceiptPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryLocation: string;
  createdAt: string;
  items: OrderReceiptItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
}

export function formatNairaAmount(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildReceiptText(payload: OrderReceiptPayload): string {
  const items = payload.items
    .map((item) => `- ${item.name} x${item.quantity} (${formatNairaAmount(item.price)} each)`)
    .join("\n");

  return [
    "PEACEFUL TASTE ORDER RECEIPT",
    `Order Number: ${payload.orderNumber}`,
    `Date: ${new Date(payload.createdAt).toLocaleString("en-NG")}`,
    `Customer: ${payload.customerName}`,
    `Customer Email: ${payload.customerEmail}`,
    `Customer Phone: ${payload.customerPhone || "N/A"}`,
    `Delivery Location: ${payload.deliveryLocation}`,
    `Payment Method: Bank Transfer`,
    `Payment Status: Awaiting confirmation`,
    "",
    "Items:",
    items,
    "",
    `Subtotal: ${formatNairaAmount(payload.subtotal)}`,
    `Tax: ${formatNairaAmount(payload.tax)}`,
    `Delivery: ${formatNairaAmount(payload.shippingCost)}`,
    `Total: ${formatNairaAmount(payload.totalAmount)}`,
    "",
    "Bank Transfer Details:",
    `Account Name: ${PEACEFUL_TASTE_CONTACT.accountName}`,
    `Bank: ${PEACEFUL_TASTE_CONTACT.bankName}`,
    `Account Number: ${PEACEFUL_TASTE_CONTACT.accountNumber}`,
    `Transfer Amount: ${formatNairaAmount(payload.totalAmount)}`,
    `Payment Reference: ${payload.orderNumber}`,
    "",
    `WhatsApp: https://wa.me/${PEACEFUL_TASTE_CONTACT.whatsappNumber}`,
    `Email: ${PEACEFUL_TASTE_CONTACT.email}`,
    `Address: ${PEACEFUL_TASTE_CONTACT.address}`,
  ].join("\n");
}

export function buildBusinessWhatsAppUrl(payload: OrderReceiptPayload): string {
  const text = [
    `Hello Peaceful Taste, here is a copy of order ${payload.orderNumber}.`,
    "",
    buildReceiptText(payload),
  ].join("\n");

  return `https://wa.me/${PEACEFUL_TASTE_CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function buildBusinessEmailUrl(payload: OrderReceiptPayload): string {
  const subject = `Order Receipt Copy: ${payload.orderNumber}`;
  const body = [
    "Hello Peaceful Taste,",
    "",
    "Here is a copy of the order receipt.",
    "",
    buildReceiptText(payload),
  ].join("\n");

  return `mailto:${PEACEFUL_TASTE_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
