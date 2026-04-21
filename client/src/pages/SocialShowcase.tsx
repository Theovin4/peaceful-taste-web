import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useCatalog } from '@/hooks/useCatalog';
import ProductVisual from '@/components/ProductVisual';

function BrandIcon({ brand, className = 'h-12 w-12' }: { brand: 'instagram' | 'facebook' | 'whatsapp' | 'tiktok'; className?: string }) {
  const paths = {
    instagram: 'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.5.5.7.3 1.3.6 1.9 1.2.5.5.9 1.1 1.2 1.9.2.6.5 1.3.5 2.5.1 1.2.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.5 2.5-.3.7-.6 1.3-1.2 1.9-.5.5-1.1.9-1.9 1.2-.6.2-1.3.5-2.5.5-1.2.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.5-.5-.7-.3-1.3-.6-1.9-1.2-.5-.5-.9-1.1-1.2-1.9-.2-.6-.5-1.3-.5-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-2 .5-2.5.3-.7.6-1.3 1.2-1.9.5-.5 1.1-.9 1.9-1.2.6-.2 1.3-.5 2.5-.5C8.4 2.2 8.8 2.2 12 2.2Zm0 1.9c-3.1 0-3.4 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.5-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7 0 3.1 0 3.4.1 4.7.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.5.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1 3.1 0 3.4 0 4.7-.1 1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.5.3-1 .4-2.1.1-1.2.1-1.6.1-4.7 0-3.1 0-3.4-.1-4.7-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.5-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3.2A4.7 4.7 0 1 1 7.3 12 4.7 4.7 0 0 1 12 7.3Zm0 7.5A2.8 2.8 0 1 0 9.2 12a2.8 2.8 0 0 0 2.8 2.8Zm6-8.9a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z',
    facebook: 'M13.5 21v-7h2.3l.3-2.7h-2.6V9.6c0-.8.2-1.3 1.4-1.3H16V5.9c-.2 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.3v1.8H9v2.7h2.1v7h2.4Z',
    whatsapp: 'M20.5 3.5A11 11 0 0 0 3.4 16.8L2 22l5.4-1.4a11 11 0 1 0 13.1-17.1Zm-8.6 17.6a9 9 0 0 1-4.6-1.3l-.3-.2-3.2.8.9-3.1-.2-.3a9 9 0 1 1 7.4 4.1Zm5-6.8c-.3-.2-1.6-.8-1.8-.9-.2-.1-.4-.2-.6.2s-.7.9-.8 1c-.1.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.4.3-.5c.1-.2.1-.4 0-.5 0-.1-.6-1.4-.9-1.9-.2-.5-.5-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-.9 2.3 0 1.4 1 2.7 1.2 2.9.2.2 2 3.2 4.9 4.3.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.8-1.4.2-.7.2-1.2.2-1.3s-.2-.2-.5-.4Z',
    tiktok: 'M14.8 3c.2 1.3.9 2.5 1.9 3.4 1 .8 2.2 1.3 3.5 1.4v2.7a8.3 8.3 0 0 1-3.9-1v5.4a5 5 0 1 1-5-5c.3 0 .6 0 .9.1v2.8a2.6 2.6 0 1 0 1.7 2.5V3h2.9Z',
  } as const;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d={paths[brand]} />
    </svg>
  );
}

