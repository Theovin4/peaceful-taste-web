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
  // Parfait (12 items) - Prices updated: +₦800
  {
    id: 'parfait-1',
    name: 'Berry Bliss Parfait',
    category: 'parfait',
    price: 5300,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-1_a50b4f59.jpg',
    description: 'Layers of creamy yogurt, fresh berries, and crunchy granola. A perfect balance of taste and nutrition.',
    isBestSeller: true,
  },
  {
    id: 'parfait-2',
    name: 'Tropical Paradise Parfait',
    category: 'parfait',
    price: 5600,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-2_2158bf46.jpg',
    description: 'Exotic mango, pineapple, and coconut layers with silky smooth yogurt.',
    isNew: true,
  },
  {
    id: 'parfait-3',
    name: 'Chocolate Dream Parfait',
    category: 'parfait',
    price: 6000,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-3_40fda284.jpg',
    description: 'Rich chocolate mousse with whipped cream and dark chocolate shavings.',
    isBestSeller: true,
  },
  {
    id: 'parfait-4',
    name: 'Strawberry Cheesecake Parfait',
    category: 'parfait',
    price: 6300,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-2_2158bf46.jpg',
    description: 'Creamy cheesecake with fresh strawberries and graham crumble.',
    isNew: true,
  },
  {
    id: 'parfait-5',
    name: 'Mango Passion Parfait',
    category: 'parfait',
    price: 5700,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-1_a50b4f59.jpg',
    description: 'Smooth mango and passion fruit layers with coconut cream.',
  },
  {
    id: 'parfait-6',
    name: 'Vanilla Bean Parfait',
    category: 'parfait',
    price: 5000,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-3_40fda284.jpg',
    description: 'Classic vanilla with fresh fruit and honey granola.',
  },
  {
    id: 'parfait-7',
    name: 'Caramel Crunch Parfait',
    category: 'parfait',
    price: 6100,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-2_2158bf46.jpg',
    description: 'Silky caramel mousse with crunchy toffee bits.',
  },
  {
    id: 'parfait-8',
    name: 'Pistachio Delight Parfait',
    category: 'parfait',
    price: 6400,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-1_a50b4f59.jpg',
    description: 'Creamy pistachio layer with dark chocolate and pistachios.',
  },
  {
    id: 'parfait-9',
    name: 'Blueberry Bliss Parfait',
    category: 'parfait',
    price: 5400,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-3_40fda284.jpg',
    description: 'Antioxidant-rich blueberries with creamy yogurt and granola.',
  },
  {
    id: 'parfait-10',
    name: 'Coconut Dream Parfait',
    category: 'parfait',
    price: 5500,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-2_2158bf46.jpg',
    description: 'Tropical coconut with toasted coconut flakes and fresh pineapple.',
  },
  {
    id: 'parfait-11',
    name: 'Mixed Berry Parfait',
    category: 'parfait',
    price: 5200,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-1_a50b4f59.jpg',
    description: 'A colorful mix of strawberries, raspberries, and blackberries.',
  },
  {
    id: 'parfait-12',
    name: 'Honey Granola Parfait',
    category: 'parfait',
    price: 5100,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/parfait-3_40fda284.jpg',
    description: 'Sweet honey yogurt with homemade granola and fresh berries.',
  },

  // Pastries (12 items) - Prices updated: +₦800
  {
    id: 'pastries-1',
    name: 'Butter Croissant',
    category: 'pastries',
    price: 2900,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-1_382c7e60.jpg',
    description: 'Flaky, buttery croissant with layers of pure indulgence.',
    isBestSeller: true,
  },
  {
    id: 'pastries-2',
    name: 'Chocolate Croissant',
    category: 'pastries',
    price: 3200,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-2_b4881470.jpg',
    description: 'Rich chocolate-filled croissant with dark chocolate bars.',
  },
  {
    id: 'pastries-3',
    name: 'Danish Pastry',
    category: 'pastries',
    price: 3100,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-3_41b3f833.jpg',
    description: 'Sweet Danish with jam and almond filling.',
    isNew: true,
  },
  {
    id: 'pastries-4',
    name: 'Cheese Danish',
    category: 'pastries',
    price: 3000,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-1_382c7e60.jpg',
    description: 'Savory cheese-filled Danish pastry with herbs.',
  },
  {
    id: 'pastries-5',
    name: 'Almond Croissant',
    category: 'pastries',
    price: 3300,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-2_b4881470.jpg',
    description: 'Crispy croissant topped with sliced almonds and cream.',
  },
  {
    id: 'pastries-6',
    name: 'Fruit Danish',
    category: 'pastries',
    price: 3150,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-3_41b3f833.jpg',
    description: 'Fresh fruit-topped Danish with custard cream.',
  },
  {
    id: 'pastries-7',
    name: 'Pistachio Croissant',
    category: 'pastries',
    price: 3400,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-1_382c7e60.jpg',
    description: 'Buttery croissant with pistachio cream and crushed pistachios.',
  },
  {
    id: 'pastries-8',
    name: 'Vanilla Cream Pastry',
    category: 'pastries',
    price: 2950,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-2_b4881470.jpg',
    description: 'Delicate pastry filled with vanilla bean cream.',
  },
  {
    id: 'pastries-9',
    name: 'Strawberry Pastry',
    category: 'pastries',
    price: 3050,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-3_41b3f833.jpg',
    description: 'Fresh strawberries with whipped cream in flaky pastry.',
  },
  {
    id: 'pastries-10',
    name: 'Caramel Pastry',
    category: 'pastries',
    price: 3250,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-1_382c7e60.jpg',
    description: 'Sweet caramel-filled pastry with sea salt topping.',
  },
  {
    id: 'pastries-11',
    name: 'Spinach Feta Pastry',
    category: 'pastries',
    price: 2850,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-2_b4881470.jpg',
    description: 'Savory spinach and feta cheese in crispy pastry.',
  },
  {
    id: 'pastries-12',
    name: 'Honey Walnut Pastry',
    category: 'pastries',
    price: 3200,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/pastries-3_41b3f833.jpg',
    description: 'Crunchy walnuts with sweet honey in delicate pastry.',
  },

  // Chin-Chin (12 items) - Prices updated: +₦800
  {
    id: 'chin-chin-1',
    name: 'Classic Chin-Chin',
    category: 'chin-chin',
    price: 2500,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-1_55a919d1.jpg',
    description: 'Crispy, golden fried snack with perfect seasoning.',
    isBestSeller: true,
  },
  {
    id: 'chin-chin-2',
    name: 'Spicy Chin-Chin',
    category: 'chin-chin',
    price: 2600,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-2_fe72a02c.jpg',
    description: 'Hot and spicy version with chili and pepper blend.',
    isNew: true,
  },
  {
    id: 'chin-chin-3',
    name: 'Honey Chin-Chin',
    category: 'chin-chin',
    price: 2700,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-1_55a919d1.jpg',
    description: 'Sweet honey-coated chin-chin for those with a sweet tooth.',
  },
  {
    id: 'chin-chin-4',
    name: 'Garlic Chin-Chin',
    category: 'chin-chin',
    price: 2550,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-2_fe72a02c.jpg',
    description: 'Savory garlic-flavored crispy snack.',
  },
  {
    id: 'chin-chin-5',
    name: 'Onion Chin-Chin',
    category: 'chin-chin',
    price: 2450,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-1_55a919d1.jpg',
    description: 'Flavorful onion and herb seasoned chin-chin.',
  },
  {
    id: 'chin-chin-6',
    name: 'Curry Chin-Chin',
    category: 'chin-chin',
    price: 2650,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-2_fe72a02c.jpg',
    description: 'Aromatic curry-spiced chin-chin snack.',
  },
  {
    id: 'chin-chin-7',
    name: 'Sesame Chin-Chin',
    category: 'chin-chin',
    price: 2800,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-1_55a919d1.jpg',
    description: 'Crunchy sesame seed-coated chin-chin.',
  },
  {
    id: 'chin-chin-8',
    name: 'Herb Chin-Chin',
    category: 'chin-chin',
    price: 2500,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-2_fe72a02c.jpg',
    description: 'Fresh herbs and spices in every crispy bite.',
  },
  {
    id: 'chin-chin-9',
    name: 'Pepper Chin-Chin',
    category: 'chin-chin',
    price: 2600,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-1_55a919d1.jpg',
    description: 'Black pepper and spice blend for extra flavor.',
  },
  {
    id: 'chin-chin-10',
    name: 'Sweet & Spicy Chin-Chin',
    category: 'chin-chin',
    price: 2750,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-2_fe72a02c.jpg',
    description: 'Perfect balance of sweet and spicy flavors.',
  },
  {
    id: 'chin-chin-11',
    name: 'Original Chin-Chin Mix',
    category: 'chin-chin',
    price: 2400,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-1_55a919d1.jpg',
    description: 'Mix of our most popular chin-chin flavors.',
  },
  {
    id: 'chin-chin-12',
    name: 'Premium Chin-Chin',
    category: 'chin-chin',
    price: 3000,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/chin-chin-2_fe72a02c.jpg',
    description: 'Premium quality with extra seasoning and crispiness.',
  },

  // Puff-Puff (12 items) - Prices updated: +₦800
  {
    id: 'puff-puff-1',
    name: 'Classic Puff-Puff',
    category: 'puff-puff',
    price: 2300,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-1_d6253cfb.jpg',
    description: 'Golden, fluffy fried dough balls - a Nigerian classic.',
    isBestSeller: true,
  },
  {
    id: 'puff-puff-2',
    name: 'Spicy Puff-Puff',
    category: 'puff-puff',
    price: 2400,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-2_5c2e4b96.jpg',
    description: 'Hot and spicy puff-puff with pepper seasoning.',
    isNew: true,
  },
  {
    id: 'puff-puff-3',
    name: 'Honey Puff-Puff',
    category: 'puff-puff',
    price: 2500,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-1_d6253cfb.jpg',
    description: 'Sweet honey-drizzled puff-puff balls.',
  },
  {
    id: 'puff-puff-4',
    name: 'Garlic Puff-Puff',
    category: 'puff-puff',
    price: 2350,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-2_5c2e4b96.jpg',
    description: 'Savory garlic-flavored puff-puff.',
  },
  {
    id: 'puff-puff-5',
    name: 'Onion Puff-Puff',
    category: 'puff-puff',
    price: 2250,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-1_d6253cfb.jpg',
    description: 'Aromatic onion-seasoned puff-puff.',
  },
  {
    id: 'puff-puff-6',
    name: 'Curry Puff-Puff',
    category: 'puff-puff',
    price: 2450,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-2_5c2e4b96.jpg',
    description: 'Aromatic curry-spiced puff-puff.',
  },
  {
    id: 'puff-puff-7',
    name: 'Ginger Puff-Puff',
    category: 'puff-puff',
    price: 2550,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-1_d6253cfb.jpg',
    description: 'Warm ginger-flavored puff-puff.',
  },
  {
    id: 'puff-puff-8',
    name: 'Cinnamon Puff-Puff',
    category: 'puff-puff',
    price: 2600,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-2_5c2e4b96.jpg',
    description: 'Sweet cinnamon-dusted puff-puff.',
  },
  {
    id: 'puff-puff-9',
    name: 'Pepper Puff-Puff',
    category: 'puff-puff',
    price: 2400,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-1_d6253cfb.jpg',
    description: 'Black pepper-seasoned puff-puff.',
  },
  {
    id: 'puff-puff-10',
    name: 'Sweet Puff-Puff',
    category: 'puff-puff',
    price: 2350,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-2_5c2e4b96.jpg',
    description: 'Sugar-coated sweet puff-puff.',
  },
  {
    id: 'puff-puff-11',
    name: 'Mixed Spice Puff-Puff',
    category: 'puff-puff',
    price: 2500,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-1_d6253cfb.jpg',
    description: 'Blend of multiple spices in fluffy puff-puff.',
  },
  {
    id: 'puff-puff-12',
    name: 'Premium Puff-Puff',
    category: 'puff-puff',
    price: 2800,
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417086272/fTUGaCUm9YQhQkvWWi8FLU/puff-puff-2_5c2e4b96.jpg',
    description: 'Premium quality extra fluffy puff-puff.',
  },
];

