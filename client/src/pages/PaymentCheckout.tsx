import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  CheckCircle,
  Copy,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Mail,
  Download,
  MapPin,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useCart, type CartItem } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { DELIVERY_LOCATIONS, getDeliveryCost } from '@/lib/delivery';
import CheckoutProgress from '@/components/CheckoutProgress';
import { formatNaira } from '@/lib/format';
import {
  copyTextToClipboard,
  downloadPdfReceipt,
  saveLatestReceipt,
  type OrderReceiptClientPackage,
} from '@/lib/orderReceipt';
import { PEACEFUL_TASTE_CONTACT } from '@shared/orderReceipt';
import PageMeta from '@/components/PageMeta';

const BANK_ACCOUNT = {
  name: PEACEFUL_TASTE_CONTACT.accountName,
  bank: PEACEFUL_TASTE_CONTACT.bankName,
  accountNumber: PEACEFUL_TASTE_CONTACT.accountNumber,
};

const FLUTTERWAVE_PAYMENT_LINK = 'https://flutterwave.com/pay/mkn9lq08pow6';

export default function PaymentCheckout() {
  const [, setLocation] = useLocation();
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryLocation: 'lagos',
    deliveryAddress: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [receiptCopied, setReceiptCopied] = useState(false);

  const createOrderMutation = trpc.orders.createOrder.useMutation();

  const subtotal = total;
  const shippingCost = getDeliveryCost(formData.deliveryLocation);
  const tax = Math.round(subtotal * 0.1);
  const totalAmount = subtotal + shippingCost + tax;
  const deliveryLocationLabel =
    DELIVERY_LOCATIONS.find((location) => location.id === formData.deliveryLocation)?.name || 'Lagos';

  const orderItems = useMemo<Array<{ name: string; quantity: number; price: number }>>(() => {
    if (orderCreated?.receipt?.payload?.items) {
      return orderCreated.receipt.payload.items;
    }

    return items.map((item: CartItem) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));
  }, [items, orderCreated]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.deliveryAddress.trim()) {
      toast.error('Please complete the required delivery details.');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await createOrderMutation.mutateAsync({
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        deliveryLocation: deliveryLocationLabel,
        deliveryAddress: formData.deliveryAddress.trim(),
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        tax,
        shippingCost,
      });

      if (response.success) {
        setOrderCreated(response);
        clearCart();

        const receiptSaved = saveLatestReceipt(response.receipt as OrderReceiptClientPackage);
        const receiptDownloaded = downloadPdfReceipt(response.receipt.fileName, response.receipt.pdfBase64);

        if (receiptSaved && receiptDownloaded) {
          toast.success('Order created, cart cleared, and customer receipt downloaded. Proceed with payment.');
        } else if (receiptSaved) {
          toast.success('Order created successfully. Your receipt is ready below if the automatic download did not start.');
        } else {
          toast.success('Order created successfully. Continue with payment using the receipt and bank details below.');
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create order';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const copyFieldValue = async (text: string, field: string) => {
    await copyTextToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const copyReceiptSummary = async () => {
    if (!orderCreated?.receipt?.receiptText) return;
    await copyTextToClipboard(orderCreated.receipt.receiptText);
    setReceiptCopied(true);
    toast.success('Receipt summary copied.');
    setTimeout(() => setReceiptCopied(false), 1800);
  };

  const handleWhatsApp = () => {
    const message = `Hi, I have an order (${orderCreated?.orderNumber}) for ${formatNaira(orderCreated?.totalAmount ?? totalAmount)}. I am ready to make payment.`;
    window.open(`https://wa.me/${PEACEFUL_TASTE_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSendProofViaWhatsApp = () => {
    const message = `Hi, I have completed payment for order ${orderCreated?.orderNumber}. The amount transferred was ${formatNaira(orderCreated?.totalAmount ?? totalAmount)}. Please confirm receipt.`;
    window.open(`https://wa.me/${PEACEFUL_TASTE_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFlutterwaveCheckout = () => {
    window.open(FLUTTERWAVE_PAYMENT_LINK, '_blank', 'noopener,noreferrer');
  };

  if (items.length === 0 && !orderCreated) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta
          title="Checkout"
          description="Complete your Peaceful Taste order with delivery details, pricing, and receipt generation."
          path="/checkout"
          robots="noindex, nofollow"
        />
        <CheckoutProgress currentStep="cart" />
        <div className="py-12">
          <div className="container max-w-2xl">
            <div className="glass-panel rounded-3xl p-10 text-center">
              <h1 className="mb-4 text-3xl font-bold text-foreground">Your cart is empty</h1>
              <p className="mb-6 text-muted-foreground">Add some delicious treats before checking out.</p>
              <Button onClick={() => setLocation('/shop')} className="btn-primary text-white">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orderCreated) {
    const receiptPayload = orderCreated.receipt.payload;

    return (
      <div className="min-h-screen bg-background">
        <PageMeta
          title="Payment Instructions"
          description="Choose bank transfer or Flutterwave checkout, download your Peaceful Taste receipt, and share your order copy for confirmation."
          path="/checkout"
          robots="noindex, nofollow"
        />
        <CheckoutProgress currentStep="payment" />
        <div className="py-12">
          <div className="container max-w-6xl">
            <div className="mb-8">
              <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                Payment Instructions
              </p>
              <h1 className="text-4xl font-bold text-foreground">Complete your payment securely</h1>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card className="glass-panel border-0 p-6">
                  <div className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-emerald-400" />
                    <div>
                      <h2 className="mb-1 font-bold text-foreground">Order created successfully</h2>
                      <p className="text-sm text-muted-foreground">
                        Order Number: <span className="font-mono font-bold text-accent">{orderCreated.orderNumber}</span>
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">Your cart has been cleared and the customer PDF receipt is ready.</p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-panel border-0 p-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-foreground">Customer Receipt Copy</h2>
                    <Button onClick={() => downloadPdfReceipt(orderCreated.receipt.fileName, orderCreated.receipt.pdfBase64)} variant="outline" className="border-accent/40 bg-card/30 text-accent hover:bg-accent/10">
                      <Download className="mr-2 h-4 w-4" />
                      Download Again
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button onClick={copyReceiptSummary} className="btn-primary text-white">
                      <Copy className="mr-2 h-4 w-4" />
                      {receiptCopied ? 'Receipt Copied' : 'Copy Receipt Summary'}
                    </Button>
                    <a href={orderCreated.receipt.businessWhatsAppUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-400">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send Copy to WhatsApp
                      </Button>
                    </a>
                    <a href={orderCreated.receipt.businessEmailUrl}>
                      <Button variant="outline" className="w-full border-accent/40 bg-card/30 text-accent hover:bg-accent/10">
                        <Mail className="mr-2 h-4 w-4" />
                        Send Copy to Email
                      </Button>
                    </a>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    These actions open prefilled WhatsApp and email drafts to Peaceful Taste using the order receipt details.
                  </p>
                </Card>

                <Card className="glass-panel border-0 p-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Payment Options</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You can pay instantly with Flutterwave or use the bank transfer details below.
                      </p>
                    </div>
                    <Button onClick={handleFlutterwaveCheckout} className="btn-primary text-white">
                      Pay with Flutterwave
                    </Button>
                  </div>

                  <div className="mb-6 rounded-3xl border border-accent/20 bg-accent/10 p-5">
                    <p className="text-sm font-semibold text-foreground">Direct checkout option</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Use your Flutterwave payment link if you want a faster direct checkout. After payment, return here to keep your order number, receipt, and confirmation steps together.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button onClick={handleFlutterwaveCheckout} className="btn-primary text-white">
                        Pay {formatNaira(orderCreated.totalAmount)} on Flutterwave
                      </Button>
                      <Button
                        onClick={() => setLocation(`/payment-success?order=${encodeURIComponent(orderCreated.orderNumber)}`)}
                        variant="outline"
                        className="border-accent/40 bg-card/30 text-accent hover:bg-accent/10"
                      >
                        I have paid already
                      </Button>
                    </div>
                  </div>

                  <h3 className="mb-6 text-xl font-bold text-foreground">Bank Transfer Details</h3>

                  <div className="space-y-4 rounded-3xl bg-background/60 p-6">
                    {[
                      { label: 'Account Holder', value: BANK_ACCOUNT.name, key: 'name' },
                      { label: 'Bank Name', value: BANK_ACCOUNT.bank, key: 'bank' },
                      { label: 'Account Number', value: BANK_ACCOUNT.accountNumber, key: 'account' },
                    ].map((field) => (
                      <div key={field.key}>
                        <p className="mb-1 text-sm text-muted-foreground">{field.label}</p>
                        <div className="flex items-center justify-between gap-3">
                          <p className={`font-semibold text-foreground ${field.key === 'account' ? 'text-lg tracking-[0.1em]' : ''}`}>
                            {field.value}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyFieldValue(field.value, field.key)}
                            className="h-9 rounded-xl text-accent hover:bg-accent/10 hover:text-accent"
                          >
                            <Copy className={`h-4 w-4 ${copiedField === field.key ? 'text-emerald-400' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-border pt-4">
                      <p className="mb-1 text-sm text-muted-foreground">Amount to Transfer</p>
                      <p className="text-3xl font-bold text-primary">{formatNaira(orderCreated.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-accent/20 bg-accent/10 p-4 text-sm text-muted-foreground">
                    For bank transfer, send the exact amount and use your order number as the payment reference where possible.
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button onClick={handleWhatsApp} className="w-full bg-emerald-500 text-white hover:bg-emerald-400">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact via WhatsApp
                    </Button>
                    <Button
                      onClick={() => setLocation(`/payment-success?order=${encodeURIComponent(orderCreated.orderNumber)}`)}
                      variant="outline"
                      className="w-full border-accent/40 bg-card/30 text-accent hover:bg-accent/10"
                    >
                      Upload proof of payment instead
                    </Button>
                  </div>
                </Card>

                <Card className="glass-panel border-0 p-8">
                  <div className="mb-8 flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-accent" />
                    <h2 className="text-2xl font-bold text-foreground">How to complete payment</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: '1. Choose your payment method',
                        body: `Pay ${formatNaira(orderCreated.totalAmount)} with Flutterwave using the direct checkout button above, or transfer to the Peaceful Taste bank account and use ${orderCreated.orderNumber} as your reference if your bank allows it.`,
                      },
                      {
                        title: '2. Save your payment confirmation',
                        body: 'A Flutterwave confirmation page, bank app screenshot, or clear photo/PDF of the transfer receipt works perfectly.',
                      },
                      {
                        title: '3. Send your proof for confirmation',
                        body: 'Upload your receipt on the next page or send it directly through WhatsApp so we can confirm and start processing your order.',
                      },
                    ].map((step) => (
                      <div key={step.title} className="rounded-3xl border border-border bg-background/60 p-5">
                        <h3 className="mb-2 text-base font-semibold text-foreground">{step.title}</h3>
                        <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                    We only mark payments as confirmed after we verify the transfer receipt. This keeps the checkout honest, secure, and easy to trust.
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Button onClick={() => setLocation(`/payment-success?order=${encodeURIComponent(orderCreated.orderNumber)}`)} className="btn-primary text-white">
                      Upload Receipt
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendProofViaWhatsApp} className="bg-emerald-500 text-white hover:bg-emerald-400">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send via WhatsApp
                    </Button>
                  </div>
                </Card>
              </div>

              <div>
                <Card className="glass-panel sticky top-24 border-0 p-6">
                  <h3 className="mb-4 font-bold text-foreground">Order Summary</h3>
                  <div className="space-y-3 border-b border-border pb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">{formatNaira(receiptPayload.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-medium text-foreground">{formatNaira(receiptPayload.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span className="font-medium text-foreground">{formatNaira(receiptPayload.tax)}</span>
                    </div>
                  </div>

                  <div className="my-6">
                    <p className="mb-2 text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">{formatNaira(orderCreated.totalAmount)}</p>
                  </div>

                  <div className="mb-6 rounded-3xl border border-border bg-background/60 p-4">
                    <div className="mb-2 flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Delivery</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{receiptPayload.deliveryLocation}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{receiptPayload.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Items ({orderItems.length})</p>
                    <div className="space-y-2">
                      {orderItems.map((item) => (
                        <div key={`${item.name}-${item.quantity}`} className="flex items-start justify-between gap-3 text-sm">
                          <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                          <span className="text-foreground">{formatNaira(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Checkout"
        description="Add delivery details, confirm your Peaceful Taste order, and continue with bank transfer or Flutterwave checkout."
        path="/checkout"
        robots="noindex, nofollow"
      />
      <CheckoutProgress currentStep="delivery" />
      <div className="py-12">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Checkout
            </p>
            <h1 className="text-4xl font-bold text-foreground">Delivery details and order review</h1>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="glass-panel border-0 p-6">
                <h2 className="mb-6 text-2xl font-bold text-foreground">Order Summary</h2>

                <div className="space-y-4 border-b border-border pb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-foreground">{formatNaira(Math.round(item.product.price * item.quantity))}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 border-b border-border pb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium text-foreground">{formatNaira(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium text-foreground">{formatNaira(tax)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-2 text-sm font-semibold text-foreground">Total Amount</p>
                  <p className="text-3xl font-bold text-primary">{formatNaira(totalAmount)}</p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    After order creation, you can pay by bank transfer or use the direct Flutterwave checkout link.
                  </p>
                </div>
              </Card>

              <Card className="glass-panel border-0 p-6">
                <h2 className="mb-6 text-2xl font-bold text-foreground">Delivery Information</h2>

                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName" className="mb-2 block font-semibold text-foreground">Full Name *</Label>
                    <Input id="customerName" name="customerName" placeholder="Your full name" value={formData.customerName} onChange={handleInputChange} required className="bg-background" />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail" className="mb-2 block font-semibold text-foreground">Email Address *</Label>
                    <Input id="customerEmail" name="customerEmail" type="email" placeholder="your@email.com" value={formData.customerEmail} onChange={handleInputChange} required className="bg-background" />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone" className="mb-2 block font-semibold text-foreground">Phone Number</Label>
                    <Input id="customerPhone" name="customerPhone" placeholder="+234 901 234 5678" value={formData.customerPhone} onChange={handleInputChange} className="bg-background" />
                  </div>

                  <div>
                    <Label htmlFor="deliveryLocation" className="mb-2 block font-semibold text-foreground">Delivery Location *</Label>
                    <select
                      id="deliveryLocation"
                      name="deliveryLocation"
                      value={formData.deliveryLocation}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {DELIVERY_LOCATIONS.map((location) => (
                        <option key={location.id} value={location.id} className="bg-background text-foreground">
                          {location.name} - {formatNaira(location.cost)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="deliveryAddress" className="mb-2 block font-semibold text-foreground">Full Delivery Address *</Label>
                    <textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      placeholder="House number, street, estate, bus stop, area, and any useful landmark"
                      className="min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground"
                      required
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      This exact address will appear on the customer receipt and order workbook.
                    </p>
                  </div>

                  <Button type="submit" disabled={isLoading} className="btn-primary w-full text-white">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Create Order and Receipt'
                    )}
                  </Button>
                  <p className="text-xs leading-6 text-muted-foreground">
                    By creating this order, you agree to the Peaceful Taste{' '}
                    <button type="button" onClick={() => setLocation('/terms-of-service')} className="text-accent underline-offset-4 hover:underline">
                      Terms of Service
                    </button>{' '}
                    and acknowledge our{' '}
                    <button type="button" onClick={() => setLocation('/privacy-policy')} className="text-accent underline-offset-4 hover:underline">
                      Privacy Policy
                    </button>
                    , including the use of essential cookies and browser storage for checkout and receipts.
                  </p>
                </form>
              </Card>
            </div>

            <div>
              <Card className="glass-panel sticky top-24 border-0 p-6">
                <h3 className="mb-4 font-bold text-foreground">At a Glance</h3>
                <div className="space-y-3 border-b border-border pb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium text-foreground">{formatNaira(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium text-foreground">{formatNaira(tax)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-2 text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">{formatNaira(totalAmount)}</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
