import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Users, Gift, Utensils, Zap } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function Services() {
  const [, setLocation] = useLocation();
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
      description: 'Perfect for birthdays, weddings, corporate events, and celebrations. We customize platters to match your theme.',
    },
    {
      icon: Gift,
      title: 'Bulk Orders',
      description: 'Wholesale pricing for businesses, schools, and organizations. Minimum order quantities apply.',
    },
    {
      icon: Utensils,
      title: 'Custom Dessert Packages',
      description: 'Create your own assortment. Mix and match our products to create the perfect package for your needs.',
    },
    {
      icon: Zap,
      title: 'Rush Orders',
      description: 'Need treats fast? We offer same-day and next-day delivery for qualified orders. Contact us for availability.',
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

      toast.success('Quote request submitted! We\'ll contact you within 24 hours.');
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
      {/* Header */}
      <section className="py-12 bg-secondary border-b border-border">
        <div className="container">
          <h1 className="text-display text-foreground mb-4">Special Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Beyond our regular menu, we offer custom catering, bulk orders, and special packages for your unique needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-card p-8 rounded-lg border border-border"
                  style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)', transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)', animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 24px rgba(44, 44, 44, 0.12)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 44, 44, 0.08)'}
                >
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">{service.title}</h3>
                  <p className="text-card-foreground/80 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Contact */}
          <div className="bg-primary text-white p-8 rounded-lg mb-16 text-center">
            <h2 className="text-heading mb-4">Quick Contact</h2>
            <p className="mb-6 opacity-90">
              For immediate inquiries, reach out to us directly via WhatsApp or phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/2349022621323"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-white/90 text-primary font-semibold px-6 py-3 rounded-lg" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                Chat on WhatsApp
              </a>
              <a
                href="tel:+2349022621323"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-lg border border-white/50" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Request Form */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-heading mb-4 text-foreground">Request a Quote</h2>
            <p className="text-lg text-muted-foreground">
              Tell us about your event or order, and we'll get back to you with a custom quote within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Event Type *
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Additional Details
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="Tell us more about your needs, preferences, or any special requests..."
                rows={5}
              />
            </div>

            <Button
              type="submit"
              disabled={submitInquiryMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold btn-primary"
            >
              {submitInquiryMutation.isPending ? 'Sending Request...' : 'Submit Quote Request'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
