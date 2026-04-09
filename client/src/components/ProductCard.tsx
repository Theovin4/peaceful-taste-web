import { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
    <div className="product-card bg-card rounded-lg overflow-hidden border border-border">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-secondary h-64">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {product.isBestSeller && (
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              New
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg border-2 border-primary">
          <span className="text-3xl font-black text-primary drop-shadow-lg">₦{product.price.toLocaleString()}</span>
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-medium">4.8</span>
          </div>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex gap-2 items-center">
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-foreground hover:bg-secondary" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              −
            </button>
            <span className="px-4 py-1 text-center min-w-12">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 text-foreground hover:bg-secondary" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              +
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2 btn-primary"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
