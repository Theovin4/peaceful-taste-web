import { Share2, Gift, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReferralProgram() {
  const [copied, setCopied] = useState(false);

  // Generate unique referral code (in production, this would come from user data)
  const referralCode = 'PEACE' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://peaceful-taste.com?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = `🎉 Join me at Peaceful Taste for fresh, delicious treats! Use my referral code ${referralCode} to get ₦500 credit on your first order. https://peaceful-taste.com?ref=${referralCode}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareSocial = (platform: string) => {
    const message = `🎉 Discover Peaceful Taste - fresh parfaits, pastries, chin-chin & puff-puff! Use my code ${referralCode} for ₦500 off. ${referralLink}`;
    
    if (platform === 'instagram') {
      toast.info('Share this link on your Instagram story: ' + referralLink);
    } else if (platform === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
      window.open(facebookUrl, '_blank');
    } else if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Gift className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              Earn Rewards with Friends
            </h2>
            <p className="text-lg text-muted-foreground">
              Share your unique referral code and earn ₦500 credit for every friend who makes their first purchase
            </p>
          </div>

          {/* Main Referral Card */}
          <div className="bg-white rounded-xl border border-border p-8 mb-8" style={{ boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Your Code */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Your Referral Code</h3>
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border-2 border-primary/20 mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Share this code</p>
                  <p className="text-3xl font-bold text-primary font-mono">{referralCode}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Your friends get ₦500 off their first order, and you earn ₦500 credit!
                </p>
                <Button
                  onClick={handleCopyLink}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                >
                  {copied ? '✓ Copied!' : 'Copy Referral Link'}
                </Button>
              </div>

              {/* Right: Share Options */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Share With Friends</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleShareWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share on WhatsApp
                  </Button>
                  <Button
                    onClick={() => handleShareSocial('facebook')}
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share on Facebook
                  </Button>
                  <Button
                    onClick={() => handleShareSocial('twitter')}
                    variant="outline"
                    className="w-full border-sky-600 text-sky-600 hover:bg-sky-50 font-semibold flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share on Twitter
                  </Button>
                  <Button
                    onClick={() => handleShareSocial('instagram')}
                    variant="outline"
                    className="w-full border-pink-600 text-pink-600 hover:bg-pink-50 font-semibold flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share on Instagram
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-border p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Share Your Code</h4>
              <p className="text-sm text-muted-foreground">
                Copy and share your unique referral code with friends via WhatsApp, social media, or email
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
              </div>
              <h4 className="font-semibold text-foreground mb-2">They Order</h4>
              <p className="text-sm text-muted-foreground">
                Your friend uses your code at checkout to get ₦500 off their first order
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
              </div>
              <h4 className="font-semibold text-foreground mb-2">You Earn</h4>
              <p className="text-sm text-muted-foreground">
                You get ₦500 credit added to your account for every successful referral
              </p>
            </div>
          </div>

          {/* Rewards Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-border p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">0</p>
              <p className="text-sm text-muted-foreground">Friends Referred</p>
            </div>
            <div className="bg-white rounded-lg border border-border p-6 text-center">
              <Gift className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">₦0</p>
              <p className="text-sm text-muted-foreground">Credits Earned</p>
            </div>
            <div className="bg-white rounded-lg border border-border p-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">∞</p>
              <p className="text-sm text-muted-foreground">No Limit</p>
            </div>
            <div className="bg-white rounded-lg border border-border p-6 text-center">
              <Share2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">Easy</p>
              <p className="text-sm text-muted-foreground">To Share</p>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              * Credits are awarded after your friend completes their first purchase. Credits can be used on future orders.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
