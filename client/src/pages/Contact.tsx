import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import PageMeta from '@/components/PageMeta';

const CONTACT_INFO = {
  phone: '+234 902 262 1323',
  whatsapp: '2349022621323',
  email: 'queenofpeace323@gmail.com',
  address: 'Gasline, Magboro, Lagos-Ibadan Expressway, Lagos State, Nigeria',
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general' as const,
  });
  const [isLoading, setIsLoading] = useState(false);

  const submitInquiryMutation = trpc.inquiries.createInquiry.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      await submitInquiryMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        inquiryType: formData.inquiryType,
      });

      toast.success("Message sent. We'll get back to you soon.");
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=Hi%20Peaceful%20Taste`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Contact Peaceful Taste"
        description="Contact Peaceful Taste by WhatsApp, phone, or email for delivery support, quick orders, bulk requests, or catering inquiries."
        path="/contact"
      />
      <section className="relative overflow-hidden border-b border-border py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,169,109,0.12),transparent_24%),radial-gradient(circle_at_left,rgba(63,107,34,0.18),transparent_28%)]" />
        <div className="container relative">
          <p className="mb-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Contact Peaceful Taste
          </p>
          <h1 className="text-display mb-4 text-foreground">Let’s plan your next order</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Reach out for custom orders, delivery support, quick questions, or event inquiries.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="glass-panel rounded-3xl p-6">
              <Phone className="mb-4 h-8 w-8 text-accent" />
              <h2 className="mb-2 font-semibold text-foreground">Phone</h2>
              <p className="mb-4 text-muted-foreground">{CONTACT_INFO.phone}</p>
              <a href={`tel:${CONTACT_INFO.phone}`} className="font-semibold text-accent transition-all hover:opacity-80">
                Call now
              </a>
            </div>

            <div className="glass-panel rounded-3xl p-6">
              <MessageCircle className="mb-4 h-8 w-8 text-emerald-400" />
              <h2 className="mb-2 font-semibold text-foreground">WhatsApp</h2>
              <p className="mb-4 text-muted-foreground">Fastest response for urgent orders and delivery questions.</p>
              <button
                onClick={handleWhatsApp}
                className="rounded-2xl bg-emerald-500 px-4 py-2 font-semibold text-white transition-all hover:bg-emerald-400"
              >
                WhatsApp Chat
              </button>
            </div>

            <div className="glass-panel rounded-3xl p-6">
              <Mail className="mb-4 h-8 w-8 text-accent" />
              <h2 className="mb-2 font-semibold text-foreground">Email</h2>
              <p className="mb-4 text-muted-foreground">{CONTACT_INFO.email}</p>
              <a href={`mailto:${CONTACT_INFO.email}`} className="font-semibold text-accent transition-all hover:opacity-80">
                Email us
              </a>
            </div>
          </div>

          <div className="glass-panel mb-16 rounded-3xl p-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-accent" />
              <div>
                <h2 className="mb-2 font-semibold text-foreground">Location</h2>
                <p className="text-muted-foreground">{CONTACT_INFO.address}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground">Send us a message</h2>
              <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-semibold">Full Name *</Label>
                    <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Your name" required className="mt-2 bg-background" />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-foreground font-semibold">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" required className="mt-2 bg-background" />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-foreground font-semibold">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+234 901 234 5678" className="mt-2 bg-background" />
                  </div>

                  <div>
                    <Label htmlFor="inquiryType" className="text-foreground font-semibold">Inquiry Type</Label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="catering">Catering Request</option>
                      <option value="bulk_order">Bulk Order</option>
                      <option value="complaint">Complaint</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-foreground font-semibold">Subject</Label>
                    <Input id="subject" name="subject" type="text" value={formData.subject} onChange={handleInputChange} placeholder="What is this about?" className="mt-2 bg-background" />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-foreground font-semibold">Message *</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more..."
                      required
                      rows={5}
                      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground"
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="btn-primary w-full text-white">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground">Quick contact</h2>
              <div className="space-y-4">
                <div className="glass-panel rounded-3xl p-6">
                  <h3 className="mb-2 font-bold text-foreground">WhatsApp first</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    For urgent order support or quick replies, WhatsApp is usually the fastest channel.
                  </p>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-400"
                  >
                    Open WhatsApp
                  </button>
                </div>

                <div className="glass-panel rounded-3xl p-6">
                  <h3 className="mb-2 font-bold text-foreground">Email</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    For detailed inquiries, documents, or order records, use email.
                  </p>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="block rounded-2xl bg-accent px-4 py-3 text-center font-semibold text-accent-foreground transition-all hover:opacity-90"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>

                <div className="glass-panel rounded-3xl p-6">
                  <h3 className="mb-3 font-bold text-foreground">Business Hours</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
