import { useLocation } from 'wouter';
import { ArrowRight, Leaf, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';
import LimitedTimeOffers from '@/components/LimitedTimeOffers';
import NewsletterSignup from '@/components/NewsletterSignup';

const PARFAIT_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-1_a50b4f59.jpg';

export default function Home() {
  const [, setLocation] = useLocation();
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="animate-fade-in-up">
              <h1 className="text-display mb-6 text-foreground">
                Fresh Treats Made with Love
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Discover our handcrafted collection of parfaits, pastries, chin-chin, and puff-puff. Each treat is made with the finest ingredients and prepared fresh daily to bring you pure joy in every bite.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setLocation('/shop')}
                  className="bg-primary hover:bg-primary/90 text-white btn-primary gap-2"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setLocation('/services')}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  Learn About Services
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <img
                  src={PARFAIT_IMAGE}
                  alt="Fresh Parfait"
                  className="w-full h-auto rounded-lg object-cover" style={{ boxShadow: '0 12px 24px rgba(44, 44, 44, 0.12)' }}
                />
                <div className="absolute -bottom-6 -left-6 bg-accent text-white p-4 rounded-lg max-w-xs" style={{ boxShadow: '0 12px 24px rgba(44, 44, 44, 0.12)' }}>
                  <p className="font-semibold mb-1">100% Fresh Daily</p>
                  <p className="text-sm">Made with premium ingredients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Time Offers */}
      <LimitedTimeOffers />

      {/* Trust Signals */}
      <section className="py-12 bg-white border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <Leaf className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Premium Ingredients</h3>
                <p className="text-sm text-muted-foreground">
                  We source only the finest, freshest ingredients for every product.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">
                  Every treat is prepared in our hygienic, certified kitchen.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Sparkles className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Handcrafted Daily</h3>
                <p className="text-sm text-muted-foreground">
                  Made fresh each day with care and attention to detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-heading mb-4 text-foreground">Customer Favorites</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our best-selling treats loved by thousands of happy customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {bestSellers.slice(0, 4).map((product, index) => (
              <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setLocation('/shop')}
              className="bg-primary hover:bg-primary/90 text-white btn-primary gap-2"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-heading mb-4 text-foreground">What Customers Say</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Real reviews from real customers who love Peaceful Taste
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Chioma Okafor',
                location: 'Lagos',
                text: 'The Berry Bliss Parfait is absolutely delicious! Fresh ingredients and perfect portions. I order every week now!',
                rating: 5,
              },
              {
                name: 'Tunde Adeyemi',
                location: 'Ibadan',
                text: 'Best puff-puff I\'ve ever had! Fluffy, fresh, and delivered quickly. Highly recommended for parties.',
                rating: 5,
              },
              {
                name: 'Zainab Hassan',
                location: 'Abuja',
                text: 'The croissants are so buttery and flaky. Perfect for my morning breakfast. Quality is top-notch!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-primary text-lg">
                      ?
                    </span>
                  ))}
                </div>
                <p className="text-card-foreground mb-4 leading-relaxed font-medium">{testimonial.text}</p>
                <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                <p className="text-sm text-card-foreground/60">{testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-heading mb-6 text-foreground">Special Services</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Beyond our regular menu, we offer custom catering and bulk orders for your special events and celebrations.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Event Catering & Snack Platters',
                  'Bulk Orders for Businesses',
                  'Custom Dessert Packages',
                  'Corporate Gifting',
                ].map((service, index) => (
                  <li key={index} className="flex gap-3 items-center">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-foreground">{service}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => setLocation('/services')}
                className="bg-primary hover:bg-primary/90 text-white btn-primary gap-2"
              >
                Request a Quote <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="bg-gradient-to-br from-secondary to-background p-8 rounded-lg">
              <div className="aspect-square bg-background rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-foreground font-semibold">Custom Orders Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* CTA Banner */}
      <section className="py-12 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-heading mb-4">Ready to Order?</h2>
          <p className="text-lg mb-6 opacity-90">
            Browse our full collection and place your order today. Fresh treats delivered to your door. Get 10% discount on orders of 6+ items!
          </p>
          <Button
            onClick={() => setLocation('/shop')}
            className="bg-white hover:bg-white/90 text-primary font-semibold btn-primary gap-2"
          >
            Shop Now <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

