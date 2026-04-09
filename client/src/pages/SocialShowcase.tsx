import { Instagram, Music, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function SocialShowcase() {
  const [, setLocation] = useLocation();

  // Sample Instagram posts (in production, these would be fetched from Instagram API)
  const instagramPosts = [
    {
      id: 1,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-1_a50b4f59.jpg',
      caption: '🍓 Berry Bliss Parfait - Fresh berries, creamy yogurt, and crunchy granola. Pure perfection! #PeacefulTaste #FreshTreats',
      likes: 234,
      comments: 18,
    },
    {
      id: 2,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-1_382c7e60.jpg',
      caption: '🥐 Butter Croissants - Flaky, golden, and absolutely delicious. Made fresh daily! #Pastries #Lagos',
      likes: 312,
      comments: 25,
    },
    {
      id: 3,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-1_c9f8e7d2.jpg',
      caption: '✨ Classic Chin-Chin - Crispy, crunchy, and addictive. Your favorite snack! #ChinChin #NigerianFood',
      likes: 456,
      comments: 42,
    },
    {
      id: 4,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-1_d6253cfb.jpg',
      caption: '🍪 Puff-Puff Perfection - Soft inside, golden outside. The ultimate comfort food! #PuffPuff #Treats',
      likes: 389,
      comments: 31,
    },
  ];

  // Sample TikTok videos
  const tiktokVideos = [
    {
      id: 1,
      title: 'Making Parfaits',
      description: 'Watch us layer the perfect parfait! 🍓',
      views: '12.5K',
      likes: '2.3K',
    },
    {
      id: 2,
      title: 'Croissant Baking',
      description: 'Golden, flaky croissants fresh from the oven 🥐',
      views: '8.9K',
      likes: '1.8K',
    },
    {
      id: 3,
      title: 'Chin-Chin Making',
      description: 'The satisfying crunch of fresh chin-chin ✨',
      views: '15.2K',
      likes: '3.1K',
    },
    {
      id: 4,
      title: 'Puff-Puff Frying',
      description: 'Watching these puff-puffs fry is so satisfying! 🍪',
      views: '18.7K',
      likes: '4.2K',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 bg-secondary border-b border-border">
        <div className="container">
          <h1 className="text-display text-foreground mb-4">Follow Us on Social Media</h1>
          <p className="text-lg text-muted-foreground">
            Join our community and see behind-the-scenes content, customer reviews, and daily specials
          </p>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-12 bg-black border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <a
              href="https://instagram.com/peacefultaste"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg p-8 text-white text-center hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Instagram className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Instagram</h3>
              <p className="text-sm mb-4">@peacefultaste</p>
              <Button className="bg-white text-pink-600 hover:bg-white/90 font-semibold w-full">
                Follow Us
              </Button>
            </a>

            <a
              href="https://facebook.com/peacefultaste"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-8 text-white text-center hover:shadow-lg transition-all transform hover:scale-105"
            >
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Facebook</h3>
              <p className="text-sm mb-4">Peaceful Taste</p>
              <Button className="bg-white text-blue-600 hover:bg-white/90 font-semibold w-full">
                Follow Us
              </Button>
            </a>

            <a
              href="https://wa.me/2349022621323"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-8 text-white text-center hover:shadow-lg transition-all transform hover:scale-105"
            >
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">WhatsApp</h3>
              <p className="text-sm mb-4">+234 902 262 1323</p>
              <Button className="bg-white text-green-600 hover:bg-white/90 font-semibold w-full">
                Chat Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center gap-3 mb-12">
            <Instagram className="w-8 h-8 text-pink-600" />
            <h2 className="text-4xl font-serif text-foreground">Latest on Instagram</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instagramPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-secondary h-64">
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.caption}
                  </p>

                  {/* Engagement */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold">
                View All on Instagram
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* TikTok Feed */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="flex items-center gap-3 mb-12">
            <Music className="w-8 h-8 text-black" />
            <h2 className="text-4xl font-serif text-foreground">Trending on TikTok</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiktokVideos.map((video) => (
              <div
                key={video.id}
                className="bg-black rounded-lg overflow-hidden border border-gray-800 hover:shadow-lg transition-all"
              >
                {/* Video Placeholder */}
                <div className="relative overflow-hidden bg-gray-900 h-64 flex items-center justify-center">
                  <Music className="w-16 h-16 text-gray-700" />
                </div>

                {/* Content */}
                <div className="p-4 text-white">
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{video.description}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-800 pt-4">
                    <div className="flex items-center gap-2">
                      <span>👁️ {video.views}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{video.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-black hover:bg-gray-900 text-white font-semibold">
                View All on TikTok
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* User Generated Content CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container max-w-2xl mx-auto text-center">
          <Share2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-serif text-foreground mb-4">
            Tag Us in Your Posts!
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Share your Peaceful Taste experience on Instagram or TikTok and tag us @peacefultaste. We'll feature the best posts on our page and you might win exclusive discounts!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation('/shop')}
              className="bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              Shop Now & Create Content
            </Button>
            <a
              href="https://wa.me/2349022621323"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 font-semibold w-full"
              >
                Contact Us on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
