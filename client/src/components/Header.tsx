import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/peaceful_taste_logo_bold-L44YHUAhEm48aZYksNhMVf.webp';

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
  ];

  const handleNavClick = (href: string) => {
    setLocation(href);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
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
              className="text-sm font-medium text-foreground hover:text-primary" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
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
            className="relative hover:text-primary" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden hover:text-primary" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-background border-t border-border">
          <div className="container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-left text-sm font-medium text-foreground hover:text-primary py-2" style={{ transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
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
