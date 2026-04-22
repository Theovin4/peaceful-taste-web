import { useLocation } from 'wouter';
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatNaira } from '@/lib/format';
import ProductVisual from '@/components/ProductVisual';
import PageMeta from '@/components/PageMeta';

export default function Cart() {
  const [, setLocation] = useLocation();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const bulkDiscount = totalQuantity >= 6 ? Math.round(total * 0.1) : 0;
  const discountedTotal = total - bulkDiscount;
  const shipping = 500;
  const tax = Math.round(discountedTotal * 0.1);
  const grandTotal = discountedTotal + shipping + tax;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLocation('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Shopping Cart"
        description="Review your Peaceful Taste cart, update quantities, and move into secure checkout with clear delivery fees and totals."
        path="/cart"
        robots="noindex, nofollow"
      />
      <section className="relative overflow-hidden border-b border-border py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,169,109,0.1),transparent_24%),radial-gradient(circle_at_left,rgba(63,107,34,0.18),transparent_28%)]" />
        <div className="container relative">
          <p className="mb-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Cart review
          </p>
          <h1 className="text-display mb-4 text-foreground">Shopping Cart</h1>
          <p className="text-lg text-muted-foreground">
            Review your order, refine quantities, and move smoothly into payment.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {items.length === 0 ? (
            <div className="glass-panel mx-auto max-w-3xl rounded-3xl p-10 text-center">
              <h2 className="text-2xl font-semibold text-foreground">Your cart is empty</h2>
              <p className="mt-3 text-muted-foreground">Add a few treats to continue with delivery and payment.</p>
              <Button onClick={() => setLocation('/shop')} className="btn-primary mt-6 gap-2 text-white">
                Continue Shopping <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="glass-panel overflow-hidden rounded-3xl">
                  <div className="border-b border-border px-6 py-5">
                    <h2 className="font-semibold text-foreground">
                      {items.length} item{items.length !== 1 ? 's' : ''} in cart
                    </h2>
                  </div>

                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-4 px-6 py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary">
                          <ProductVisual
                            product={item.product}
                            variant="compact"
                            className="h-full w-full rounded-none border-0"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold text-foreground">{item.product.name}</h3>
                          <p className="mb-3 text-sm text-muted-foreground">{formatNaira(item.product.price)} each</p>

                          <div className="mb-3 flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="rounded-xl border border-border bg-background/60 px-3 py-1 text-foreground hover:bg-secondary"
                            >
                              -
                            </button>
                            <span className="min-w-12 px-4 py-1 text-center text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="rounded-xl border border-border bg-background/60 px-3 py-1 text-foreground hover:bg-secondary"
                            >
                              +
                            </button>
                          </div>

                          <p className="font-semibold text-accent">{formatNaira(item.product.price * item.quantity)}</p>
                        </div>

                        <button
                          onClick={() => {
                            removeItem(item.product.id);
                            toast.success('Item removed from cart');
                          }}
                          className="self-start text-muted-foreground transition-all hover:text-destructive"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() => setLocation('/shop')}
                    variant="outline"
                    className="border-accent/40 bg-card/30 text-accent hover:bg-accent/10"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>

              <div>
                <div className="glass-panel sticky top-24 rounded-3xl p-6">
                  <h3 className="mb-6 font-semibold text-foreground">Order Summary</h3>

                  <div className="space-y-4 border-b border-border pb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({totalQuantity} items)</span>
                      <span className="font-medium text-foreground">{formatNaira(total)}</span>
                    </div>

                    {bulkDiscount > 0 ? (
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm">
                        <div className="flex justify-between">
                          <span className="font-semibold text-emerald-300">Bulk discount (10%)</span>
                          <span className="font-semibold text-emerald-300">-{formatNaira(bulkDiscount)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3 text-sm text-accent">
                        Add {Math.max(0, 6 - totalQuantity)} more item(s) to unlock a 10% bundle discount.
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-foreground">{formatNaira(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium text-foreground">{formatNaira(tax)}</span>
                    </div>
                  </div>

                  <div className="my-6 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">{formatNaira(grandTotal)}</span>
                  </div>

                  <Button onClick={handleCheckout} className="btn-primary mb-3 w-full gap-2 text-white">
                    Proceed to Payment <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => {
                      clearCart();
                      toast.success('Cart cleared');
                    }}
                    variant="outline"
                    className="w-full border-destructive/50 bg-transparent text-destructive hover:bg-destructive/10"
                  >
                    Clear Cart
                  </Button>

                  <div className="mt-6 border-t border-border pt-6">
                    <div className="mb-3 flex items-center justify-center gap-2 text-accent">
                      <ShieldCheck className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.22em]">Manual bank transfer</p>
                    </div>
                    <div className="flex justify-center gap-2 text-xs">
                      <span className="rounded-full bg-card px-3 py-1 text-muted-foreground">Secure</span>
                      <span className="rounded-full bg-card px-3 py-1 text-muted-foreground">Fast</span>
                      <span className="rounded-full bg-card px-3 py-1 text-muted-foreground">Fresh</span>
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
