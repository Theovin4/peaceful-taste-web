import { useEffect, useMemo, useState } from 'react';
import { Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { formatNaira } from '@/lib/format';
import { useCatalog } from '@/hooks/useCatalog';
import ProductVisual from '@/components/ProductVisual';

export default function LimitedTimeOffers() {
  const [, setLocation] = useLocation();
  const { products, settings } = useCatalog();
  const flashDealProducts = useMemo(() => {
    const preferred = settings?.flashDealProductIds?.length
      ? settings.flashDealProductIds
          .map((productId) => products.find((product) => product.id === productId))
          .filter((product): product is (typeof products)[number] => Boolean(product))
      : [];

    if (preferred.length > 0) {
      return preferred;
    }

    return products.filter((product) => product.isBestSeller).slice(0, 3);
  }, [products, settings]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (flashDealProducts.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % flashDealProducts.length);
    }, 30000);

    return () => window.clearInterval(interval);
  }, [flashDealProducts.length]);

  if (flashDealProducts.length === 0) {
    return null;
  }

  const activeDeal = flashDealProducts[activeIndex] ?? flashDealProducts[0];
  const originalPrice = Math.round(activeDeal.price * 1.15);
  const specialPrice = activeDeal.price;
  const discount = Math.max(10, Math.round(((originalPrice - specialPrice) / originalPrice) * 100));

  return (
    <section className="border-y border-border bg-[radial-gradient(circle_at_top_right,rgba(214,169,109,0.16),transparent_28%),linear-gradient(135deg,#141b20,#0f1419)] py-12">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="min-w-64 flex-1">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              <span className="text-sm font-bold uppercase tracking-wide text-red-400">Today's Flash Deal</span>
            </div>
            <div className="relative min-h-[220px] overflow-hidden">
              <div key={activeDeal.id} className="animate-fade-in-up">
                <h3 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">{activeDeal.name}</h3>
                <p className="mb-4 max-w-xl text-sm leading-6 text-muted-foreground">{activeDeal.description}</p>
                <div className="mb-4 flex flex-wrap items-center gap-4 rounded-2xl border border-accent/30 bg-black/20 px-4 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.28)]">
                  <span className="text-3xl font-black text-foreground">{formatNaira(specialPrice)}</span>
                  <span className="text-lg font-medium text-muted-foreground line-through">{formatNaira(originalPrice)}</span>
                  <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">Save {discount}%</span>
                </div>
                <p className="mb-4 text-muted-foreground">Rotates every 30 seconds and only features your live products.</p>
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-400">
                  <Clock className="h-4 w-4" />
                  <span>Offer refreshes automatically throughout the day</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => setLocation('/shop')} className="bg-red-600 font-bold text-white hover:bg-red-700">
                    Shop Now
                  </Button>
                  <div className="flex gap-2">
                    {flashDealProducts.map((product, index) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-accent' : 'w-2.5 bg-white/30'}`}
                        aria-label={`Show flash deal ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-w-64 flex-1 justify-center">
            <div className="relative w-full max-w-xs">
              <ProductVisual key={activeDeal.id} product={activeDeal} className="animate-fade-in-up" />
              <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-center text-white">
                <div>
                  <div className="text-[10px] font-bold">SAVE</div>
                  <div className="text-lg font-bold">{discount}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
