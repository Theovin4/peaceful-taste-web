import { Instagram, Music, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function SocialShowcase() {
  const [, setLocation] = useLocation();
  const socialLinks: Array<{
    title: string;
    subtitle: string;
    href: string;
    gradient: string;
    icon: typeof Instagram;
  }> = [
    { title: 'Instagram', subtitle: '@peacefultaste', href: 'https://instagram.com/peacefultaste', gradient: 'from-pink-500 to-orange-500', icon: Instagram },
    { title: 'Facebook', subtitle: 'Peaceful Taste', href: 'https://facebook.com/peacefultaste', gradient: 'from-blue-500 to-blue-700', icon: MessageCircle },
    { title: 'WhatsApp', subtitle: '+234 902 262 1323', href: 'https://wa.me/2349022621323', gradient: 'from-emerald-500 to-green-600', icon: MessageCircle },
  ];

  const instagramPosts = [
    {
      id: 1,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-1_a50b4f59.jpg',
      caption: 'Berry Bliss Parfait layered fresh for the perfect chilled dessert moment.',
      likes: 234,
      comments: 18,
    },
    {
      id: 2,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-1_382c7e60.jpg',
      caption: 'Golden pastry details that look as good as they taste.',
      likes: 312,
      comments: 25,
    },
    {
      id: 3,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-1_c9f8e7d2.jpg',
      caption: 'Classic chin-chin with the crunch and finish customers love.',
      likes: 456,
      comments: 42,
    },
    {
      id: 4,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-1_d6253cfb.jpg',
      caption: 'Soft inside, golden outside, and built for sharing.',
      likes: 389,
      comments: 31,
    },
  ];

  const tiktokVideos = [
    { id: 1, title: 'Making Parfaits', description: 'Layering the parfait cups from base to topping.', views: '12.5K', likes: '2.3K' },
    { id: 2, title: 'Croissant Baking', description: 'Fresh pastries leaving the oven at the right moment.', views: '8.9K', likes: '1.8K' },
    { id: 3, title: 'Chin-Chin Making', description: 'Crunch-focused prep that customers always ask about.', views: '15.2K', likes: '3.1K' },
    { id: 4, title: 'Puff-Puff Frying', description: 'Golden puff-puff batches in motion.', views: '18.7K', likes: '4.2K' },
  ];

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
            See behind-the-scenes content, customer reactions, and the products people are posting most.
          </p>
        </div>
      </section>

      <section className="border-b border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {socialLinks.map(({ title, subtitle, href, gradient, icon: SocialIcon }) => {
              return (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-3xl bg-gradient-to-br ${gradient} p-8 text-center text-white shadow-soft transition-all hover:-translate-y-1`}
                >
                  <SocialIcon className="mx-auto mb-4 h-12 w-12" />
                  <h2 className="mb-2 text-2xl font-bold">{title}</h2>
                  <p className="mb-4 text-sm opacity-90">{subtitle}</p>
                  <Button className="w-full bg-white font-semibold text-slate-900 hover:bg-white/90">
                    Follow
                  </Button>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 flex items-center gap-3">
            <Instagram className="h-8 w-8 text-accent" />
            <h2 className="text-4xl font-serif text-foreground">Latest on Instagram</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {instagramPosts.map((post) => (
              <div key={post.id} className="glass-panel overflow-hidden rounded-3xl">
                <div className="h-64 overflow-hidden bg-secondary">
                  <img src={post.image} alt={post.caption} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                </div>
                <div className="p-4">
                  <p className="mb-4 text-sm text-muted-foreground">{post.caption}</p>
                  <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
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
          <div className="mb-12 flex items-center gap-3">
            <Music className="h-8 w-8 text-accent" />
            <h2 className="text-4xl font-serif text-foreground">Trending on TikTok</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tiktokVideos.map((video) => (
              <div key={video.id} className="glass-panel overflow-hidden rounded-3xl">
                <div className="flex h-64 items-center justify-center bg-[#0d1215]">
                  <Music className="h-16 w-16 text-muted" />
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
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="glass-panel rounded-3xl px-8 py-12 text-center">
            <Share2 className="mx-auto mb-4 h-12 w-12 text-accent" />
            <h2 className="text-4xl font-serif text-foreground mb-4">Tag us in your posts</h2>
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
