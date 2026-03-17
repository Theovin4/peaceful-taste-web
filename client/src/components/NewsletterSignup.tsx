import { Mail, Heart } from 'lucide-react';
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
      // Simulate newsletter signup (in production, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Thanks for subscribing! Check your email for exclusive offers.');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Join Our Community
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe to our newsletter for exclusive offers, new product launches, and special promotions delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-semibold whitespace-nowrap"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="font-semibold text-foreground mb-1">Exclusive Deals</h3>
              <p className="text-sm text-muted-foreground">
                Get subscriber-only discounts and early access to new products
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-semibold text-foreground mb-1">Weekly Updates</h3>
              <p className="text-sm text-muted-foreground">
                Stay informed about our latest treats and special offers
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold text-foreground mb-1">VIP Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Earn points with every purchase and redeem for rewards
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
