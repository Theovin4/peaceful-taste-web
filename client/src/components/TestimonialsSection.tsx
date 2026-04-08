import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Chioma Okafor',
    location: 'Lagos',
    product: 'Strawberry Parfait',
    text: 'Absolutely delicious! The parfaits are so fresh and beautifully presented. I order every week!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Tunde Adeyemi',
    location: 'Magboro',
    product: 'Jollof Rice',
    text: 'The Only Food items are incredible. Tastes just like homemade! Fast delivery too.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Zainab Hassan',
    location: 'Ibafo',
    product: 'Vanilla Cake',
    text: 'Premium quality cakes! Perfect for my daughter\'s birthday party. Highly recommended!',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying fresh, delicious treats from Peaceful Taste
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial: any) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-foreground mb-4 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Customer Info */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {testimonial.location}
                </p>
                <p className="text-xs text-primary font-medium">
                  Ordered: {testimonial.product}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Be part of our growing family of happy customers
          </p>
          <button
            onClick={() => window.location.href = '/shop'}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg transition-colors duration-300"
          >
            Shop Now & Share Your Experience
          </button>
        </div>
      </div>
    </section>
  );
}
