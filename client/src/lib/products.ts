export interface Product {
  id: string;
  name: string;
  category: 'parfait' | 'pastries' | 'chin-chin' | 'puff-puff';
  price: number;
  image: string;
  description: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export const products: Product[] = [
  // Parfait
  {
    id: 'parfait-1',
    name: 'Berry Bliss Parfait',
    category: 'parfait',
    price: 8.99,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait_hero_e6744559.jpg',
    description: 'Layers of creamy yogurt, fresh berries, and crunchy granola. A perfect balance of taste and nutrition.',
    isBestSeller: true,
  },
  {
    id: 'parfait-2',
    name: 'Tropical Paradise Parfait',
    category: 'parfait',
    price: 9.49,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait_hero_e6744559.jpg',
    description: 'Exotic mango, pineapple, and coconut layers with silky smooth yogurt.',
    isNew: true,
  },
  {
    id: 'parfait-3',
    name: 'Chocolate Dream Parfait',
    category: 'parfait',
    price: 9.99,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait_hero_e6744559.jpg',
    description: 'Rich chocolate mousse with whipped cream and dark chocolate shavings.',
    isBestSeller: true,
  },

  // Pastries
  {
    id: 'pastry-1',
    name: 'Butter Croissant',
    category: 'pastries',
    price: 4.99,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries_hero_4e8ba86a.jpg',
    description: 'Flaky, buttery croissant with a golden exterior and soft interior. Perfect with coffee.',
    isBestSeller: true,
  },
  {
    id: 'pastry-2',
    name: 'Almond Danish',
    category: 'pastries',
    price: 5.49,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries_hero_4e8ba86a.jpg',
    description: 'Sweet pastry with almond filling and a touch of honey glaze.',
    isNew: true,
  },
  {
    id: 'pastry-3',
    name: 'Cinnamon Roll',
    category: 'pastries',
    price: 5.99,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries_hero_4e8ba86a.jpg',
    description: 'Soft, spiral pastry with warm cinnamon sugar and creamy icing.',
  },
  {
    id: 'pastry-4',
    name: 'Chocolate Eclair',
    category: 'pastries',
    price: 6.49,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries_hero_4e8ba86a.jpg',
    description: 'Choux pastry filled with vanilla cream and topped with dark chocolate.',
    isBestSeller: true,
  },

  // Chin-chin
  {
    id: 'chinchin-1',
    name: 'Classic Chin-chin',
    category: 'chin-chin',
    price: 6.99,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin_chin_fb134590.jpg',
    description: 'Traditional Nigerian chin-chin. Crunchy, golden, and perfectly seasoned. A timeless snack.',
    isBestSeller: true,
  },
  {
    id: 'chinchin-2',
    name: 'Spicy Chin-chin',
    category: 'chin-chin',
    price: 7.49,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin_chin_fb134590.jpg',
    description: 'Bold and spicy variant with chili and ginger. For those who love heat.',
    isNew: true,
  },
  {
    id: 'chinchin-3',
    name: 'Honey Glazed Chin-chin',
    category: 'chin-chin',
    price: 7.99,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin_chin_fb134590.jpg',
    description: 'Sweet and savory blend with a honey glaze. A unique twist on the classic.',
  },

  // Puff-puff
  {
    id: 'puffpuff-1',
    name: 'Classic Puff-puff',
    category: 'puff-puff',
    price: 5.99,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff_puff_7fa29c90.jpg',
    description: 'Soft, fluffy fried dough balls. Light, airy, and dusted with sugar. Pure comfort food.',
    isBestSeller: true,
  },
  {
    id: 'puffpuff-2',
    name: 'Chocolate Filled Puff-puff',
    category: 'puff-puff',
    price: 6.99,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff_puff_7fa29c90.jpg',
    description: 'Classic puff-puff with a delicious chocolate filling. Indulgent and delightful.',
    isNew: true,
  },
  {
    id: 'puffpuff-3',
    name: 'Vanilla Custard Puff-puff',
    category: 'puff-puff',
    price: 7.49,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff_puff_7fa29c90.jpg',
    description: 'Fluffy puff-puff filled with smooth vanilla custard. A premium treat.',
  },
];

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category === category);
};

export const getBestSellers = (): Product[] => {
  return products.filter((p) => p.isBestSeller);
};

export const getNewProducts = (): Product[] => {
  return products.filter((p) => p.isNew);
};
