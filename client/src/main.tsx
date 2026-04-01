import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// Add schema markup to document head
if (typeof document !== 'undefined') {
  const head = document.head;
  
  // Organization Schema
  const orgSchema = document.createElement('script');
  orgSchema.type = 'application/ld+json';
  orgSchema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Peaceful Taste",
    "url": "https://peacefultaste-ftugacum.manus.space",
    "logo": "https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/peaceful_taste_logo_new_b80be0b3.png",
    "description": "Fresh handcrafted Nigerian treats - parfaits, pastries, chin-chin, and puff-puff",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+234-902-262-1323",
      "contactType": "Customer Service",
      "email": "queenofpeace323@gmail.com"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gasline, Magboro",
      "addressLocality": "Lagos",
      "addressRegion": "Lagos State",
      "addressCountry": "NG"
    }
  });
  head.appendChild(orgSchema);
  
  // Local Business Schema
  const localSchema = document.createElement('script');
  localSchema.type = 'application/ld+json';
  localSchema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Peaceful Taste",
    "image": "https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/peaceful_taste_logo_new_b80be0b3.png",
    "description": "Premium Nigerian food delivery service",
    "url": "https://peacefultaste-ftugacum.manus.space",
    "telephone": "+234-902-262-1323",
    "areaServed": ["Lagos", "Magboro", "Ibafo", "Mowe"],
    "priceRange": "₦1500-₦6000"
  });
  head.appendChild(localSchema);
  
  // FAQ Schema
  const faqSchema = document.createElement('script');
  faqSchema.type = 'application/ld+json';
  faqSchema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What delivery areas do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We deliver to Lagos (₦5,000), Magboro (₦3,500), Ibafo (₦3,500), and Mowe (₦3,500)"
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer bulk orders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer 10% discount on orders of 6+ items"
        }
      }
    ]
  });
  head.appendChild(faqSchema);
}

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
