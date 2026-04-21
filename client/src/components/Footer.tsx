import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const transitionStyle = { transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' };

  return (
    <footer className="mt-20 border-t border-border bg-[#0b1014] text-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-accent">Peaceful Taste</p>
            <h3 className="mb-4 text-lg font-bold">Handcrafted treats, darker premium feel.</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Fresh parfaits, pastries, drinks, and custom orders prepared with care and delivered across key Lagos routes.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com/peacefultaste" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border p-2 text-muted-foreground hover:text-accent" style={transitionStyle}>
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com/peacefultaste" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border p-2 text-muted-foreground hover:text-accent" style={transitionStyle}>
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://wa.me/2349022621323" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border p-2 text-muted-foreground hover:text-accent" style={transitionStyle}>
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Home', '/'],
                ['Shop', '/shop'],
                ['Services', '/services'],
                ['About', '/about'],
                ['Dashboard', '/admin'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-muted-foreground hover:text-accent" style={transitionStyle}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span>+234 902 262 1323</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span>queenofpeace323@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span>Gasline, Magboro, Lagos-Ibadan Expressway, Lagos State</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Hours</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Mon - Fri:</span> 8am - 8pm</li>
              <li><span className="font-medium text-foreground">Sat:</span> 9am - 9pm</li>
              <li><span className="font-medium text-foreground">Sun:</span> 10am - 6pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p className="text-muted-foreground">&copy; {currentYear} Peaceful Taste. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="/admin" className="text-muted-foreground hover:text-accent" style={transitionStyle}>Dashboard</a>
              <a href="#" className="text-muted-foreground hover:text-accent" style={transitionStyle}>Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-accent" style={transitionStyle}>Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
