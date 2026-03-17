import { Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function LimitedTimeOffers() {
  const [, setLocation] = useLocation();

  // Get today's special (rotates daily)
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
    <section className="py-12 bg-gradient-to-r from-red-50 to-orange-50 border-y border-red-200">
      <div className="container">
        <div className="flex items-center justify-between flex-wrap gap-6">
          {/* Left: Offer Details */}
          <div className="flex-1 min-w-64">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-red-600" />
              <span className="text-sm font-bold text-red-600 uppercase tracking-wide">
                Today's Flash Deal
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {todaySpecial.name}
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">
                ₦{todaySpecial.specialPrice.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                ₦{todaySpecial.originalPrice.toLocaleString()}
              </span>
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                Save {todaySpecial.discount}%
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Limited time offer - Available while supplies last!
            </p>
            <div className="flex items-center gap-2 text-sm text-red-600 font-semibold mb-4">
              <Clock className="w-4 h-4" />
              <span>Offer ends at midnight</span>
            </div>
            <Button
              onClick={() => setLocation('/shop')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Shop Now
            </Button>
          </div>

          {/* Right: Product Image */}
          <div className="flex-1 min-w-64 flex justify-center">
            <div className="relative">
              <img
                src={todaySpecial.image}
                alt={todaySpecial.name}
                className="w-full max-w-xs h-auto rounded-lg object-cover"
                style={{
                  boxShadow: '0 12px 24px rgba(220, 38, 38, 0.2)',
                }}
              />
              <div className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-center">
                <div>
                  <div className="text-xs font-bold">SAVE</div>
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