export function getBestSellers() {
  return products.filter(p => p.isBestSeller).slice(0, 6);
}

export function getNewArrivals() {
  return products.filter(p => p.isNew).slice(0, 6);
}

export function getProductsByCategory(category: string) {
  return products.filter(p => p.category === category);
}

// Customer Testimonials
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Chioma Okafor',
    location: 'Lagos',
    rating: 5,
    text: 'The Berry Bliss Parfait is absolutely delicious! Fresh ingredients and perfect portions. I order every week now!',
    product: 'Berry Bliss Parfait',
  },
  {
    id: 'testimonial-2',
    name: 'Tunde Adeyemi',
    location: 'Ibadan',
    rating: 5,
    text: 'Best puff-puff I\'ve ever had! Fluffy, fresh, and delivered quickly. Highly recommended for parties.',
    product: 'Classic Puff-Puff',
  },
  {
    id: 'testimonial-3',
    name: 'Zainab Hassan',
    location: 'Abuja',
    rating: 5,
    text: 'The croissants are so buttery and flaky. Perfect for my morning breakfast. Quality is top-notch!',
    product: 'Butter Croissant',
  },
  {
    id: 'testimonial-4',
    name: 'Blessing Nwosu',
    location: 'Port Harcourt',
    rating: 5,
    text: 'Chin-chin is crispy and addictive! My family loves it. Great for snacking and entertaining guests.',
    product: 'Classic Chin-Chin',
  },
  {
    id: 'testimonial-5',
    name: 'Amara Ejiofor',
    location: 'Lagos',
    rating: 5,
    text: 'Ordered the Chocolate Dream Parfait for my birthday. It was absolutely stunning and tasted even better!',
    product: 'Chocolate Dream Parfait',
  },
  {
    id: 'testimonial-6',
    name: 'Kunle Oladele',
    location: 'Ilorin',
    rating: 5,
    text: 'The spicy puff-puff is perfect! Great quality, fresh delivery, and excellent customer service via WhatsApp.',
    product: 'Spicy Puff-Puff',
  },
];
