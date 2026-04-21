import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/contexts/CartContext';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/peaceful-taste-logo_09e2b0c8.jpg';

export default function Header() {
  const [, setLocation] = useLocation();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Social', href: '/social' },
  ];

  const handleNavClick = (href: string) => {
    setLocation(href);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl" style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.28)' }}>
      <div className="container flex items-center justify-between h-20">
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2 hover:opacity-80"
          style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <img
            src={LOGO_URL}
            alt="Peaceful Taste"
            className="h-10 w-auto rounded-md"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="text-sm font-semibold text-foreground/88 hover:text-accent active:text-accent/80"
              style={{
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '0.5px',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavClick('/cart')}
            className="relative text-foreground hover:text-accent active:text-accent/80"
            style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground hover:text-accent active:text-accent/80"
            style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-left text-sm font-semibold text-foreground hover:text-accent hover:bg-accent/10 active:text-accent/80 px-4 py-3 rounded-xl transition-all duration-300"
                style={{ letterSpacing: '0.5px' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