export default function SocialShowcase() {
  const [, setLocation] = useLocation();
  const { products } = useCatalog();
  const socialLinks = [
    { title: 'Instagram', subtitle: '@peacefultaste', href: 'https://instagram.com/peacefultaste', gradient: 'from-pink-500 to-orange-500', brand: 'instagram' as const },
    { title: 'Facebook', subtitle: 'Peaceful Taste', href: 'https://facebook.com/peacefultaste', gradient: 'from-blue-500 to-blue-700', brand: 'facebook' as const },
    { title: 'TikTok', subtitle: '@peacefultaste_', href: 'https://tiktok.com/@peacefultaste_', gradient: 'from-slate-900 to-slate-700', brand: 'tiktok' as const },
    { title: 'WhatsApp', subtitle: '+234 902 262 1323', href: 'https://wa.me/2349022621323', gradient: 'from-emerald-500 to-green-600', brand: 'whatsapp' as const },
  ];

  const socialProducts = products.slice(0, 8);
  const tiktokStories = products.slice(0, 4).map((product, index) => ({
    id: product.id,
    title: product.name,
    description: `Short-form feature ${index + 1} focused on ${product.name.toLowerCase()} and how it is prepared or served.`,
    views: `${10 + index * 3}.2K`,
    likes: `${1.4 + index * 0.8}K`,
  }));

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,169,109,0.12),transparent_24%),radial-gradient(circle_at_left,rgba(63,107,34,0.18),transparent_28%)]" />
        <div className="container relative">
          <p className="mb-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Social proof
          </p>
          <h1 className="text-display mb-4 text-foreground">Follow Peaceful Taste on social media</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            See real Peaceful Taste products, behind-the-scenes moments, and short-form content built from your active catalog.
          </p>
        </div>
      </section>

      <section className="border-b border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {socialLinks.map(({ title, subtitle, href, gradient, brand }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-3xl bg-gradient-to-br ${gradient} p-8 text-center text-white shadow-soft transition-all hover:-translate-y-1`}
              >
                <BrandIcon brand={brand} className="mx-auto mb-4 h-12 w-12" />
                <h2 className="mb-2 text-2xl font-bold">{title}</h2>
                <p className="mb-4 text-sm opacity-90">{subtitle}</p>
                <Button className="w-full bg-white font-semibold text-slate-900 hover:bg-white/90">Follow</Button>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 flex items-center gap-3 text-foreground">
            <BrandIcon brand="instagram" className="h-8 w-8 text-accent" />
            <h2 className="text-4xl font-serif">Latest Products on Instagram</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {socialProducts.map((product, index) => (
              <div key={product.id} className="glass-panel overflow-hidden rounded-3xl">
                <div className="h-64 overflow-hidden bg-secondary">
                  <ProductVisual product={product} className="h-full w-full rounded-none border-0" />
                </div>
                <div className="p-4">
                  <p className="mb-2 text-sm font-semibold text-foreground">{product.name}</p>
                  <p className="mb-4 text-sm text-muted-foreground">Freshly prepared for customers who want premium presentation and reliable delivery.</p>
                  <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        <span>{240 + index * 37}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{18 + index * 4}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 flex items-center gap-3 text-foreground">
            <BrandIcon brand="tiktok" className="h-8 w-8 text-accent" />
            <h2 className="text-4xl font-serif">Trending on TikTok</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tiktokStories.map((video) => {
              const product = products.find((item) => item.id === video.id) ?? products[0];
              if (!product) return null;

              return (
                <div key={video.id} className="glass-panel overflow-hidden rounded-3xl">
                  <div className="h-64 overflow-hidden bg-secondary">
                    <ProductVisual product={product} className="h-full w-full rounded-none border-0" />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 font-semibold text-foreground">{video.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{video.description}</p>
                    <div className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
                      <span>{video.views} views</span>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        <span>{video.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="glass-panel rounded-3xl px-8 py-12 text-center">
            <Share2 className="mx-auto mb-4 h-12 w-12 text-accent" />
            <h2 className="mb-4 text-4xl font-serif text-foreground">Tag us in your posts</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Share your Peaceful Taste experience and tag us online. Great customer posts may be featured and rewarded with special offers.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button onClick={() => setLocation('/shop')} className="btn-primary text-white">
                Shop Now
              </Button>
              <a href="https://wa.me/2349022621323" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-accent/40 bg-card/30 text-accent hover:bg-accent/10">
                  Contact on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
