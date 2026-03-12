import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const transitionStyle = { transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' };

  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-4">Peaceful Taste</h3>
            <p className="text-sm text-background/80 mb-4">
              Handcrafted treats made with love and the finest ingredients.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-primary" style={transitionStyle}>
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary" style={transitionStyle}>
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary" style={transitionStyle}>
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-primary" style={transitionStyle}>
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-primary" style={transitionStyle}>
                  Shop
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-primary" style={transitionStyle}>
                  Services
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary" style={transitionStyle}>
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 items-start">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+234 902 262 1323</span>
              </li>
              <li className="flex gap-2 items-start">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>queenofpeace323@gmail.com</span>
              </li>
              <li className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Gasline, Magboro, Lagos-Ibadan Expressway, Lagos State</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4">Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">Mon - Fri:</span> 8am - 8pm
              </li>
              <li>
                <span className="font-medium">Sat:</span> 9am - 9pm
              </li>
              <li>
                <span className="font-medium">Sun:</span> 10am - 6pm
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {currentYear} Peaceful Taste. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary" style={transitionStyle}>
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary" style={transitionStyle}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
