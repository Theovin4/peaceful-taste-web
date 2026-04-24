import { Gift, Heart, Mail, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Thanks for subscribing! Check your email for exclusive offers.');
      setEmail('');
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary/5 to-accent/5 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex justify-center">
            <Heart className="h-8 w-8 text-primary" />
          </div>

          <h2 className="mb-4 font-serif text-4xl text-foreground md:text-5xl">
            Join Our Community
          </h2>

          <p className="mb-8 text-lg text-muted-foreground">
            Subscribe for exclusive offers, new product launches, and special promotions delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-border bg-white py-3 pl-12 pr-4 text-foreground transition-all placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="whitespace-nowrap bg-primary font-semibold text-white hover:bg-primary/90"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 flex justify-center text-primary">
                <Gift className="h-8 w-8" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">Exclusive Deals</h3>
              <p className="text-sm text-muted-foreground">
                Get subscriber-only discounts and early access to new products.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center text-primary">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">Weekly Updates</h3>
              <p className="text-sm text-muted-foreground">
                Stay informed about the latest treats and special offers.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center text-primary">
                <Star className="h-8 w-8 fill-current" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">VIP Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Earn loyalty perks with repeat purchases and seasonal campaigns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
