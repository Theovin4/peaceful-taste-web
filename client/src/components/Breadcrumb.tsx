import { ChevronRight, Home } from 'lucide-react';
import { useLocation } from 'wouter';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const [, setLocation] = useLocation();

  const handleClick = (href?: string) => {
    if (href) {
      setLocation(href);
    }
  };

  return (
    <nav className="bg-background border-b border-border py-3 px-4">
      <div className="container">
        <div className="flex items-center gap-2 text-sm">
          {/* Home Icon */}
          <button
            onClick={() => handleClick('/')}
            className="flex items-center gap-1 text-foreground hover:text-primary transition-colors duration-200"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* Breadcrumb Items */}
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {item.href ? (
                <button
                  onClick={() => handleClick(item.href)}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-muted-foreground font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
