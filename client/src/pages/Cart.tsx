import { useLocation } from 'wouter';
import { Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Cart() {
  const [, setLocation] = useLocation();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    toast.success('Proceeding to checkout! This is a demo.');
    // In a real app, this would redirect to a payment processor
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 bg-secondary border-b border-border">
        <div className="container">
          <h1 className="text-display text-foreground mb-4">Shopping Cart</h1>
          <p className="text-lg text-muted-foreground">
            Review your items and proceed to checkout
          </p>
        </div>
      </section>

      {/* Cart Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-6">Your cart is empty</p>
              <Button
                onClick={() => setLocation('/shop')}
                className="bg-primary hover:bg-primary/90 text-white gap-2"
              >
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-border overflow-hidden" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
                  <div className="p-6 border-b border-border">
                    <h2 className="font-semibold text-foreground">
                      {items.length} item{items.length !== 1 ? 's' : ''} in cart
                    </h2>
                  </div>

                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <div key={item.product.id} className="p-6 flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            ${item.product.price.toFixed(2)} each
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mb-3">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-1 border border-border rounded hover:bg-secondary transition-all"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 min-w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 border border-border rounded hover:bg-secondary transition-all"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <p className="font-semibold text-primary">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => {
                            removeItem(item.product.id);
                            toast.success('Item removed from cart');
                          }}
                          className="text-muted-foreground hover:text-destructive transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Button
                    onClick={() => setLocation('/shop')}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-border p-6 sticky top-24" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
                  <h3 className="font-semibold text-foreground mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground font-medium">$5.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground font-medium">${(total * 0.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${(total + 5 + total * 0.1).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold mb-3"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    onClick={() => {
                      clearCart();
                      toast.success('Cart cleared');
                    }}
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive/5"
                  >
                    Clear Cart
                  </Button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      We accept all major payment methods
                    </p>
                    <div className="flex justify-center gap-2">
                      <span className="text-xs bg-secondary px-2 py-1 rounded">Secure</span>
                      <span className="text-xs bg-secondary px-2 py-1 rounded">Fast</span>
                      <span className="text-xs bg-secondary px-2 py-1 rounded">Fresh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
