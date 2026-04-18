import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, Copy, MessageCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { DELIVERY_LOCATIONS, getDeliveryCost } from '@/lib/delivery';
import CheckoutProgress from '@/components/CheckoutProgress';
import { formatNaira } from '@/lib/format';

const BANK_ACCOUNT = {
  name: 'Vincent Theophilus',
  bank: 'Monie Point Bank',
  accountNumber: '8139171125',
};

export default function PaymentCheckout() {
  const [, setLocation] = useLocation();
  const { items, total } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryLocation: 'lagos',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const createOrderMutation = trpc.orders.createOrder.useMutation();

  const subtotal = total;
  const shippingCost = getDeliveryCost(formData.deliveryLocation);
  const tax = Math.round(subtotal * 0.1);
  const totalAmount = subtotal + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await createOrderMutation.mutateAsync({
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        items: items.map((item) => ({
          productId: parseInt(item.product.id.split('-')[1] || '0'),
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
        toast.success('Order created. Proceed with payment.');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create order';
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleWhatsApp = () => {
    const message = `Hi, I have an order (${orderCreated?.orderNumber}) for ${formatNaira(totalAmount)}. I am ready to make payment.`;
    window.open(`https://wa.me/2349022621323?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePaymentConfirm = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 30;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setPaymentProgress(100);
        setPaymentComplete(true);
        clearInterval(interval);
      } else {
        setPaymentProgress(currentProgress);
      }
    }, 500);
  };

  const handleSendProofViaWhatsApp = () => {
    const message = `Hi, I have completed payment for order ${orderCreated?.orderNumber}. The amount transferred was ${formatNaira(totalAmount)}. Please confirm receipt.`;
    window.open(`https://wa.me/2349022621323?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
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
    return (
      <div className="min-h-screen bg-background">
        <CheckoutProgress currentStep={paymentComplete ? 'confirmation' : 'payment'} />
        <div className="py-12">
          <div className="container max-w-6xl">
            <div className="mb-8">
              <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                Payment Instructions
              </p>
              <h1 className="text-4xl font-bold text-foreground">Complete your transfer securely</h1>
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
                    </div>
                  </div>
                </Card>

                <Card className="glass-panel border-0 p-6">
                  <h2 className="mb-6 text-2xl font-bold text-foreground">Bank Transfer Details</h2>

                  <div className="space-y-4 rounded-3xl bg-background/60 p-6">
                    {[
                      { label: 'Account Holder', value: BANK_ACCOUNT.name, key: 'name' },
                      { label: 'Bank Name', value: BANK_ACCOUNT.bank, key: 'bank' },
                      { label: 'Account Number', value: BANK_ACCOUNT.accountNumber, key: 'account' },
                    ].map((field) => (
                      <div key={field.key}>
                        <p className="mb-1 text-sm text-muted-foreground">{field.label}</p>
                        <div className="flex items-center justify-between gap-3">
                          <p className={`font-semibold text-foreground ${field.key === 'account' ? 'text-lg tracking-[0.18em]' : ''}`}>
                            {field.value}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(field.value, field.key)}
                            className="h-9 rounded-xl text-accent hover:bg-accent/10 hover:text-accent"
                          >
                            <Copy className={`h-4 w-4 ${copiedField === field.key ? 'text-emerald-400' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-border pt-4">
                      <p className="mb-1 text-sm text-muted-foreground">Amount to Transfer</p>
                      <p className="text-3xl font-bold text-primary">{formatNaira(totalAmount)}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-accent/20 bg-accent/10 p-4 text-sm text-muted-foreground">
                    Transfer the exact amount and use your order number as the payment reference where possible.
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button onClick={handleWhatsApp} className="w-full bg-emerald-500 text-white hover:bg-emerald-400">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact via WhatsApp
                    </Button>
                    <Button onClick={() => setLocation('/payment-success')} variant="outline" className="w-full border-accent/40 bg-card/30 text-accent hover:bg-accent/10">
                      Upload proof of payment instead
                    </Button>
                  </div>
                </Card>

                <Card className="glass-panel border-0 p-8">
                  <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Payment Status</h2>

                  <div className="flex flex-col items-center justify-center">
                    <div className="relative mb-6 h-32 w-32">
                      <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - paymentProgress / 100)}`}
                          className="text-primary transition-all duration-300"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">{Math.round(paymentProgress)}%</p>
                          <p className="mt-1 text-xs text-muted-foreground">{paymentComplete ? 'Complete' : 'Processing'}</p>
                        </div>
                      </div>
                    </div>

                    <p className="mb-6 text-center text-muted-foreground">
                      {paymentComplete
                        ? 'Payment marked as complete. Send proof on WhatsApp or upload your receipt so we can confirm.'
                        : 'After transferring the funds, update the progress here and then send your proof of payment.'}
                    </p>

                    {!paymentComplete ? (
                      <Button onClick={handlePaymentConfirm} className="btn-primary w-full text-white">
                        I’ve Made Payment
                      </Button>
                    ) : (
                      <Button onClick={handleSendProofViaWhatsApp} className="w-full bg-emerald-500 text-white hover:bg-emerald-400">
                        Send Proof via WhatsApp
                      </Button>
                    )}
                  </div>
                </Card>
              </div>

              <div>
                <Card className="glass-panel sticky top-24 border-0 p-6">
                  <h3 className="mb-4 font-bold text-foreground">Order Summary</h3>
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

                  <div className="my-6">
                    <p className="mb-2 text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">{formatNaira(totalAmount)}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Items ({items.length})</p>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex items-start justify-between gap-3 text-sm">
                          <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
                          <span className="text-foreground">{formatNaira(item.product.price * item.quantity)}</span>
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
                </div>
              </Card>

              <Card className="glass-panel border-0 p-6">
                <h2 className="mb-6 text-2xl font-bold text-foreground">Delivery Information</h2>

                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName" className="mb-2 block text-foreground font-semibold">Full Name *</Label>
                    <Input id="customerName" name="customerName" placeholder="Your full name" value={formData.customerName} onChange={handleInputChange} required className="bg-background" />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail" className="mb-2 block text-foreground font-semibold">Email Address *</Label>
                    <Input id="customerEmail" name="customerEmail" type="email" placeholder="your@email.com" value={formData.customerEmail} onChange={handleInputChange} required className="bg-background" />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone" className="mb-2 block text-foreground font-semibold">Phone Number</Label>
                    <Input id="customerPhone" name="customerPhone" placeholder="+234 901 234 5678" value={formData.customerPhone} onChange={handleInputChange} className="bg-background" />
                  </div>

                  <div>
                    <Label htmlFor="deliveryLocation" className="mb-2 block text-foreground font-semibold">Delivery Location *</Label>
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

                  <Button type="submit" disabled={isLoading} className="btn-primary w-full text-white">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
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
