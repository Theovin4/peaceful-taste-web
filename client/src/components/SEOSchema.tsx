import { PEACEFUL_TASTE_CONTACT } from '@shared/orderReceipt';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://peacefultaste.vercel.app';
const LOGO_URL = PEACEFUL_TASTE_CONTACT.logoUrl;

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Peaceful Taste",
    "url": SITE_URL,
    "logo": LOGO_URL,
    "description": "Order premium Nigerian parfaits, drinks, pastries, cakes, soups, and event trays from Peaceful Taste.",
    "sameAs": [
      "https://wa.me/2349022621323",
      "https://instagram.com/peacefultaste",
      "https://facebook.com/peacefultaste",
      "https://tiktok.com/@peacefultaste_"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "+234-902-262-1323",
      "email": "queenofpeace323@gmail.com"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": PEACEFUL_TASTE_CONTACT.address,
      "addressLocality": "Magboro",
      "addressRegion": "Ogun State",
      "postalCode": "110115",
      "addressCountry": "NG"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Peaceful Taste",
    "image": LOGO_URL,
    "description": "Premium Nigerian food delivery service offering branded parfaits, bottled drinks, pastries, cakes, soups, and party trays",
    "url": SITE_URL,
    "telephone": "+234-902-262-1323",
    "email": "queenofpeace323@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": PEACEFUL_TASTE_CONTACT.address,
      "addressLocality": "Magboro",
      "addressRegion": "Ogun State",
      "addressCountry": "NG"
    },
    "areaServed": ["Lagos", "Magboro", "Ibafo", "Mowe"],
    "priceRange": "NGN 1500-78000",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({ name, price, image, description }: { name: string; price: number; image: string; description: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": "Peaceful Taste"
    },
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/shop`,
      "priceCurrency": "NGN",
      "price": price.toString(),
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Peaceful Taste"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What delivery areas do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We deliver to Lagos (NGN 5,000), Magboro (NGN 2,500), Ibafo (NGN 3,000), and Mowe (NGN 3,500). Same-day delivery is available for orders placed before 2 PM."
        }
      },
      {
        "@type": "Question",
        "name": "How do I place an order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Browse our products, add items to your cart, proceed to checkout, select your delivery location, and make payment via bank transfer. We'll send you WhatsApp confirmation."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `We accept bank transfers to ${PEACEFUL_TASTE_CONTACT.bankName} (${PEACEFUL_TASTE_CONTACT.accountNumber}). Payment receipt upload is required for order confirmation.`
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer bulk orders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We offer 10% discount on orders of 6 or more items. Contact us via WhatsApp for custom catering packages."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Peaceful Taste",
    "url": SITE_URL,
    "description":
      "Peaceful Taste online store for Nigerian parfaits, drinks, pastries, cakes, soups, and trays.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
