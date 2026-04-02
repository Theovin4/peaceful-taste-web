import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { DELIVERY_LOCATIONS, getDeliveryCost } from '@/lib/delivery';
import CheckoutProgress from '@/components/CheckoutProgress';

const BANK_ACCOUNT = {
  name: 'Vincent Theophilus',
  bank: 'Monie Point Bank',
  accountNumber: '8139171125',
};

export default function PaymentCheckout() {
  const [, setLocation] = useLocation();
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryLocation: 'lagos',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const createOrderMutation = trpc.orders.createOrder.useMutation();

  const subtotal = total;
  const shippingCost = getDeliveryCost(formData.deliveryLocation);
  const tax = Math.round(subtotal * 0.1);
  const totalAmount = subtotal + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
        items: items.map(item => ({
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
        toast.success('Order created! Proceed with payment.');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create order';
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = `Hi, I have an order (${orderCreated?.orderNumber}) for ₦${totalAmount.toLocaleString()}. I'm ready to make payment.`;
    window.open(`https://wa.me/2349022621323?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePaymentConfirm = () => {
    // Simulate payment progress
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
    const message = `Hi, I have completed payment for order ${orderCreated?.orderNumber}. The amount transferred was ₦${totalAmount.toLocaleString()}. Please confirm receipt.`;
    window.open(`https://wa.me/2349022621323?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <CheckoutProgress currentStep="cart" />
        <div className="py-12">
          <div className="container max-w-2xl">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-6">Add some delicious treats before checking out!</p>
              <Button
                onClick={() => setLocation('/shop')}
                className="bg-primary hover:bg-primary/90 text-white"
              >
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
        <CheckoutProgress currentStep={paymentComplete ? "confirmation" : "payment"} />
        <div className="py-12">
          <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Payment Instructions</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6 border-green-200 bg-green-50">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h2 className="font-bold text-green-900 mb-1">Order Created Successfully!</h2>
                    <p className="text-sm text-green-800">Order Number: <span className="font-mono font-bold">{orderCreated.orderNumber}</span></p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Bank Transfer Details</h2>
                
                <div className="bg-secondary rounded-lg p-6 mb-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account Holder</p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-foreground">{BANK_ACCOUNT.name}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(BANK_ACCOUNT.name)}
                        className="h-8"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-foreground">{BANK_ACCOUNT.bank}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(BANK_ACCOUNT.bank)}
                        className="h-8"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                    <div className="flex justify-between items-center">
                      <p className="font-mono font-bold text-foreground text-lg">{BANK_ACCOUNT.accountNumber}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(BANK_ACCOUNT.accountNumber)}
                        className="h-8"
                      >
                        <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Amount to Transfer</p>
                    <p className="text-3xl font-bold text-primary">₦{totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-700">
                    <strong>Important:</strong> Please transfer the exact amount shown above. Use your order number as the payment reference if possible.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                  >
                    💬 Contact via WhatsApp
                  </Button>
                </div>
              </Card>

              {/* Payment Progress Circle */}
              <Card className="p-8 mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Payment Status</h2>
                
                <div className="flex flex-col items-center justify-center">
                  {/* Circular Progress */}
                  <div className="relative w-32 h-32 mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted"
                      />
                      {/* Progress circle */}
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
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{Math.round(paymentProgress)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {paymentComplete ? 'Complete' : 'Processing'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-muted-foreground mb-6">
                    {paymentComplete 
                      ? 'Payment received! Send proof via WhatsApp for confirmation.'
                      : 'Click the button below after making payment to update progress.'}
                  </p>

                  {!paymentComplete ? (
                    <Button
                      onClick={handlePaymentConfirm}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                    >
                      I've Made Payment
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSendProofViaWhatsApp}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                    >
                      📱 Send Proof via WhatsApp
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6 bg-secondary">
                <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">₦{shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium">₦{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-muted-foreground text-xs mb-2">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">₦{totalAmount.toLocaleString()}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Items ({items.length})</p>
                  <div className="space-y-1">
                    {items.map(item => (
                      <p key={item.product.id} className="text-xs text-muted-foreground">
                        {item.product.name} x{item.quantity}
                      </p>
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
        <div className="container max-w-4xl">
            <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-foreground">
                      ₦{Math.round(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">₦{shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium">₦{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold text-foreground mb-2">Total Amount</p>
                <p className="text-3xl font-bold text-primary">₦{totalAmount.toLocaleString()}</p>
              </div>
            </Card>

            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Delivery Information</h2>
              
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <Label htmlFor="customerName" className="text-foreground font-semibold mb-2 block">Full Name *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    placeholder="Your full name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="bg-secondary text-foreground border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="customerEmail" className="text-foreground font-semibold mb-2 block">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="bg-secondary text-foreground border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone" className="text-foreground font-semibold mb-2 block">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    placeholder="+234 901 234 5678"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="bg-secondary text-foreground border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryLocation" className="text-foreground font-semibold mb-2 block">Delivery Location *</Label>
                  <select
                    id="deliveryLocation"
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-secondary text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {DELIVERY_LOCATIONS.map(location => (
                      <option key={location.id} value={location.id} className="bg-background text-foreground">
                        {location.name} - ₦{location.cost.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                <Card className="p-6 bg-secondary sticky top-24">
                  <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-medium text-foreground">₦{shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span className="font-medium text-foreground">₦{tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">₦{totalAmount.toLocaleString()}</p>
                  </div>
                </Card>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
