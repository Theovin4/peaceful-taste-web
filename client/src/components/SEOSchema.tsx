export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Peaceful Taste",
    "url": "https://peacefultaste-ftugacum.manus.space",
    "logo": "https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/peaceful_taste_logo_new_b80be0b3.png",
    "description": "Fresh handcrafted Nigerian treats - parfaits, pastries, chin-chin, and puff-puff with same-day delivery in Lagos",
    "sameAs": [
      "https://wa.me/2349022621323",
      "https://instagram.com/peacefultaste"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "+234-902-262-1323",
      "email": "queenofpeace323@gmail.com"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gasline, Magboro",
      "addressLocality": "Lagos",
      "addressRegion": "Lagos State",
      "postalCode": "100001",
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
    "image": "https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/peaceful_taste_logo_new_b80be0b3.png",
    "description": "Premium Nigerian food delivery service offering handcrafted parfaits, pastries, chin-chin, and puff-puff",
    "url": "https://peacefultaste-ftugacum.manus.space",
    "telephone": "+234-902-262-1323",
    "email": "queenofpeace323@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gasline, Magboro",
      "addressLocality": "Lagos",
      "addressRegion": "Lagos State",
      "addressCountry": "NG"
    },
    "areaServed": ["Lagos", "Magboro", "Ibafo", "Mowe"],
    "priceRange": "₦1500-₦6000",
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
      "url": "https://peacefultaste-ftugacum.manus.space/shop",
      "priceCurrency": "NGN",
      "price": price.toString(),
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
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
          "text": "We deliver to Lagos (₦5,000), Magboro (₦3,500), Ibafo (₦3,500), and Mowe (₦3,500). Same-day delivery available for orders before 2 PM."
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
          "text": "We accept bank transfers to Monie Point Bank (8139171125). Payment receipt upload required for order confirmation."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer bulk orders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer 10% discount on orders of 6+ items. Contact us via WhatsApp for custom catering packages."
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
