import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowRight,
  CheckCircle,
  Copy,
  Loader2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useCart, type CartItem } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { DELIVERY_LOCATIONS, getDeliveryCost } from '@/lib/delivery';
import CheckoutProgress from '@/components/CheckoutProgress';
import { formatNaira } from '@/lib/format';
import { copyTextToClipboard } from '@/lib/orderReceipt';
import { PEACEFUL_TASTE_CONTACT } from '@shared/orderReceipt';
import PageMeta from '@/components/PageMeta';

const BANK_ACCOUNT = {
  name: PEACEFUL_TASTE_CONTACT.accountName,
  bank: PEACEFUL_TASTE_CONTACT.bankName,
  accountNumber: PEACEFUL_TASTE_CONTACT.accountNumber,
};

const TAX_RATE = 0.025;

type PendingCheckoutState = {
  checkoutReference: string;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  deliveryLocation: string;
  deliveryAddress: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{ productId: string | number; name: string; quantity: number; price: number }>;
};

export default function PaymentCheckout() {
  const [, setLocation] = useLocation();
  const { items, total } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryLocation: '',
    deliveryAddress: '',
  });
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isFlutterwaveLoading, setIsFlutterwaveLoading] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState<PendingCheckoutState | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const createPendingCheckoutMutation = trpc.orders.createPendingCheckout.useMutation();
  const initializeFlutterwaveMutation = trpc.orders.initializeFlutterwaveCheckout.useMutation();

  const subtotal = total;
  const shippingCost = formData.deliveryLocation ? getDeliveryCost(formData.deliveryLocation) : 0;
  const tax = Math.round(subtotal * TAX_RATE);
  const totalAmount = subtotal + shippingCost + tax;
  const deliveryLocationLabel =
    DELIVERY_LOCATIONS.find((location) => location.id === formData.deliveryLocation)?.name || '';

  const orderItems = useMemo<Array<{ name: string; quantity: number; price: number }>>(
    () =>
      items.map((item: CartItem) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    [items]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.deliveryAddress.trim()) {
      toast.error('Please complete the required delivery details.');
      return;
    }

    if (!formData.deliveryLocation) {
      toast.error('Please select a delivery location first.');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsSubmittingDetails(true);

    try {
      const response = await createPendingCheckoutMutation.mutateAsync({
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

      setPendingCheckout(response);
      toast.success('Checkout prepared. Choose how you want to pay.');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to start checkout';
      toast.error(errorMsg);
    } finally {
      setIsSubmittingDetails(false);
    }
  };

  const handleFlutterwaveCheckout = async () => {
    if (!pendingCheckout?.checkoutReference) {
      toast.error('Start checkout first before opening Flutterwave.');
      return;
    }

    setIsFlutterwaveLoading(true);

    try {
      const response = await initializeFlutterwaveMutation.mutateAsync({
        checkoutReference: pendingCheckout.checkoutReference,
      });

      window.location.assign(response.checkoutUrl);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unable to start Flutterwave checkout.';
      toast.error(errorMsg);
    } finally {
      setIsFlutterwaveLoading(false);
    }
  };

  const copyFieldValue = async (text: string, field: string) => {
    await copyTextToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  if (items.length === 0 && !pendingCheckout) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta
          title="Checkout"
          description="Complete your Peaceful Taste order with delivery details, pricing, and secure payment options."
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

  if (pendingCheckout) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta
          title="Choose Payment Method"
          description="Choose Flutterwave hosted checkout or direct bank transfer for your Peaceful Taste order."
          path="/checkout"
          robots="noindex, nofollow"
        />
        <CheckoutProgress currentStep="payment" />
        <div className="py-12">
          <div className="container max-w-6xl">
            <div className="mb-8">
              <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                Payment Methods
              </p>
              <h1 className="text-4xl font-bold text-foreground">Choose how you want to pay</h1>
              <p className="mt-3 max-w-3xl text-muted-foreground">
                Your checkout is prepared. A real order number will only be created after a successful payment step.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card className="glass-panel border-0 p-6">
                  <div className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-emerald-400" />
                    <div>
                      <h2 className="mb-1 font-bold text-foreground">Checkout prepared successfully</h2>
                      <p className="text-sm text-muted-foreground">
                        Payment Reference:{' '}
                        <span className="font-mono font-bold text-accent">
                          {pendingCheckout.checkoutReference}
                        </span>
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Keep this reference until your payment is completed. Your final order number appears after payment succeeds.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-panel border-0 p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-accent" />
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Payment Method 1: Flutterwave</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Secure hosted checkout. We verify the payment on the backend before showing success.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-accent/20 bg-accent/10 p-5">
                    <p className="text-sm leading-6 text-muted-foreground">
                      This is the fastest method. When Flutterwave sends you back to Peaceful Taste, we confirm the transaction securely and then create your real order number automatically.
                    </p>
                    <Button
                      onClick={handleFlutterwaveCheckout}
                      disabled={isFlutterwaveLoading}
                      className="mt-5 btn-primary text-white"
                    >
                      {isFlutterwaveLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Opening Flutterwave...
                        </>
                      ) : (
                        `Pay ${formatNaira(pendingCheckout.totalAmount)} with Flutterwave`
                      )}
                    </Button>
                  </div>
                </Card>

                <Card className="glass-panel border-0 p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Payment Method 2: Direct Bank Transfer</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Transfer the exact amount below, then upload your proof. Your real order number will be created after that payment step is submitted.
                    </p>
                  </div>

                  <div className="space-y-4 rounded-3xl bg-background/60 p-6">
                    {[
                      { label: 'Account Holder', value: BANK_ACCOUNT.name, key: 'name' },
                      { label: 'Bank Name', value: BANK_ACCOUNT.bank, key: 'bank' },
                      { label: 'Account Number', value: BANK_ACCOUNT.accountNumber, key: 'account' },
                      { label: 'Payment Reference', value: pendingCheckout.checkoutReference, key: 'reference' },
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
                      <p className="text-3xl font-bold text-primary">{formatNaira(pendingCheckout.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-accent/20 bg-accent/10 p-4 text-sm text-muted-foreground">
                    Transfer the exact amount and keep your payment reference. After payment, upload your proof on the next page.
                  </div>

                  <Button
                    onClick={() =>
                      setLocation(
                        `/payment-success?checkoutReference=${encodeURIComponent(
                          pendingCheckout.checkoutReference
                        )}&method=bank_transfer`
                      )
                    }
                    className="mt-6 btn-primary text-white"
                  >
                    Continue to Upload Proof
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </div>

              <div>
                <Card className="glass-panel sticky top-24 border-0 p-6">
                  <h3 className="mb-4 font-bold text-foreground">Checkout Summary</h3>

                  <div className="mb-6 rounded-3xl border border-border bg-background/60 p-4">
                    <div className="mb-2 flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Delivery</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{pendingCheckout.deliveryLocation}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{pendingCheckout.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-b border-border pb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">{formatNaira(pendingCheckout.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-medium text-foreground">{formatNaira(pendingCheckout.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (2.5%)</span>
                      <span className="font-medium text-foreground">{formatNaira(pendingCheckout.tax)}</span>
                    </div>
                  </div>

                  <div className="my-6">
                    <p className="mb-2 text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">{formatNaira(pendingCheckout.totalAmount)}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                      Items ({pendingCheckout.items.length})
                    </p>
                    <div className="space-y-2">
                      {pendingCheckout.items.map((item) => (
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
        description="Add delivery details, select your location, and continue with Flutterwave or direct bank transfer."
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
            <h1 className="text-4xl font-bold text-foreground">Delivery details and payment setup</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Choose your delivery location first so we can calculate the final total clearly before you pay.
            </p>
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
                      <p className="font-semibold text-foreground">
                        {formatNaira(Math.round(item.product.price * item.quantity))}
                      </p>
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
                    <span className="font-medium text-foreground">
                      {formData.deliveryLocation ? formatNaira(shippingCost) : 'Select location'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (2.5%)</span>
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

                <form onSubmit={handleStartCheckout} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName" className="mb-2 block font-semibold text-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      placeholder="Your full name"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail" className="mb-2 block font-semibold text-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone" className="mb-2 block font-semibold text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      placeholder="+234 901 234 5678"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryLocation" className="mb-2 block font-semibold text-foreground">
                      Delivery Location *
                    </Label>
                    <select
                      id="deliveryLocation"
                      name="deliveryLocation"
                      value={formData.deliveryLocation}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select your delivery location</option>
                      {DELIVERY_LOCATIONS.map((location) => (
                        <option key={location.id} value={location.id} className="bg-background text-foreground">
                          {location.name} - {formatNaira(location.cost)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="deliveryAddress" className="mb-2 block font-semibold text-foreground">
                      Full Delivery Address *
                    </Label>
                    <textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      placeholder="House number, street, estate, bus stop, area, and any useful landmark"
                      className="min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isSubmittingDetails} className="btn-primary w-full text-white">
                    {isSubmittingDetails ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preparing payment...
                      </>
                    ) : (
                      'Continue to Payment Methods'
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
                    <span className="font-medium text-foreground">
                      {formData.deliveryLocation ? formatNaira(shippingCost) : 'Select location'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (2.5%)</span>
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
