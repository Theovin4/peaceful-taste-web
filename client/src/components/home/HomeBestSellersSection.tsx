import { ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/products';

type HomeBestSellersSectionProps = {
  products: Product[];
};

export default function HomeBestSellersSection({
  products,
}: HomeBestSellersSectionProps) {
  const [, setLocation] = useLocation();

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-heading mb-4 text-foreground">Customer Favorites</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Best-selling treats customers come back for again and again.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button onClick={() => setLocation('/shop')} className="btn-primary gap-2 text-white">
            View All Products <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
