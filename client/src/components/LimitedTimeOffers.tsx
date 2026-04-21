import { Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { formatNaira } from '@/lib/format';

export default function LimitedTimeOffers() {
  const [, setLocation] = useLocation();

  const todaysSpecials = [
    {
      id: 'special-1',
      name: 'Berry Bliss Parfait',
      originalPrice: 5300,
      specialPrice: 4250,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-1_a50b4f59.jpg',
      discount: 20,
    },
    {
      id: 'special-2',
      name: 'Butter Croissant',
      originalPrice: 2900,
      specialPrice: 2175,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-1_382c7e60.jpg',
      discount: 25,
    },
    {
      id: 'special-3',
      name: 'Classic Puff-Puff',
      originalPrice: 2300,
      specialPrice: 1725,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-1_d6253cfb.jpg',
      discount: 25,
    },
  ];

  const dayOfWeek = new Date().getDay();
  const todaySpecial = todaysSpecials[dayOfWeek % todaysSpecials.length];

  return (
    <section className="border-y border-border bg-[radial-gradient(circle_at_top_right,rgba(214,169,109,0.16),transparent_28%),linear-gradient(135deg,#141b20,#0f1419)] py-12">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="min-w-64 flex-1">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              <span className="text-sm font-bold uppercase tracking-wide text-red-400">
                Today's Flash Deal
              </span>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              {todaySpecial.name}
            </h3>
            <div className="mb-4 flex flex-wrap items-center gap-4 rounded-2xl border border-accent/30 bg-black/20 px-4 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.28)]">
              <span className="text-3xl font-black text-foreground">
                {formatNaira(todaySpecial.specialPrice)}
              </span>
              <span className="text-lg font-medium text-muted-foreground line-through">
                {formatNaira(todaySpecial.originalPrice)}
              </span>
              <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                Save {todaySpecial.discount}%
              </span>
            </div>
            <p className="mb-4 text-muted-foreground">
              Limited time offer. Available while supplies last.
            </p>
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-400">
              <Clock className="h-4 w-4" />
              <span>Offer ends at midnight</span>
            </div>
            <Button
              onClick={() => setLocation('/shop')}
              className="bg-red-600 font-bold text-white hover:bg-red-700"
            >
              Shop Now
            </Button>
          </div>

          <div className="flex min-w-64 flex-1 justify-center">
            <div className="relative">
              <img
                src={todaySpecial.image}
                alt={todaySpecial.name}
                className="h-auto w-full max-w-xs rounded-2xl object-cover"
                style={{ boxShadow: '0 18px 36px rgba(0, 0, 0, 0.35)' }}
              />
              <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-center text-white">
                <div>
                  <div className="text-[10px] font-bold">SAVE</div>
                  <div className="text-lg font-bold">{todaySpecial.discount}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
