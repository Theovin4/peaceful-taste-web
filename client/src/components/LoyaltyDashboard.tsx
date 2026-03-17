import { Gift, TrendingUp, Zap, Award, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface LoyaltyData {
  totalPoints: number;
  tier: string;
  nextTierPoints: number;
  discountPercentage: number;
  totalSpent: number;
  recentTransactions: Array<{
    points: number;
    reason: string;
    date: string;
  }>;
}

// Demo loyalty data
const demoLoyaltyData: LoyaltyData = {
  totalPoints: 1250,
  tier: 'Silver',
  nextTierPoints: 250,
  discountPercentage: 5,
  totalSpent: 12500,
  recentTransactions: [
    { points: 500, reason: 'Purchase Order #PT001', date: '2 days ago' },
    { points: 250, reason: 'Referral Bonus', date: '1 week ago' },
    { points: 500, reason: 'Purchase Order #PT002', date: '2 weeks ago' },
  ],
};

export default function LoyaltyDashboard() {
  const [copied, setCopied] = useState(false);
  const data = demoLoyaltyData;

  const handleCopyCode = () => {
    navigator.clipboard.writeText('PEACE' + Math.random().toString(36).substring(2, 8).toUpperCase());
    setCopied(true);
    toast.success('Loyalty code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const tierColors = {
    Bronze: 'from-amber-100 to-amber-50',
    Silver: 'from-slate-100 to-slate-50',
    Gold: 'from-yellow-100 to-yellow-50',
    Platinum: 'from-purple-100 to-purple-50',
  };

  const tierBadgeColors = {
    Bronze: 'bg-amber-100 text-amber-800',
    Silver: 'bg-slate-100 text-slate-800',
    Gold: 'bg-yellow-100 text-yellow-800',
    Platinum: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif text-foreground mb-2">Your Loyalty Account</h1>
        <p className="text-lg text-muted-foreground">Earn points on every purchase and unlock exclusive rewards</p>
      </div>

      {/* Main Stats */}
      <div className={`bg-gradient-to-br ${tierColors[data.tier as keyof typeof tierColors]} rounded-xl border border-border p-8`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Points */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <p className="text-sm font-semibold text-muted-foreground">Total Points</p>
            </div>
            <p className="text-5xl font-bold text-foreground">{data.totalPoints}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {data.nextTierPoints} points to next tier
            </p>
          </div>

          {/* Tier */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-primary" />
              <p className="text-sm font-semibold text-muted-foreground">Current Tier</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-5xl font-bold text-foreground">{data.tier}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${tierBadgeColors[data.tier as keyof typeof tierBadgeColors]}`}>
                {data.discountPercentage}% OFF
              </span>
            </div>
          </div>

          {/* Spent */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <p className="text-sm font-semibold text-muted-foreground">Total Spent</p>
            </div>
            <p className="text-5xl font-bold text-foreground">₦{(data.totalSpent / 1000).toFixed(1)}k</p>
            <p className="text-sm text-muted-foreground mt-2">
              Lifetime value
            </p>
          </div>
        </div>
      </div>

      {/* Progress to Next Tier */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Progress to Gold</h3>
          <span className="text-sm font-semibold text-primary">{((data.totalPoints / (data.totalPoints + data.nextTierPoints)) * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all"
            style={{ width: `${(data.totalPoints / (data.totalPoints + data.nextTierPoints)) * 100}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Earn {data.nextTierPoints} more points to unlock Gold tier benefits
        </p>
      </div>

      {/* Tier Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Silver Tier Benefits
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">5% discount on all orders</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Free shipping on orders over ₦5,000</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Birthday bonus points</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Early access to sales</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-200 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Gold Tier Benefits
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span className="text-foreground font-semibold">10% discount on all orders</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span className="text-foreground font-semibold">Free shipping on all orders</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span className="text-foreground font-semibold">Birthday bonus + extra points</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span className="text-foreground font-semibold">Exclusive new product previews</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {data.recentTransactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-foreground">{transaction.reason}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
              <span className="text-lg font-bold text-primary">+{transaction.points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Redeem Points */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border-2 border-primary/20 p-8 text-center">
        <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-serif text-foreground mb-2">Ready to Redeem?</h3>
        <p className="text-muted-foreground mb-6">
          You have {data.totalPoints} points available. Redeem them for discounts on your next order!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleCopyCode}
            className="bg-primary hover:bg-primary/90 text-white font-semibold flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Get Discount Code
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5 font-semibold"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
