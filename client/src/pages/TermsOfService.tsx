import PageMeta from '@/components/PageMeta';

const sections = [
  {
    title: 'Orders and Availability',
    body:
      'Orders are only confirmed after they are submitted successfully through the Peaceful Taste storefront and reviewed against current product availability. Some products may be unavailable or adjusted if ingredients, timing, or delivery limits change.',
  },
  {
    title: 'Pricing and Payment',
    body:
      'All displayed prices, delivery fees, and taxes are shown before checkout. Customers should pay the exact amount listed on the receipt or payment instructions. Orders move forward after payment proof is verified by Peaceful Taste.',
  },
  {
    title: 'Delivery Details',
    body:
      'Customers are responsible for providing a complete and accurate delivery address, including useful landmarks where needed. Incomplete or incorrect delivery details can delay order processing or delivery.',
  },
  {
    title: 'Receipts and Communication',
    body:
      'Peaceful Taste may send receipts, order updates, and confirmation messages through email, WhatsApp, or other customer-provided contact details. These records help confirm payment, delivery planning, and customer support.',
  },
  {
    title: 'Acceptable Use',
    body:
      'Customers must not use the site for fraudulent payments, false orders, or attempts to interfere with the storefront, admin dashboard, or payment confirmation process.',
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Terms of Service"
        description="Read the Peaceful Taste order, payment, receipt, and delivery terms before completing checkout."
        path="/terms-of-service"
      />
      <div className="py-12">
        <div className="container max-w-4xl">
          <div className="glass-panel rounded-[2rem] p-8 md:p-10">
            <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Terms of Service
            </p>
            <h1 className="text-4xl font-bold text-foreground">Simple terms customers can actually read</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              These terms explain how Peaceful Taste handles orders, pricing, payments, delivery details, and order communications. Using the storefront or placing an order means you agree to these terms.
            </p>

            <div className="mt-10 space-y-6">
              {sections.map((section) => (
                <section key={section.title} className="rounded-3xl border border-border bg-background/50 p-6">
                  <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
