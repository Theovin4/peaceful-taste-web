import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  defaultCategories,
  defaultProducts,
  type Product,
  type ProductCategory,
} from '../client/src/lib/products';
import {
  blobStorageEnabled,
  downloadPrivateBlob,
  listPrivateBlobs,
  uploadPrivateJson,
  uploadPublicBlob,
} from './blob-storage';

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'peaceful-taste-data')
  : path.join(process.cwd(), 'data');

const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');
const CATALOG_BLOB_PATH = 'catalog/catalog.json';
const CATALOG_BLOB_PREFIX = 'catalog/history/';
const CURRENT_CATALOG_VERSION = 2;

export interface SiteSettings {
  version: number;
  featuredStoryProductId: string;
  flashDealProductIds: string[];
}

export interface ProductCatalog {
  categories: ProductCategory[];
  products: Product[];
  settings: SiteSettings;
}

const defaultSettings: SiteSettings = {
  version: CURRENT_CATALOG_VERSION,
  featuredStoryProductId: 'parfait-1',
  flashDealProductIds: ['parfait-1', 'pastries-6', 'zobo-1'],
};

const defaultCatalog: ProductCatalog = {
  categories: defaultCategories,
  products: defaultProducts,
  settings: defaultSettings,
};

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function readCatalogFromBlob(): Promise<ProductCatalog | null> {
  let latestSnapshotPath: string | null = null;

  try {
    const snapshots = await listPrivateBlobs(CATALOG_BLOB_PREFIX);
    latestSnapshotPath = snapshots
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]?.pathname || null;
  } catch (error) {
    console.warn('[Catalog] Snapshot list unavailable, falling back to current blob path:', error);
  }

  let blob = null;

  try {
    blob = latestSnapshotPath
      ? await downloadPrivateBlob(latestSnapshotPath)
      : await downloadPrivateBlob(CATALOG_BLOB_PATH);
  } catch (error) {
    console.warn('[Catalog] Blob read failed, falling back to local catalog:', error);
    return null;
  }
  if (!blob) return null;

  try {
    return JSON.parse(blob.buffer.toString('utf8')) as ProductCatalog;
  } catch (error) {
    console.error('[Catalog] Failed to parse blob catalog:', error);
    return null;
  }
}

function normalizeCatalog(catalog: Partial<ProductCatalog>): ProductCatalog {
  const categoryMap = new Map(defaultCategories.map((category) => [category.id, category]));
  const productMap = new Map(defaultProducts.map((product) => [product.id, product]));

  const incomingCategories = Array.isArray(catalog.categories) ? catalog.categories : [];
  const incomingProducts = Array.isArray(catalog.products) ? catalog.products : [];
  const incomingSettings = catalog.settings ?? defaultSettings;

  const mergedCategories = incomingCategories.map((category) =>
    categoryMap.has(category.id)
      ? {
          ...categoryMap.get(category.id)!,
          ...category,
        }
      : category
  );

  const mergedProducts = incomingProducts.map((product) =>
    productMap.has(product.id)
      ? {
          ...productMap.get(product.id)!,
          ...product,
        }
      : product
  );

  const settings: SiteSettings = {
    version: CURRENT_CATALOG_VERSION,
    featuredStoryProductId:
      incomingSettings.featuredStoryProductId || defaultSettings.featuredStoryProductId,
    flashDealProductIds:
      incomingSettings.flashDealProductIds?.length
        ? incomingSettings.flashDealProductIds
        : defaultSettings.flashDealProductIds,
  };

  const safeFeaturedId =
    mergedProducts.find((product) => product.id === settings.featuredStoryProductId)?.id ||
    mergedProducts[0]?.id ||
    defaultSettings.featuredStoryProductId;

  const safeFlashDeals = settings.flashDealProductIds.filter((productId, index, list) => {
    return (
      list.indexOf(productId) === index &&
      mergedProducts.some((product) => product.id === productId && product.isActive !== false)
    );
  });

  return {
    categories: [...mergedCategories].sort((a, b) => a.sortOrder - b.sortOrder),
    products: [...mergedProducts],
    settings: {
      ...settings,
      featuredStoryProductId: safeFeaturedId,
      flashDealProductIds:
        safeFlashDeals.length > 0
          ? safeFlashDeals
          : mergedProducts
              .filter((product) => product.isActive !== false)
              .slice(0, 3)
              .map((product) => product.id),
    },
  };
}

