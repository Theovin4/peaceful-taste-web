import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { defaultCategories, defaultProducts, type Product, type ProductCategory } from '../client/src/lib/products';
import {
  blobStorageEnabled,
  downloadPrivateBlob,
  uploadPrivateJson,
  uploadPublicBlob,
} from './blob-storage';

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'peaceful-taste-data')
  : path.join(process.cwd(), 'data');

const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');
const CATALOG_BLOB_PATH = 'catalog/catalog.json';

export interface ProductCatalog {
  categories: ProductCategory[];
  products: Product[];
}

const defaultCatalog: ProductCatalog = {
  categories: defaultCategories,
  products: defaultProducts,
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function readCatalogFromBlob(): Promise<ProductCatalog | null> {
  const blob = await downloadPrivateBlob(CATALOG_BLOB_PATH);
  if (!blob) return null;

  try {
    return JSON.parse(blob.buffer.toString('utf8')) as ProductCatalog;
  } catch (error) {
    console.error('[Catalog] Failed to parse blob catalog:', error);
    return null;
  }
}

function normalizeCatalog(catalog: ProductCatalog): ProductCatalog {
  return {
    categories: [...catalog.categories].sort((a, b) => a.sortOrder - b.sortOrder),
    products: [...catalog.products],
  };
}

async function writeCatalog(catalog: ProductCatalog) {
  const normalized = normalizeCatalog(catalog);
  ensureDataDir();
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(normalized, null, 2));

  if (blobStorageEnabled()) {
    await uploadPrivateJson(CATALOG_BLOB_PATH, normalized);
  }

  return normalized;
}

export async function getCatalog(): Promise<ProductCatalog> {
  ensureDataDir();

  if (blobStorageEnabled()) {
    const blobCatalog = await readCatalogFromBlob();
    if (blobCatalog) {
      fs.writeFileSync(CATALOG_FILE, JSON.stringify(blobCatalog, null, 2));
      return normalizeCatalog(blobCatalog);
    }
  }

  if (fs.existsSync(CATALOG_FILE)) {
    try {
      const local = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8')) as ProductCatalog;
      return normalizeCatalog(local);
    } catch (error) {
      console.error('[Catalog] Failed to parse local catalog:', error);
    }
  }

  return writeCatalog(defaultCatalog);
}

export async function createCategory(input: {
  name: string;
  description: string;
}) {
  const catalog = await getCatalog();
  const baseId = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  let id = baseId || `category-${Date.now()}`;
  let counter = 1;

  while (catalog.categories.some((category) => category.id === id)) {
    id = `${baseId}-${counter}`;
    counter += 1;
  }

  const category: ProductCategory = {
    id,
    name: input.name,
    description: input.description,
    sortOrder: catalog.categories.length + 1,
  };

  const nextCatalog = await writeCatalog({
    ...catalog,
    categories: [...catalog.categories, category],
  });

  return { category, catalog: nextCatalog };
}

export async function deleteCategory(categoryId: string) {
  const catalog = await getCatalog();

  const nextCatalog = await writeCatalog({
    categories: catalog.categories
      .filter((category) => category.id !== categoryId)
      .map((category, index) => ({ ...category, sortOrder: index + 1 })),
    products: catalog.products.filter((product) => product.categoryId !== categoryId),
  });

  return nextCatalog;
}

export async function createProduct(input: {
  name: string;
  categoryId: string;
  price: number;
  imageUrl?: string;
  imageDataUrl?: string;
  imageFileName?: string;
  description: string;
  size?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isActive?: boolean;
}) {
  const catalog = await getCatalog();

  let image = input.imageUrl?.trim() || '';
  if (!image && input.imageDataUrl && input.imageFileName) {
    const dataUrlMatch = input.imageDataUrl.match(/^data:(.+?);base64,(.+)$/);
    if (!dataUrlMatch) {
      throw new Error('Image upload must be a valid data URL.');
    }

    const [, mimeType, base64Content] = dataUrlMatch;
    const safeFileName = input.imageFileName.replace(/[^a-zA-Z0-9._-]/g, '-');
    const pathname = `catalog/products/${Date.now()}-${safeFileName}`;
    const blob = await uploadPublicBlob(
      pathname,
      Buffer.from(base64Content, 'base64'),
      mimeType
    );

    image = blob?.url || '';
  }

  if (!image) {
    throw new Error('Provide an image URL or upload an image file.');
  }

  const baseId = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  let id = baseId || `product-${Date.now()}`;
  let counter = 1;

  while (catalog.products.some((product) => product.id === id)) {
    id = `${baseId}-${counter}`;
    counter += 1;
  }

  const product: Product = {
    id,
    name: input.name,
    categoryId: input.categoryId,
    price: input.price,
    image,
    description: input.description,
    size: input.size?.trim() || undefined,
    isBestSeller: Boolean(input.isBestSeller),
    isNew: Boolean(input.isNew),
    isActive: input.isActive ?? true,
  };

  const nextCatalog = await writeCatalog({
    ...catalog,
    products: [...catalog.products, product],
  });

  return { product, catalog: nextCatalog };
}

export async function deleteProduct(productId: string) {
  const catalog = await getCatalog();

  const nextCatalog = await writeCatalog({
    ...catalog,
    products: catalog.products.filter((product) => product.id !== productId),
  });

  return nextCatalog;
}
