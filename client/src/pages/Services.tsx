import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Users, Gift, Utensils, Zap } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function Services() {
  const submitInquiryMutation = trpc.inquiries.createInquiry.useMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    date: '',
    message: '',
  });

  const services = [
    {
      icon: Users,
      title: 'Event Catering',
      description: 'Birthday spreads, weddings, office trays, and celebration menus designed around your guest count and budget.',
    },
    {
      icon: Gift,
      title: 'Bulk Orders',
      description: 'Structured pricing for businesses, schools, and community orders that need dependable volume and timing.',
    },
    {
      icon: Utensils,
      title: 'Custom Dessert Packages',
      description: 'Mix parfaits, pastries, cakes, and drinks into a custom package that feels made for the occasion.',
    },
    {
      icon: Zap,
      title: 'Rush Orders',
      description: 'Fast-turnaround requests for urgent delivery windows, subject to kitchen schedule and product availability.',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.eventType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await submitInquiryMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Quote request: ${formData.eventType}`,
        message: [
          `Event type: ${formData.eventType}`,
          formData.guestCount ? `Guest count: ${formData.guestCount}` : null,
          formData.date ? `Preferred date: ${formData.date}` : null,
          formData.message ? `Notes: ${formData.message}` : null,
        ]
          .filter(Boolean)
          .join('\n'),
        inquiryType: formData.eventType === 'bulk' ? 'bulk_order' : 'catering',
      });

      toast.success("Quote request submitted. We'll contact you within 24 hours.");
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        guestCount: '',
        date: '',
        message: '',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'We could not submit your quote request right now.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,169,109,0.12),transparent_24%),radial-gradient(circle_at_left,rgba(63,107,34,0.18),transparent_28%)]" />
        <div className="container relative">
          <p className="mb-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Special services
          </p>
          <h1 className="text-display mb-4 text-foreground">Orders beyond the regular menu</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Catering, bulk trays, custom dessert packages, and faster turnaround requests tailored to your event.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="glass-panel rounded-3xl p-8"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <Icon className="mb-4 h-12 w-12 text-accent" />
                  <h2 className="mb-3 text-xl font-semibold text-card-foreground">{service.title}</h2>
                  <p className="leading-relaxed text-muted-foreground">{service.description}</p>
                </div>
              );
            })}
          </div>

          <div className="glass-panel mb-16 rounded-3xl px-8 py-10 text-center">
            <h2 className="text-heading mb-4 text-foreground">Need a quick answer?</h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              For immediate quotes or custom requests, contact Peaceful Taste directly through WhatsApp or phone and we will guide you fast.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://wa.me/2349022621323"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:opacity-90"
              >
                Chat on WhatsApp
              </a>
              <a
                href="tel:+2349022621323"
                className="rounded-2xl border border-accent/40 bg-card/40 px-6 py-3 font-semibold text-accent transition-all hover:bg-accent/10"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-heading mb-4 text-foreground">Request a Quote</h2>
            <p className="text-lg text-muted-foreground">
              Share the basics and we will respond with options, pricing, and the next step.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8">
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+234 901 234 5678"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="bulk">Bulk Order</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">Number of Guests</label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">Preferred Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-card-foreground">Additional Details</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell us more about your needs, quantities, flavors, or delivery window."
                rows={5}
              />
            </div>

            <Button type="submit" disabled={submitInquiryMutation.isPending} className="btn-primary w-full text-white">
              {submitInquiryMutation.isPending ? 'Sending Request...' : 'Submit Quote Request'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
