import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/peaceful_taste_logo_new_b80be0b3.png';

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
    <header className="sticky top-0 z-50 bg-background border-b border-border" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2 hover:opacity-80" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <img src={LOGO_URL} alt="Peaceful Taste" className="h-10 w-auto" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="text-sm font-semibold text-foreground hover:text-primary hover:scale-105 active:text-primary/80"
              style={{
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '0.5px',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button
            onClick={() => handleNavClick('/cart')}
            className="relative text-foreground hover:text-primary hover:scale-110 active:text-primary/80"
            style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-background text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground hover:text-primary hover:scale-110 active:text-primary/80"
            style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-background border-t border-border">
          <div className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-left text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/10 active:text-primary/80 px-4 py-3 rounded-lg transition-all duration-300"
                style={{
                  letterSpacing: '0.5px',
                }}
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
