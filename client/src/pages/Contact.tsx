import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 bg-secondary border-b border-border">
        <div className="container">
          <h1 className="text-display text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We'd love to hear from you. Reach out with any questions or feedback.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="bg-white p-8 rounded-lg border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
              <Phone className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Phone</h3>
              <p className="text-muted-foreground mb-4">
                Call us during business hours for immediate assistance.
              </p>
              <a href="tel:+2349022621323" className="text-primary font-semibold">
                +234 902 262 1323
              </a>
            </div>

            <div className="bg-white p-8 rounded-lg border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
              <Mail className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground mb-4">
                Send us an email and we'll respond within 24 hours.
              </p>
              <a href="mailto:queenofpeace323@gmail.com" className="text-primary font-semibold">
                queenofpeace323@gmail.com
              </a>
            </div>

            <div className="bg-white p-8 rounded-lg border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Location</h3>
              <p className="text-muted-foreground">
                Gasline, Magboro<br />
                Lagos-Ibadan Expressway<br />
                Lagos State, Nigeria
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-secondary p-8 rounded-lg mb-16 border border-border">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-4">Business Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-foreground">Monday - Friday</p>
                    <p className="text-muted-foreground">8:00 AM - 8:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Saturday</p>
                    <p className="text-muted-foreground">9:00 AM - 9:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Sunday</p>
                    <p className="text-muted-foreground">10:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Holidays</p>
                    <p className="text-muted-foreground">Call for availability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-primary text-white p-8 rounded-lg mb-16 text-center">
            <h2 className="text-heading mb-4">Quick Contact Options</h2>
            <p className="mb-6 opacity-90">
              For urgent matters or special requests, reach out via WhatsApp or call us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-white/90 text-primary font-semibold px-6 py-3 rounded-lg transition-all"
              >
                Chat on WhatsApp
              </a>
              <a
                href="tel:+1234567890"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-all border border-white/50"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-heading mb-4 text-foreground">Send us a Message</h2>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
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
                <label className="block text-sm font-medium text-foreground mb-2">
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

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="What is this about?"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="Your message here..."
                rows={5}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
