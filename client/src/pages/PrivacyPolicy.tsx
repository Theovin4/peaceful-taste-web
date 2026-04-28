import PageMeta from '@/components/PageMeta';

const sections = [
  {
    title: 'Information We Collect',
    body:
      'We collect the details you provide when you place an order, contact Peaceful Taste, or request support. This can include your name, email address, phone number, delivery location, delivery address, and order details.',
  },
  {
    title: 'How We Use Your Information',
    body:
      'We use your information to process orders, prepare receipts, confirm payments, arrange delivery, respond to enquiries, and improve the storefront and admin workflow. We do not sell your personal information.',
  },
  {
    title: 'Cookies and Similar Storage',
    body:
      'This website uses essential browser storage and cookies to keep the storefront working properly. That includes remembering cart activity, session state, and basic interface preferences. These are used to support checkout, admin access, and a smoother customer experience.',
  },
  {
    title: 'Sharing and Security',
    body:
      'Order information is only shared with service providers needed to operate the business, such as hosting, storage, email delivery, and payment confirmation workflows. We use reasonable technical and administrative safeguards to protect customer information.',
  },
  {
    title: 'Your Choices',
    body:
      'If you want us to correct or remove order contact details that are no longer needed for business records, contact Peaceful Taste directly through the phone, WhatsApp, or email listed on this website.',
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Privacy Policy"
        description="Learn how Peaceful Taste handles customer information, cookies, essential storage, and order-related data."
        path="/privacy-policy"
      />
      <div className="py-12">
        <div className="container max-w-4xl">
          <div className="glass-panel rounded-[2rem] p-8 md:p-10">
            <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Privacy Policy
            </p>
            <h1 className="text-4xl font-bold text-foreground">Clear information on privacy and cookies</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              Peaceful Taste collects only the details needed to process orders, communicate with customers, and operate this website reliably. This page explains what is collected, how it is used, and how cookies or similar storage support the storefront.
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
