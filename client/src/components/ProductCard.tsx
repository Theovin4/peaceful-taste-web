import { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatNaira } from '@/lib/format';
import ProductVisual from '@/components/ProductVisual';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart!`);
    setQuantity(1);
  };

  return (
    <div className="product-card overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="relative h-64 overflow-hidden bg-secondary">
        <ProductVisual product={product} className="h-full w-full rounded-none border-0" />

        <div className="absolute left-4 top-4 flex gap-2">
          {product.isBestSeller && (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              New
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div>
          {product.size && (
            <p className="mb-2 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              {product.size}
            </p>
          )}
          <h3 className="mb-1 text-lg font-semibold text-foreground">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/10 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Price</p>
            <span className="text-3xl font-black text-foreground">{formatNaira(product.price)}</span>
          </div>
          <div className="flex items-center gap-1 text-accent">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs font-medium">4.8</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-border bg-background/60">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-foreground hover:bg-secondary"
              style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              -
            </button>
            <span className="min-w-12 px-4 py-1 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 text-foreground hover:bg-secondary"
              style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              +
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            className="btn-primary flex-1 gap-2 text-white"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