async function writeCatalog(catalog: ProductCatalog) {
  const normalized = normalizeCatalog(catalog);
  ensureDataDir();
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(normalized, null, 2));

  if (blobStorageEnabled()) {
    const snapshotPath = `${CATALOG_BLOB_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;
    await uploadPrivateJson(snapshotPath, normalized);
    await uploadPrivateJson(CATALOG_BLOB_PATH, normalized);
  }

  return normalized;
}

export async function getCatalog(): Promise<ProductCatalog> {
  ensureDataDir();

  if (blobStorageEnabled()) {
    const blobCatalog = await readCatalogFromBlob();
    if (blobCatalog) {
      const normalized = normalizeCatalog(blobCatalog);
      fs.writeFileSync(CATALOG_FILE, JSON.stringify(normalized, null, 2));
      if ((blobCatalog.settings?.version ?? 0) < CURRENT_CATALOG_VERSION) {
        await uploadPrivateJson(CATALOG_BLOB_PATH, normalized);
      }
      return normalized;
    }
  }

  if (fs.existsSync(CATALOG_FILE)) {
    try {
      const local = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8')) as ProductCatalog;
      const normalized = normalizeCatalog(local);
      fs.writeFileSync(CATALOG_FILE, JSON.stringify(normalized, null, 2));
      return normalized;
    } catch (error) {
      console.error('[Catalog] Failed to parse local catalog:', error);
    }
  }

  return writeCatalog(defaultCatalog);
}

async function getCatalogWithRetry(
  predicate: (catalog: ProductCatalog) => boolean,
  options: { attempts?: number; delayMs?: number } = {}
) {
  const { attempts = 20, delayMs = 500 } = options;
  let catalog = await getCatalog();

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (predicate(catalog)) {
      return catalog;
    }
    await wait(delayMs);
    catalog = await getCatalog();
  }

  return catalog;
}

export async function createCategory(input: { name: string; description: string }) {
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
    ...catalog,
    categories: catalog.categories
      .filter((category) => category.id !== categoryId)
      .map((category, index) => ({ ...category, sortOrder: index + 1 })),
    products: catalog.products.filter((product) => product.categoryId !== categoryId),
    settings: {
      ...catalog.settings,
      flashDealProductIds: catalog.settings.flashDealProductIds.filter(
        (productId) => catalog.products.find((product) => product.id === productId)?.categoryId !== categoryId
      ),
    },
  });

  return nextCatalog;
}

async function resolveProductImage(input: {
  imageUrl?: string;
  imageDataUrl?: string;
  imageFileName?: string;
}) {
  let image = input.imageUrl?.trim() || '';

  if (!image && input.imageDataUrl && input.imageFileName) {
    const dataUrlMatch = input.imageDataUrl.match(/^data:(.+?);base64,(.+)$/);
    if (!dataUrlMatch) {
      throw new Error('Image upload must be a valid data URL.');
    }

    const [, mimeType, base64Content] = dataUrlMatch;
    const safeFileName = input.imageFileName.replace(/[^a-zA-Z0-9._-]/g, '-');
    const pathname = `catalog/products/${Date.now()}-${safeFileName}`;
    const blob = await uploadPublicBlob(pathname, Buffer.from(base64Content, 'base64'), mimeType);

    image = blob?.url || input.imageDataUrl;
  }

  return image;
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
  const catalog = await getCatalogWithRetry((currentCatalog) =>
    currentCatalog.categories.some((category) => category.id === input.categoryId)
  );
  const image = await resolveProductImage(input);

  if (!catalog.categories.some((category) => category.id === input.categoryId)) {
    throw new Error('Category not found.');
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

export async function updateProduct(input: {
  productId: string;
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
  const catalog = await getCatalogWithRetry((currentCatalog) =>
    currentCatalog.products.some((product) => product.id === input.productId)
  );
  const existingProduct = catalog.products.find((product) => product.id === input.productId);
  const image = input.imageDataUrl || input.imageUrl?.trim()
    ? await resolveProductImage(input)
    : existingProduct?.image;

  const updatedProduct: Product = {
    ...(existingProduct ?? {
      id: input.productId,
    }),
    name: input.name,
    categoryId: input.categoryId,
    price: input.price,
    image: image ?? '',
    description: input.description,
    size: input.size?.trim() || undefined,
    isBestSeller: Boolean(input.isBestSeller),
    isNew: Boolean(input.isNew),
    isActive: input.isActive ?? true,
  };

  const nextCatalog = await writeCatalog({
    ...catalog,
    products: existingProduct
      ? catalog.products.map((product) =>
          product.id === input.productId ? updatedProduct : product
        )
      : [...catalog.products, updatedProduct],
  });

  return { product: updatedProduct, catalog: nextCatalog };
}

export async function deleteProduct(productId: string) {
  const catalog = await getCatalog();

  const nextCatalog = await writeCatalog({
    ...catalog,
    products: catalog.products.filter((product) => product.id !== productId),
    settings: {
      ...catalog.settings,
      featuredStoryProductId:
        catalog.settings.featuredStoryProductId === productId
          ? catalog.products.find((product) => product.id !== productId)?.id || defaultSettings.featuredStoryProductId
          : catalog.settings.featuredStoryProductId,
      flashDealProductIds: catalog.settings.flashDealProductIds.filter((id) => id !== productId),
    },
  });

  return nextCatalog;
}

export async function updateSiteSettings(input: {
  featuredStoryProductId: string;
  flashDealProductIds: string[];
}) {
  const requiredProductIds = [input.featuredStoryProductId, ...input.flashDealProductIds];
  const catalog = await getCatalogWithRetry((currentCatalog) =>
    requiredProductIds.every((productId) =>
      currentCatalog.products.some((product) => product.id === productId)
    )
  );

  const hasAllProducts = requiredProductIds.every((productId) =>
    catalog.products.some((product) => product.id === productId)
  );

  if (!hasAllProducts) {
    throw new Error('One or more selected products are not available yet. Please retry in a moment.');
  }

  const nextCatalog = await writeCatalog({
    ...catalog,
    settings: {
      ...catalog.settings,
      featuredStoryProductId: input.featuredStoryProductId,
      flashDealProductIds: input.flashDealProductIds,
    },
  });

  return nextCatalog.settings;
}

export async function clearAllProductImages() {
  const catalog = await getCatalog();

  const nextCatalog = await writeCatalog({
    ...catalog,
    products: catalog.products.map((product) => ({
      ...product,
      image: '',
    })),
  });

  return nextCatalog;
}
