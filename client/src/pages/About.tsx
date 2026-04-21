import { Check, Package2 } from 'lucide-react';
import ProductVisual from '@/components/ProductVisual';
import { defaultProducts } from '@/lib/products';

const yoghurtShowcaseProduct =
  defaultProducts.find((product) => product.id === 'yoghurt-1') ?? defaultProducts[0];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,169,109,0.1),transparent_24%),radial-gradient(circle_at_left,rgba(63,107,34,0.18),transparent_28%)]" />
        <div className="container relative">
          <p className="mb-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            About Peaceful Taste
          </p>
          <h1 className="text-display mb-4 text-foreground">Built around comfort, quality, and trust</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Our story, our standards, and why customers keep returning for fresh handcrafted treats.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <div className="glass-panel mb-12 rounded-3xl p-8">
            <h2 className="text-heading mb-6 text-foreground">Our Story</h2>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              Peaceful Taste began with a simple passion: creating handcrafted treats that bring joy to everyday moments. What started as a small kitchen experiment has grown into a trusted brand for parfaits, pastries, drinks, and special-event orders.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              We believe food is more than sustenance. It is memory, comfort, celebration, and care. Every parfait, pastry, chin-chin, and puff-puff is prepared with intention and made to leave a strong impression.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Whether you are ordering for yourself, your family, or a full event, Peaceful Taste is built to make the experience feel warm, premium, and dependable.
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="mb-4 text-xl font-semibold text-foreground">Our Mission</h3>
              <p className="leading-relaxed text-muted-foreground">
                To create exceptional handcrafted treats that bring joy, comfort, and peaceful moments through premium ingredients, careful preparation, and thoughtful service.
              </p>
            </div>
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="mb-4 text-xl font-semibold text-foreground">Our Vision</h3>
              <p className="leading-relaxed text-muted-foreground">
                To become the trusted choice for artisanal treats and event-ready food experiences, known for consistency, taste, and customer care.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-heading mb-8 text-foreground">Our Core Values</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                ['Quality First', 'We do not compromise on ingredients, handling, or presentation.'],
                ['Authenticity', 'We respect familiar flavors while improving the overall experience.'],
                ['Customer Care', 'Clear communication and dependable delivery matter as much as taste.'],
                ['Consistency', 'We aim for every returning order to feel just as good as the last one.'],
                ['Transparency', 'We keep pricing, preparation, and communication straightforward.'],
                ['Community', 'We serve people, celebrations, and everyday family moments with heart.'],
              ].map(([title, description]) => (
                <div key={title} className="flex items-start gap-4">
                  <Check className="mt-1 h-6 w-6 flex-shrink-0 text-accent" />
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="glass-panel rounded-3xl p-8">
              <div className="mb-4 flex items-center gap-3">
                <Package2 className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Packaging Direction</h2>
              </div>
              <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                We are building a more premium branded packaging system that keeps every bottle, snack pack, and food tray visually consistent with the Peaceful Taste identity.
              </p>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="font-semibold text-foreground">First live concept</p>
                  <p className="mt-2">Plain Sweetened Yoghurt 35cl bottle label with cream, deep green, and refined premium catering branding.</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="font-semibold text-foreground">Design goals</p>
                  <p className="mt-2">Stronger shelf appeal, clearer product naming, premium brand recall, and better consistency across drinks, snacks, and food packaging.</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="font-semibold text-foreground">Print direction</p>
                  <p className="mt-2">Matte waterproof label finish, high-contrast typography, and a clean layout that stays readable on Nigerian takeaway packaging.</p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-8">
              <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Featured bottle label
              </p>
              <div className="overflow-hidden rounded-3xl border border-border bg-background/60">
                <ProductVisual
                  product={yoghurtShowcaseProduct}
                  variant="hero"
                  className="h-[360px] min-h-0 rounded-none border-0"
                />
              </div>
              <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Current focus</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Plain Sweetened Yoghurt 35cl is the first product in the refreshed branded packaging rollout now reflected on the site.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 text-center">
            <h2 className="text-heading mb-4 text-foreground">Why customers choose us</h2>
            <p className="mx-auto max-w-3xl text-muted-foreground">
              Fresh daily production, stronger visual presentation, event support, and a smoother order flow all come together to make Peaceful Taste feel more premium from the first click to delivery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
