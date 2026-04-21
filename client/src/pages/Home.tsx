import { useLocation } from 'wouter';
import { ArrowRight, Leaf, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import LimitedTimeOffers from '@/components/LimitedTimeOffers';
import NewsletterSignup from '@/components/NewsletterSignup';
import { useCatalog } from '@/hooks/useCatalog';

const PARFAIT_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-1_a50b4f59.jpg';

export default function Home() {
  const [, setLocation] = useLocation();
  const { products } = useCatalog();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

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
                Rich Nigerian treats with a darker, more premium feel.
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Discover handcrafted parfaits, pastries, chin-chin, and puff-puff made in small batches and delivered with care. Peaceful Taste now opens with a faster, cleaner storefront experience.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={() => setLocation('/shop')}
                  className="btn-primary gap-2 text-white"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setLocation('/services')}
                  variant="outline"
                  className="border-accent/40 bg-card/30 text-accent hover:bg-accent/10"
                >
                  Explore Services
                </Button>
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <img
                  src={PARFAIT_IMAGE}
                  alt="Fresh parfait from Peaceful Taste"
                  className="w-full rounded-2xl object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={{ boxShadow: '0 30px 60px rgba(0, 0, 0, 0.35)' }}
                />
                <div className="glass-panel absolute -bottom-6 -left-6 max-w-xs rounded-2xl p-4 text-foreground">
                  <p className="mb-1 font-semibold">100% Fresh Daily</p>
                  <p className="text-sm text-muted-foreground">Premium ingredients, balanced sweetness, same-day delivery support.</p>
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
                  We source only the freshest ingredients so every order tastes bright and balanced.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="mt-1 h-8 w-8 flex-shrink-0 text-accent" />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Clean Preparation</h3>
                <p className="text-sm text-muted-foreground">
                  Our kitchen workflow is built for consistency, hygiene, and dependable delivery quality.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Sparkles className="mt-1 h-8 w-8 flex-shrink-0 text-accent" />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Handcrafted Daily</h3>
                <p className="text-sm text-muted-foreground">
                  Every tray, cup, and box is prepared fresh with care instead of mass-produced.
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
            <Button
              onClick={() => setLocation('/shop')}
              className="btn-primary gap-2 text-white"
            >
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
                text: 'The Berry Bliss Parfait is absolutely delicious. Fresh ingredients and perfect portions. I order every week now.',
                rating: 5,
              },
              {
                name: 'Tunde Adeyemi',
                location: 'Ibadan',
                text: 'Best puff-puff I have ever had. Fluffy, fresh, and delivered quickly. Highly recommended for parties.',
                rating: 5,
              },
              {
                name: 'Zainab Hassan',
                location: 'Abuja',
                text: 'The croissants are buttery and flaky. Perfect for breakfast, and the overall quality feels premium.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="glass-panel rounded-2xl p-6"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-lg text-accent">
                      ★
                    </span>
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
              <Button
                onClick={() => setLocation('/services')}
                className="btn-primary gap-2 text-white"
              >
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
              Browse the full collection and place your order today. Fresh treats, darker premium styling, and a faster storefront experience.
            </p>
            <Button
              onClick={() => setLocation('/shop')}
              className="btn-primary gap-2 text-white"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
