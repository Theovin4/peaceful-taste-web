import { useEffect, useState } from 'react';
import { Instagram, Heart, MessageCircle, Loader2 } from 'lucide-react';

interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In production, fetch from Instagram API
    // For now, use demo posts
    const demoPosts: InstagramPost[] = [
      {
        id: '1',
        caption: '🍓 Berry Bliss Parfait - Fresh berries, creamy yogurt, and crunchy granola. Pure perfection! #PeacefulTaste #FreshTreats',
        media_type: 'IMAGE',
        media_url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-1_a50b4f59.jpg',
        permalink: 'https://instagram.com/p/1',
        timestamp: new Date().toISOString(),
        like_count: 234,
        comments_count: 18,
      },
      {
        id: '2',
        caption: '🥐 Butter Croissants - Flaky, golden, and absolutely delicious. Made fresh daily! #Pastries #Lagos',
        media_type: 'IMAGE',
        media_url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-1_382c7e60.jpg',
        permalink: 'https://instagram.com/p/2',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        like_count: 312,
        comments_count: 25,
      },
      {
        id: '3',
        caption: '✨ Classic Chin-Chin - Crispy, crunchy, and addictive. Your favorite snack! #ChinChin #NigerianFood',
        media_type: 'IMAGE',
        media_url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-1_c9f8e7d2.jpg',
        permalink: 'https://instagram.com/p/3',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        like_count: 456,
        comments_count: 42,
      },
      {
        id: '4',
        caption: '🍪 Puff-Puff Perfection - Soft inside, golden outside. The ultimate comfort food! #PuffPuff #Treats',
        media_type: 'IMAGE',
        media_url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-1_d6253cfb.jpg',
        permalink: 'https://instagram.com/p/4',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        like_count: 389,
        comments_count: 31,
      },
    ];

    setPosts(demoPosts);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Instagram className="w-8 h-8 text-pink-600" />
        <h2 className="text-3xl font-serif text-foreground">Latest on Instagram</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all group"
          >
            {/* Image */}
            <div className="relative overflow-hidden bg-secondary h-64">
              <img
                src={post.media_url}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {post.media_type === 'VIDEO' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-8 border-l-transparent border-r-0 border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1" />
                  </div>
                </div>
              )}
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
                  <span>{post.like_count || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count || 0}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <a
          href="https://instagram.com/peacefultaste"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Follow @peacefultaste on Instagram
        </a>
      </div>
    </div>
  );
}
