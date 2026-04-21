import { useLocation } from 'wouter';
import { ArrowRight, Leaf, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import LimitedTimeOffers from '@/components/LimitedTimeOffers';
import NewsletterSignup from '@/components/NewsletterSignup';
import { useCatalog } from '@/hooks/useCatalog';
import { formatNaira } from '@/lib/format';
import ProductVisual from '@/components/ProductVisual';

export default function Home() {
  const [, setLocation] = useLocation();
  const { products, settings } = useCatalog();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const featuredProduct =
    products.find((product) => product.id === settings?.featuredStoryProductId) ||
    bestSellers[0] ||
    products[0];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,169,109,0.16),transparent_24%),radial-gradient(circle_at_left,rgba(63,107,34,0.22),transparent_32%)]" />
        <div className="container">
          <div className="relative grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="animate-fade-in-up">
              <p className="mb-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Fresh daily in Lagos
              </p>
              <h1 className="text-display mb-6 max-w-xl text-foreground">
                Order irresistible Nigerian food, drinks, and desserts customers want to buy again.
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Fast ordering, premium presentation, and handcrafted products that turn first-time visitors into repeat customers. Peaceful Taste is built for cravings, gifting, and event orders.
              </p>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                <Button onClick={() => setLocation('/shop')} className="btn-primary gap-2 text-white">
                  Shop Best Sellers <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setLocation('/services')}
                  variant="outline"
                  className="border-accent/40 bg-card/30 text-accent hover:bg-accent/10"
                >
                  Request Catering
                </Button>
              </div>

              {featuredProduct && (
                <div className="glass-panel max-w-xl rounded-3xl p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-accent">Featured story</p>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{featuredProduct.name}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{featuredProduct.description}</p>
                    </div>
                    <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">From</p>
                      <p className="text-xl font-black text-foreground">{formatNaira(featuredProduct.price)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                {featuredProduct ? (
                  <ProductVisual product={featuredProduct} variant="hero" className="w-full" />
                ) : (
                  <div className="glass-panel flex min-h-[420px] items-center justify-center rounded-2xl text-center text-muted-foreground">
                    Product visuals are loading...
                  </div>
                )}
                <div className="glass-panel absolute -bottom-6 -left-6 max-w-xs rounded-2xl p-4 text-foreground">
                  <p className="mb-1 font-semibold">Same-day ready support</p>
                  <p className="text-sm text-muted-foreground">Strong visual presentation, clear pricing, and a faster checkout journey for customers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LimitedTimeOffers />

      <section className="border-y border-border bg-card/55 py-12 backdrop-blur-md">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <Leaf className="mt-1 h-8 w-8 flex-shrink-0 text-accent" />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Premium Ingredients</h3>
                <p className="text-sm text-muted-foreground">
                  Fresh ingredients and strong finishing keep every order appealing online and in person.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="mt-1 h-8 w-8 flex-shrink-0 text-accent" />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Clear Delivery Process</h3>
                <p className="text-sm text-muted-foreground">
                  Customers see transparent pricing, exact delivery details, and clear payment instructions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Sparkles className="mt-1 h-8 w-8 flex-shrink-0 text-accent" />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Built to Convert</h3>
                <p className="text-sm text-muted-foreground">
                  Better product focus, stronger pricing visibility, and rotating offers keep the storefront active.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-heading mb-4 text-foreground">Customer Favorites</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Best-selling treats customers come back for again and again.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
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

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-heading mb-4 text-foreground">What Customers Say</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Real feedback from customers who rely on Peaceful Taste for everyday cravings and events.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                name: 'Chioma Okafor',
                location: 'Lagos',
                text: 'The parfaits feel premium, the delivery details are clear, and ordering is much easier now.',
                rating: 5,
              },
              {
                name: 'Tunde Adeyemi',
                location: 'Ibadan',
                text: 'The puff-puff and chin-chin always look fresh and the checkout process is very straightforward.',
                rating: 5,
              },
              {
                name: 'Zainab Hassan',
                location: 'Abuja',
                text: 'The presentation, receipts, and WhatsApp follow-up make the brand feel more trustworthy.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={testimonial.name} className="glass-panel rounded-2xl p-6" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-lg text-accent">★</span>
                  ))}
                </div>
                <p className="mb-4 font-medium leading-relaxed text-card-foreground">{testimonial.text}</p>
                <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                <p className="text-sm text-card-foreground/60">{testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-heading mb-6 text-foreground">Special Services</h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                We also cater for events, bulk office orders, and custom dessert packages for celebrations.
              </p>
              <ul className="mb-8 space-y-4">
                {[
                  'Event Catering and Snack Platters',
                  'Bulk Orders for Businesses',
                  'Custom Dessert Packages',
                  'Corporate Gifting',
                ].map((service) => (
                  <li key={service} className="flex items-center gap-3">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                    <span className="text-foreground">{service}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={() => setLocation('/services')} className="btn-primary gap-2 text-white">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="glass-panel rounded-2xl p-8">
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,rgba(214,169,109,0.16),transparent_35%),linear-gradient(180deg,#141b20,#0f1419)]">
                <div className="text-center">
                  <Sparkles className="mx-auto mb-4 h-16 w-16 text-accent" />
                  <p className="font-semibold text-foreground">Custom orders available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />

      <section className="py-12">
        <div className="container">
          <div className="glass-panel rounded-3xl px-6 py-10 text-center md:px-12">
            <h2 className="text-heading mb-4 text-foreground">Ready to Order?</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Browse the full collection and place your order today. Clear pricing, premium presentation, and a faster storefront experience.
            </p>
            <Button onClick={() => setLocation('/shop')} className="btn-primary gap-2 text-white">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
