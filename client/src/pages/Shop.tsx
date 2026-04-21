import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';
import { useCatalog } from '@/hooks/useCatalog';

type Category = 'all' | string;

export default function Shop() {
  const { categories, products, isLoading } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const categoryOptions: { value: Category; label: string; description: string }[] = [
    { value: 'all', label: 'All Products', description: 'Everything available now' },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
      description: category.description,
    })),
  ];

  const selectedCategoryMeta = categoryOptions.find((category) => category.value === selectedCategory) ?? categoryOptions[0];

  const filteredProducts = useMemo(
    () => (selectedCategory === 'all' ? products : products.filter((product) => product.categoryId === selectedCategory)),
    [products, selectedCategory]
  );

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={[{ label: 'Shop', href: '/shop' }]} />

      <section className="relative overflow-hidden border-b border-border py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,169,109,0.12),transparent_24%),radial-gradient(circle_at_left,rgba(63,107,34,0.2),transparent_28%)]" />
        <div className="container relative">
          <p className="mb-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Curated selection
          </p>
          <h1 className="text-display mb-4 text-foreground">Our Collection</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Browse chilled parfaits, pastries, drinks, and event-ready food options in a cleaner, faster storefront. Minimum order quantity is 3 items and next-day delivery is available.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <aside className="lg:col-span-1">
              <div className="glass-panel sticky top-24 rounded-3xl p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <h2 className="font-semibold text-foreground">Categories</h2>
                </div>
                <div className="space-y-2">
                  {categoryOptions.map((category) => {
                    const active = selectedCategory === category.value;

                    return (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`w-full rounded-2xl px-4 py-3 text-left transition-all ${
                          active
                            ? 'bg-primary text-primary-foreground shadow-soft'
                            : 'bg-card/50 text-foreground hover:bg-accent/10 hover:text-accent'
                        }`}
                      >
                        <span className="block text-sm font-semibold">{category.label}</span>
                        <span className={`mt-1 block text-xs ${active ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {category.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="glass-panel mb-8 rounded-3xl p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Now viewing</p>
                    <h2 className="mt-2 text-2xl font-semibold text-foreground">{selectedCategoryMeta.label}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{selectedCategoryMeta.description}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="glass-panel h-[430px] animate-pulse rounded-2xl" />
                  ))
                ) : filteredProducts.map((product, index) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.04}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="glass-panel mt-8 rounded-3xl p-10 text-center">
                  <p className="text-lg text-foreground">Nothing matches this category yet.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Try another category to keep exploring the menu.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
