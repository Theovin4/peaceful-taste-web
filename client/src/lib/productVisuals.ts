import type { Product } from '@/lib/products';

export type ProductPackaging = 'bottle' | 'cup' | 'bowl' | 'pastry' | 'cake';

export interface ProductVisualPalette {
  shell: string;
  shellSoft: string;
  accent: string;
  accentSoft: string;
  highlight: string;
  depth: string;
  garnish: string[];
}

export interface ProductVisualMeta {
  packaging: ProductPackaging;
  palette: ProductVisualPalette;
  label: string;
  sublabel: string;
}

const basePalette: ProductVisualPalette = {
  shell: '#efe7d3',
  shellSoft: '#fff8ea',
  accent: '#1f5a37',
  accentSoft: '#2f7d49',
  highlight: '#d9a95f',
  depth: '#15321f',
  garnish: ['#f2c573', '#f6e5bb', '#a8cd80'],
};

function withPalette(overrides: Partial<ProductVisualPalette>): ProductVisualPalette {
  return {
    ...basePalette,
    ...overrides,
    garnish: overrides.garnish ?? basePalette.garnish,
  };
}

const flavorPalettes: { match: RegExp; palette: ProductVisualPalette }[] = [
  {
    match: /(strawberry|berry|red velvet)/i,
    palette: withPalette({
      shell: '#ffe2e7',
      shellSoft: '#fff1f4',
      accent: '#a12c4c',
      accentSoft: '#c34c6a',
      highlight: '#f27c9f',
      depth: '#64182e',
      garnish: ['#ff8aac', '#ffc6d5', '#f8f1c1'],
    }),
  },
  {
    match: /(banana|vanilla|plain sweetened|yoghurt)/i,
    palette: withPalette({
      shell: '#f8eed0',
      shellSoft: '#fff8ea',
      accent: '#887036',
      accentSoft: '#b09449',
      highlight: '#ecd283',
      depth: '#534622',
      garnish: ['#f4d96b', '#fff0b3', '#faf6dc'],
    }),
  },
  {
    match: /(chocolate|chin-?chin|meat pie|chicken pie|fish pie|shawarma)/i,
    palette: withPalette({
      shell: '#f1dec9',
      shellSoft: '#fff0de',
      accent: '#7e4d26',
      accentSoft: '#aa6a3a',
      highlight: '#d79b5a',
      depth: '#4b2d18',
      garnish: ['#c98040', '#efbd78', '#f7e2b8'],
    }),
  },
  {
    match: /(zobo|hibiscus)/i,
    palette: withPalette({
      shell: '#f9dbe2',
      shellSoft: '#fff1f4',
      accent: '#8f1638',
      accentSoft: '#b2244a',
      highlight: '#ea6588',
      depth: '#4d0e22',
      garnish: ['#e74071', '#ff9bb6', '#ffd7e3'],
    }),
  },
  {
    match: /(tiger nut|tigernut|coconut|white soup)/i,
    palette: withPalette({
      shell: '#f2e8d9',
      shellSoft: '#fff6ec',
      accent: '#8d6840',
      accentSoft: '#b48658',
      highlight: '#dec2a0',
      depth: '#533821',
      garnish: ['#caa57b', '#efe2ca', '#fff7ea'],
    }),
  },
  {
    match: /(jollof|pepper soup)/i,
    palette: withPalette({
      shell: '#f7ded1',
      shellSoft: '#fff2ea',
      accent: '#9b3b17',
      accentSoft: '#d05a2b',
      highlight: '#f29553',
      depth: '#61220c',
      garnish: ['#ea6a2d', '#f1b067', '#6ca34d'],
    }),
  },
  {
    match: /(fried rice|afang|vegetable|editan|okro)/i,
    palette: withPalette({
      shell: '#e2efdc',
      shellSoft: '#f4fbef',
      accent: '#33683a',
      accentSoft: '#4d9154',
      highlight: '#95c15f',
      depth: '#1d3b20',
      garnish: ['#62a84e', '#e3f2b6', '#ffbb6c'],
    }),
  },
  {
    match: /(egusi|ogbono|goat)/i,
    palette: withPalette({
      shell: '#f4e3b3',
      shellSoft: '#fff8df',
      accent: '#8d651e',
      accentSoft: '#b88d35',
      highlight: '#eccd6c',
      depth: '#573d12',
      garnish: ['#d5ae3c', '#f6df8b', '#4f8239'],
    }),
  },
];

export function getProductPackaging(product: Product): ProductPackaging {
  const name = product.name.toLowerCase();

  if (product.categoryId === 'parfait') return 'cup';
  if (product.categoryId === 'cakes') return 'cake';
  if (
    product.categoryId === 'yoghurt' ||
    product.categoryId === 'zobo' ||
    product.categoryId === 'tiger-nut' ||
    /chin-?chin/.test(name)
  ) {
    return 'bottle';
  }
  if (product.categoryId === 'only-food' || /soup|rice|pepper soup/.test(name)) {
    return 'bowl';
  }
  return 'pastry';
}

export function getProductVisualMeta(product: Product): ProductVisualMeta {
  const palette =
    flavorPalettes.find((entry) => entry.match.test(product.name))?.palette ?? basePalette;
  const packaging = getProductPackaging(product);
  const size = product.size?.trim() || '';

  return {
    packaging,
    palette,
    label:
      size ||
      (packaging === 'bottle'
        ? 'Fresh bottled'
        : packaging === 'cup'
          ? 'Layered dessert'
          : packaging === 'bowl'
            ? 'Takeaway ready'
            : packaging === 'cake'
              ? 'Celebration cake'
              : 'Freshly baked'),
    sublabel:
      packaging === 'bottle'
        ? 'Branded bottle'
        : packaging === 'cup'
          ? 'Branded dessert cup'
          : packaging === 'bowl'
            ? 'Transparent takeaway bowl'
            : packaging === 'cake'
              ? 'Premium cake finish'
              : 'Bakery display finish',
  };
}

export function getProductFlavorNote(product: Product): string {
  const name = product.name.toLowerCase();

  if (/strawberry|berry/.test(name)) return 'Berry fruit finish';
  if (/banana/.test(name)) return 'Banana cream finish';
  if (/vanilla/.test(name)) return 'Vanilla cream finish';
  if (/zobo/.test(name)) return 'Hibiscus spice finish';
  if (/tiger nut|tigernut/.test(name)) return 'Nutty creamy finish';
  if (/jollof/.test(name)) return 'Party jollof style';
  if (/fried rice/.test(name)) return 'Restaurant fried rice style';
  if (/egusi/.test(name)) return 'Rich egusi style';
  if (/ogbono/.test(name)) return 'Smooth ogbono style';
  if (/afang/.test(name)) return 'Seafood afang style';
  if (/pepper soup/.test(name)) return 'Pepper soup style';
  if (/puff/.test(name)) return 'Golden snack finish';
  return 'Peaceful Taste signature';
}
