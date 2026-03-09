import { Check } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 bg-secondary border-b border-border">
        <div className="container">
          <h1 className="text-display text-foreground mb-4">About Peaceful Taste</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Our story, mission, and commitment to quality
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="mb-12">
            <h2 className="text-heading mb-6 text-foreground">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Peaceful Taste began with a simple passion: creating handcrafted treats that bring joy to every moment. What started as a small kitchen experiment has grown into a beloved brand trusted by thousands of customers.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              We believe that food is more than just sustenance—it's an experience, a memory, and a celebration. Every parfait, pastry, chin-chin, and puff-puff we create is made with love, care, and the finest ingredients we can source.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is simple: to bring authentic, delicious, and peaceful moments into your life through our treats. Whether you're celebrating a special occasion or treating yourself to something sweet, Peaceful Taste is here to make it memorable.
            </p>
          </div>

          {/* Mission & Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
              <h3 className="text-xl font-semibold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To create exceptional, handcrafted treats that bring joy, comfort, and peaceful moments to our customers' lives through premium quality and authentic flavors.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
              <h3 className="text-xl font-semibold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the trusted choice for artisanal treats, known for our commitment to quality, sustainability, and creating memorable experiences for every customer.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div>
            <h2 className="text-heading mb-8 text-foreground">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Quality First',
                  description: 'We never compromise on ingredient quality or preparation standards. Every product meets our rigorous quality checks.',
                },
                {
                  title: 'Authenticity',
                  description: 'We honor traditional recipes while bringing modern innovation. Our treats are genuine and made with integrity.',
                },
                {
                  title: 'Customer Care',
                  description: 'Your satisfaction is our priority. We listen to feedback and continuously improve our products and services.',
                },
                {
                  title: 'Sustainability',
                  description: 'We care about our environment and use eco-friendly packaging and sustainable sourcing practices where possible.',
                },
                {
                  title: 'Transparency',
                  description: 'We believe in being open about our ingredients, processes, and business practices. No hidden secrets.',
                },
                {
                  title: 'Community',
                  description: 'We support local suppliers and give back to our community. Together, we create positive change.',
                },
              ].map((value, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container max-w-3xl">
          <h2 className="text-heading mb-8 text-foreground text-center">Why Choose Peaceful Taste?</h2>
          <div className="space-y-6">
            {[
              {
                title: '100% Fresh Daily',
                description: 'All our treats are made fresh each day. No preservatives, no shortcuts, just pure quality.',
              },
              {
                title: 'Premium Ingredients',
                description: 'We source only the finest ingredients from trusted suppliers. Quality you can taste in every bite.',
              },
              {
                title: 'Certified Hygiene',
                description: 'Our kitchen meets all health and safety standards. Your health and safety are our top priority.',
              },
              {
                title: 'Customization Available',
                description: 'Have special dietary needs or preferences? We can customize orders to suit your requirements.',
              },
              {
                title: 'Fast & Reliable Delivery',
                description: 'We ensure your treats arrive fresh and on time. Delivery tracking available for all orders.',
              },
              {
                title: 'Customer Support',
                description: 'Our friendly team is here to help. Contact us anytime with questions or special requests.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-border" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <h2 className="text-heading mb-8 text-foreground text-center">Meet Our Team</h2>
          <div className="bg-white p-8 rounded-lg border border-border text-center" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Our small but passionate team is dedicated to creating the best treats for you. From sourcing ingredients to preparing each product with care, every team member shares our commitment to excellence.
            </p>
            <p className="text-muted-foreground">
              We're always growing and looking for talented individuals who share our passion for quality and customer satisfaction. If you're interested in joining our team, get in touch!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
