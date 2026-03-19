import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

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

      toast.success('Message sent! We\'ll get back to you soon.');
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
      {/* Header */}
      <section className="py-12 bg-secondary border-b border-border">
        <div className="container">
          <h1 className="text-display text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We'd love to hear from you. Reach out with any questions, feedback, or catering inquiries.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-lg p-6 border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
              <Phone className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Phone</h3>
              <p className="text-muted-foreground mb-4">{CONTACT_INFO.phone}</p>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="inline-block text-primary hover:text-primary/80 font-semibold"
              >
                Call Now →
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
              <MessageCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
              <p className="text-muted-foreground mb-4">Chat with us instantly</p>
              <button
                onClick={handleWhatsApp}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                💬 WhatsApp Chat
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
              <Mail className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground mb-4">{CONTACT_INFO.email}</p>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-block text-primary hover:text-primary/80 font-semibold"
              >
                Email Us →
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="bg-secondary rounded-lg p-6 mb-16 border border-border">
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Location</h3>
                <p className="text-muted-foreground">{CONTACT_INFO.address}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-foreground font-semibold">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground font-semibold">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-foreground font-semibold">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+234 901 234 5678"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="inquiryType" className="text-foreground font-semibold">
                    Inquiry Type
                  </Label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="catering">Catering Request</option>
                    <option value="bulk_order">Bulk Order</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-foreground font-semibold">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What is this about?"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-foreground font-semibold">
                    Message *
                  </Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more..."
                    required
                    rows={5}
                    className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Quick Contact */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Quick Contact</h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-green-900 mb-2">💬 Fastest Response</h3>
                  <p className="text-sm text-green-800 mb-4">
                    For urgent inquiries or quick responses, reach out via WhatsApp. We typically respond within minutes!
                  </p>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Open WhatsApp
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-blue-900 mb-2">📧 Email</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    For detailed inquiries or documentation, email us at:
                  </p>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>

                <div className="bg-secondary rounded-lg p-6 border border-border">
                  <h3 className="font-bold text-foreground mb-3">Business Hours</h3>
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
