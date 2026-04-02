import { useState } from 'react';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';

type Category = 'all' | 'parfait' | 'pastries' | 'chin-chin' | 'puff-puff';

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'parfait', label: 'Parfaits' },
    { value: 'pastries', label: 'Pastries' },
    { value: 'chin-chin', label: 'Chin-chin' },
    { value: 'puff-puff', label: 'Puff-puff' },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: 'Shop', href: '/shop' }]} />

      {/* Header */}
      <section className="py-12 bg-secondary border-b border-border">
        <div className="container">
          <h1 className="text-display text-foreground mb-4">Our Collection</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse our complete selection of handcrafted treats. Each product is made fresh with premium ingredients.
          </p>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border border-border sticky top-24" style={{ boxShadow: '0 4px 12px rgba(44, 44, 44, 0.08)' }}>
                <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === cat.value
                        ? 'bg-primary text-white font-semibold'
                        : 'text-foreground hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-fade-in-up">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No products found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
