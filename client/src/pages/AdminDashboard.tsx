import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  ImagePlus,
  Lock,
  Mail,
  MessageCircle,
  MousePointerSquareDashed,
  Package,
  Pencil,
  Plus,
  Receipt,
  Save,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { formatNaira } from '@/lib/format';
import { fileToDataUrl } from '@/lib/orderReceipt';
import ProductVisual from '@/components/ProductVisual';
import PageMeta from '@/components/PageMeta';

type ProductFormState = {
  productId: string | null;
  name: string;
  categoryId: string;
  price: string;
  description: string;
  size: string;
  currentImage: string;
  imageUrl: string;
  imageFile: File | null;
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
};

const initialProductForm: ProductFormState = {
  productId: null,
  name: '',
  categoryId: '',
  price: '',
  description: '',
  size: '',
  currentImage: '',
  imageUrl: '',
  imageFile: null,
  isBestSeller: false,
  isNew: false,
  isActive: true,
};

function buildAutoDescription(name: string, categoryName: string, size: string) {
  const cleanName = name.trim() || 'This product';
  const cleanCategory = categoryName.trim() || 'menu item';
  const cleanSize = size.trim();

  if (cleanSize) {
    return `${cleanName} is a freshly prepared ${cleanCategory.toLowerCase()} served in ${cleanSize}, made for customers who want great taste, clear portions, and reliable delivery.`;
  }

  return `${cleanName} is a freshly prepared ${cleanCategory.toLowerCase()} made for customers who want great taste, clear portions, and reliable delivery.`;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [productForm, setProductForm] = useState<ProductFormState>(initialProductForm);
  const [featuredStoryProductId, setFeaturedStoryProductId] = useState('');
  const [flashDealProductIds, setFlashDealProductIds] = useState<string[]>([]);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const statusQuery = trpc.admin.status.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (typeof statusQuery.data?.isAuthenticated === 'boolean') {
      setIsAuthenticated(statusQuery.data.isAuthenticated);
    }
  }, [statusQuery.data]);

  const summaryQuery = trpc.orders.dashboardSummary.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
  const catalogQuery = trpc.catalog.getCatalog.useQuery(undefined, {
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!catalogQuery.data?.settings) return;
    setFeaturedStoryProductId(catalogQuery.data.settings.featuredStoryProductId);
    setFlashDealProductIds(catalogQuery.data.settings.flashDealProductIds);
  }, [catalogQuery.data?.settings]);

  useEffect(() => {
    if (productForm.productId || descriptionTouched) return;

    const categoryName =
      catalogQuery.data?.categories.find((category) => category.id === productForm.categoryId)?.name ?? 'product';

    setProductForm((prev) => ({
      ...prev,
      description: buildAutoDescription(prev.name, categoryName, prev.size),
    }));
  }, [
    catalogQuery.data?.categories,
    descriptionTouched,
    productForm.categoryId,
    productForm.name,
    productForm.productId,
    productForm.size,
  ]);

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: async () => {
      await Promise.all([statusQuery.refetch(), summaryQuery.refetch(), catalogQuery.refetch()]);
      setPassword('');
      toast.success('Admin access granted');
    },
    onError: (error) => toast.error(error.message),
  });

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: async () => {
      setIsAuthenticated(false);
      setProductForm(initialProductForm);
      await statusQuery.refetch();
      toast.success('Logged out');
    },
    onError: (error) => toast.error(error.message),
  });

  const createCategoryMutation = trpc.catalog.createCategory.useMutation({
    onSuccess: async () => {
      await catalogQuery.refetch();
      toast.success('Category created successfully.');
      setCategoryForm({ name: '', description: '' });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteCategoryMutation = trpc.catalog.deleteCategory.useMutation({
    onSuccess: async () => {
      await Promise.all([catalogQuery.refetch(), summaryQuery.refetch()]);
      toast.success('Category removed.');
    },
    onError: (error) => toast.error(error.message),
  });

  const createProductMutation = trpc.catalog.createProduct.useMutation({
    onSuccess: async () => {
      await catalogQuery.refetch();
      toast.success('Product created successfully.');
      setProductForm(initialProductForm);
      setDescriptionTouched(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const updateProductMutation = trpc.catalog.updateProduct.useMutation({
    onSuccess: async () => {
      await catalogQuery.refetch();
      toast.success('Product updated successfully.');
      setProductForm(initialProductForm);
      setDescriptionTouched(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteProductMutation = trpc.catalog.deleteProduct.useMutation({
    onSuccess: async () => {
      await catalogQuery.refetch();
      toast.success('Product removed.');
    },
    onError: (error) => toast.error(error.message),
  });

  const clearProductImageMutation = trpc.catalog.clearProductImage.useMutation({
    onSuccess: async () => {
      await catalogQuery.refetch();
      toast.success('Product image removed.');
    },
    onError: (error) => toast.error(error.message),
  });

  const clearAllProductImagesMutation = trpc.catalog.clearAllProductImages.useMutation({
    onSuccess: async () => {
      await catalogQuery.refetch();
      toast.success('All current product images have been removed. Upload your own images from this dashboard.');
    },
    onError: (error) => toast.error(error.message),
  });

  const updateSiteSettingsMutation = trpc.catalog.updateSiteSettings.useMutation({
    onSuccess: async () => {
      await catalogQuery.refetch();
      toast.success('Homepage story and flash deals updated.');
    },
    onError: (error) => toast.error(error.message),
  });

  const summary = summaryQuery.data;
  const catalog = catalogQuery.data;

  const stats = useMemo(() => {
    if (!summary) {
      return [
        { label: 'Orders', value: '-', icon: Package },
        { label: 'Revenue', value: '-', icon: BarChart3 },
        { label: 'Customers', value: '-', icon: Users },
        { label: 'Receipts', value: '-', icon: Receipt },
      ];
    }

    return [
      { label: 'Orders', value: summary.ordersCount.toString(), icon: Package },
      { label: 'Revenue', value: formatNaira(summary.totalRevenue), icon: BarChart3 },
      { label: 'Customers', value: summary.uniqueCustomers.toString(), icon: Users },
      { label: 'Receipts', value: summary.receiptUploadedOrders.toString(), icon: Receipt },
    ];
  }, [summary]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginMutation.mutateAsync({ password });
  };

  const openDownload = (type: 'orders' | 'inquiries') => {
    const url = type === 'orders' ? '/api/admin/export/orders' : '/api/admin/export/inquiries';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const submitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategoryMutation.mutateAsync(categoryForm);
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageDataUrl: string | undefined;
    let imageFileName: string | undefined;
    if (productForm.imageFile) {
      imageDataUrl = await fileToDataUrl(productForm.imageFile);
      imageFileName = productForm.imageFile.name;
    }

    const payload = {
      name: productForm.name,
      categoryId: productForm.categoryId,
      price: Number(productForm.price),
      description: productForm.description,
      size: productForm.size,
      clearImage: !productForm.imageFile && !productForm.imageUrl && !productForm.currentImage,
      imageUrl: productForm.imageUrl,
      imageDataUrl,
      imageFileName,
      isBestSeller: productForm.isBestSeller,
      isNew: productForm.isNew,
      isActive: productForm.isActive,
    };

    if (productForm.productId) {
      await updateProductMutation.mutateAsync({
        productId: productForm.productId,
        ...payload,
      });
      return;
    }

    await createProductMutation.mutateAsync(payload);
  };

  const beginEditProduct = (product: NonNullable<typeof catalog>['products'][number]) => {
    setProductForm({
      productId: product.id,
      name: product.name,
      categoryId: product.categoryId,
      price: String(product.price),
      description: product.description,
      size: product.size ?? '',
      currentImage: product.image,
      imageUrl: product.image.startsWith('data:') ? '' : product.image,
      imageFile: null,
      isBestSeller: Boolean(product.isBestSeller),
      isNew: Boolean(product.isNew),
      isActive: product.isActive !== false,
    });
    setDescriptionTouched(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setImageFile = (file: File | null) => {
    setProductForm((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl: file ? '' : prev.imageUrl,
      currentImage: file ? '' : prev.currentImage,
    }));
  };

  const removeSelectedImage = () => {
    setProductForm((prev) => ({
      ...prev,
      imageFile: null,
      imageUrl: '',
      currentImage: '',
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const previewImage = useMemo(() => {
    if (productForm.imageFile) {
      return URL.createObjectURL(productForm.imageFile);
    }

    if (productForm.imageUrl.trim()) {
      return productForm.imageUrl.trim();
    }

    return productForm.currentImage;
  }, [productForm.currentImage, productForm.imageFile, productForm.imageUrl]);

  useEffect(() => {
    if (!previewImage.startsWith('blob:')) return;

    return () => URL.revokeObjectURL(previewImage);
  }, [previewImage]);

  const toggleFlashDeal = (productId: string) => {
    setFlashDealProductIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }
      if (current.length >= 6) {
        toast.error('Select up to 6 rotating flash deals.');
        return current;
      }
      return [...current, productId];
    });
  };

  const saveSettings = async () => {
    if (!featuredStoryProductId) {
      toast.error('Choose a featured story product.');
      return;
    }
    if (flashDealProductIds.length === 0) {
      toast.error('Choose at least one flash deal product.');
      return;
    }

    await updateSiteSettingsMutation.mutateAsync({
      featuredStoryProductId,
      flashDealProductIds,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background py-12">
        <PageMeta
          title="Admin Access"
          description="Secure admin access for Peaceful Taste."
          path="/admin"
          robots="noindex, nofollow"
        />
        <div className="container max-w-md">
          <Card className="glass-panel border-0 p-8">
            <div className="mb-6 flex justify-center">
              <Lock className="h-12 w-12 text-accent" />
            </div>
            <h1 className="mb-2 text-center text-3xl font-bold text-foreground">Admin Access</h1>
            <p className="mb-6 text-center text-muted-foreground">Enter the admin password to manage products, homepage features, receipts, and workbook exports.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block font-semibold text-foreground">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 pr-12 text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loginMutation.isPending} className="btn-primary w-full text-white">
                Access Dashboard
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <PageMeta
        title="Admin Dashboard"
        description="Secure Peaceful Taste admin dashboard."
        path="/admin"
        robots="noindex, nofollow"
      />
      <div className="container space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Operations dashboard
            </p>
            <h1 className="text-4xl font-bold text-foreground">Manage products, receipts, and business records</h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              Create categories, add or edit products, choose the homepage featured story, control rotating flash deals, and download order workbooks.
            </p>
          </div>
          <Button onClick={() => logoutMutation.mutate()} variant="outline" className="border-border text-foreground hover:bg-secondary">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="glass-panel border-0 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <Card className="glass-panel border-0 p-6">
            <div className="mb-4 flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Excel downloads</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Download the latest order and inquiry workbooks for Excel, Google Sheets, and manual business analysis.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => openDownload('orders')} className="btn-primary text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Orders Workbook
              </Button>
              <Button onClick={() => openDownload('inquiries')} variant="outline" className="border-accent/40 bg-card/30 text-accent hover:bg-accent/10">
                <Download className="mr-2 h-4 w-4" />
                Download Inquiries Workbook
              </Button>
            </div>
          </Card>

          <Card className="glass-panel border-0 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Mail className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Receipt status</h2>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-3xl border border-border bg-background/60 p-4">
                <p className="font-semibold text-foreground">Customer PDF receipts</p>
                <p className="mt-1">Enabled with branded bank details, logo area, contact information, social handles, and full delivery address.</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/60 p-4">
                <p className="flex items-center gap-2 font-semibold text-foreground"><MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp business copy</p>
                <p className="mt-1">Enabled through prefilled business-share links.</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/60 p-4">
                <p className="font-semibold text-foreground">Automatic email sending</p>
                <p className="mt-1">Code is ready. Resend still needs an allowed sender domain before automatic email can go to all customers.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <Card className="glass-panel border-0 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Homepage controls</h2>
            </div>
            <div className="space-y-5">
              <div>
                <Label htmlFor="featuredStoryProduct" className="mb-2 block font-semibold text-foreground">Featured story product</Label>
                <select
                  id="featuredStoryProduct"
                  value={featuredStoryProductId}
                  onChange={(e) => setFeaturedStoryProductId(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground"
                >
                  <option value="">Select a product</option>
                  {(catalog?.products ?? []).map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="mb-3 block font-semibold text-foreground">Rotating flash deals (30s slider)</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {(catalog?.products ?? []).map((product) => {
                    const checked = flashDealProductIds.includes(product.id);
                    return (
                      <label key={product.id} className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground">
                        <input type="checkbox" checked={checked} onChange={() => toggleFlashDeal(product.id)} />
                        <span>
                          <span className="block font-medium">{product.name}</span>
                          <span className="block text-xs text-muted-foreground">{formatNaira(product.price)}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <Button onClick={saveSettings} disabled={updateSiteSettingsMutation.isPending} className="btn-primary text-white">
                <Save className="mr-2 h-4 w-4" />
                Save Homepage Settings
              </Button>
            </div>
          </Card>

          <Card className="glass-panel border-0 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Plus className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Create category</h2>
            </div>
            <form onSubmit={submitCategory} className="space-y-4">
              <div>
                <Label htmlFor="categoryName" className="mb-2 block font-semibold text-foreground">Category name</Label>
                <Input id="categoryName" value={categoryForm.name} onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g. Fresh Juices" className="bg-background" required />
              </div>
              <div>
                <Label htmlFor="categoryDescription" className="mb-2 block font-semibold text-foreground">Description</Label>
                <textarea id="categoryDescription" value={categoryForm.description} onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Short description shown on the shop page" className="min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground" required />
              </div>
              <Button type="submit" disabled={createCategoryMutation.isPending} className="btn-primary text-white">
                Create Category
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              {(catalog?.categories ?? []).map((category) => (
                <div key={category.id} className="rounded-3xl border border-border bg-background/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{category.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <Button variant="ghost" onClick={() => deleteCategoryMutation.mutate({ categoryId: category.id })} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <Card className="glass-panel border-0 p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ImagePlus className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">{productForm.productId ? 'Edit product' : 'Add product'}</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => clearAllProductImagesMutation.mutate()}
                  disabled={clearAllProductImagesMutation.isPending}
                  className="border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove All Site Images
                </Button>
                {productForm.productId && (
                  <Button variant="ghost" onClick={() => setProductForm(initialProductForm)} className="text-muted-foreground hover:text-foreground">
                    <X className="mr-2 h-4 w-4" />
                    Cancel edit
                  </Button>
                )}
              </div>
            </div>
            <form onSubmit={submitProduct} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="productName" className="mb-2 block font-semibold text-foreground">Product name</Label>
                <Input id="productName" value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g. Mango Yoghurt 35cl" className="bg-background" required />
                </div>
                <div>
                  <Label htmlFor="productCategory" className="mb-2 block font-semibold text-foreground">Category</Label>
                  <select id="productCategory" value={productForm.categoryId} onChange={(e) => setProductForm((prev) => ({ ...prev, categoryId: e.target.value }))} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground" required>
                    <option value="">Select category</option>
                    {(catalog?.categories ?? []).map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="productPrice" className="mb-2 block font-semibold text-foreground">Price (NGN)</Label>
                  <Input id="productPrice" type="number" min="1" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="3500" className="bg-background" required />
                </div>
                <div>
                  <Label htmlFor="productSize" className="mb-2 block font-semibold text-foreground">Size or pack</Label>
                  <Input id="productSize" value={productForm.size} onChange={(e) => setProductForm((prev) => ({ ...prev, size: e.target.value }))} placeholder="35cl, 330ml, 8 inch" className="bg-background" />
                </div>
              </div>

              <div>
                <Label htmlFor="productDescription" className="mb-2 block font-semibold text-foreground">Description</Label>
                <textarea id="productDescription" value={productForm.description} onChange={(e) => {
                  setDescriptionTouched(true);
                  setProductForm((prev) => ({ ...prev, description: e.target.value }));
                }} placeholder="Short clear description for customers" className="min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground" required />
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm">
                <p className="text-muted-foreground">
                  New products get an automatic description suggestion from the name, category, and size.
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-accent hover:bg-accent/10 hover:text-accent"
                  onClick={() => {
                    const categoryName =
                      catalog?.categories.find((category) => category.id === productForm.categoryId)?.name ?? 'product';
                    setProductForm((prev) => ({
                      ...prev,
                      description: buildAutoDescription(prev.name, categoryName, prev.size),
                    }));
                    setDescriptionTouched(false);
                  }}
                >
                  Regenerate
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="productImageUrl" className="mb-2 block font-semibold text-foreground">Image URL</Label>
                  <Input id="productImageUrl" value={productForm.imageUrl} onChange={(e) => setProductForm((prev) => ({ ...prev, imageUrl: e.target.value }))} placeholder="Optional external image URL" className="bg-background" />
                </div>
                <div>
                  <Label htmlFor="productImageFile" className="mb-2 block font-semibold text-foreground">Upload your image</Label>
                  <div
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDraggingImage(true);
                    }}
                    onDragLeave={() => setIsDraggingImage(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setIsDraggingImage(false);
                      setImageFile(event.dataTransfer.files?.[0] ?? null);
                    }}
                    className={`rounded-2xl border border-dashed px-4 py-5 text-center transition-colors ${
                      isDraggingImage ? 'border-accent bg-accent/10' : 'border-border bg-background'
                    }`}
                  >
                    <MousePointerSquareDashed className="mx-auto mb-3 h-6 w-6 text-accent" />
                    <p className="text-sm font-medium text-foreground">Drag and drop an image here</p>
                    <p className="mt-1 text-xs text-muted-foreground">or choose a file from your device</p>
                    <input
                      ref={fileInputRef}
                      id="productImageFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                      className="mt-4 block w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground"
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">Image preview</p>
                  <div className="flex gap-2">
                    {productForm.productId && productForm.currentImage && !productForm.imageFile && !productForm.imageUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive/10"
                        onClick={async () => {
                          await clearProductImageMutation.mutateAsync({ productId: productForm.productId! });
                          removeSelectedImage();
                        }}
                      >
                        Remove saved image
                      </Button>
                    )}
                    {(productForm.imageFile || productForm.imageUrl || productForm.currentImage) && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={removeSelectedImage}
                      >
                        Clear selection
                      </Button>
                    )}
                  </div>
                </div>
                {previewImage ? (
                  <img src={previewImage} alt="Product preview" className="h-48 w-full rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                    No product image selected yet
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Uploaded images are now shown directly on the website. If you leave both fields empty, the product will show a clean placeholder until you upload your own photo.
              </p>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { key: 'isBestSeller', label: 'Best seller' },
                  { key: 'isNew', label: 'New arrival' },
                  { key: 'isActive', label: 'Visible in shop' },
                ].map((option) => (
                  <label key={option.key} className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={Boolean(productForm[option.key as keyof ProductFormState])}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, [option.key]: e.target.checked }))}
                    />
                    {option.label}
                  </label>
                ))}
              </div>

              <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending} className="btn-primary text-white">
                {productForm.productId ? 'Save Product Changes' : 'Upload Product'}
              </Button>
            </form>
          </Card>

          <Card className="glass-panel border-0 p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Current products</h2>
            <div className="space-y-3">
              {(catalog?.products ?? []).map((product) => {
                const category = catalog?.categories.find((item) => item.id === product.categoryId);
                return (
                  <div key={product.id} className="rounded-3xl border border-border bg-background/60 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <ProductVisual product={product} variant="compact" className="h-20 w-20 border-0" />
                        <div>
                          <p className="font-semibold text-foreground">{product.name}</p>
                          <p className="text-sm text-accent">{formatNaira(product.price)}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                            {category?.name ?? product.categoryId}
                            {product.size ? ` • ${product.size}` : ''}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => beginEditProduct(product)} className="text-accent hover:bg-accent/10 hover:text-accent">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => clearProductImageMutation.mutate({ productId: product.id })}
                          className="text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                        >
                          <ImagePlus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" onClick={() => deleteProductMutation.mutate({ productId: product.id })} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <Card className="glass-panel border-0 p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Recent orders</h2>
            {summaryQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading order summary...</p>
            ) : summary?.recentOrders?.length ? (
              <div className="space-y-3">
                {summary.recentOrders.map((order) => (
                  <div key={order.orderNumber} className="rounded-3xl border border-border bg-background/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{formatNaira(order.totalAmount)}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-accent">{order.status || 'pending'}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{order.items}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No orders stored yet.</p>
            )}
          </Card>

          <Card className="glass-panel border-0 p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Recent inquiries</h2>
            {summaryQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading inquiry summary...</p>
            ) : summary?.recentInquiries?.length ? (
              <div className="space-y-3">
                {summary.recentInquiries.map((inquiry, index) => (
                  <div key={`${inquiry.email}-${index}`} className="rounded-3xl border border-border bg-background/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{inquiry.name}</p>
                        <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-accent">{inquiry.inquiryType}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{inquiry.subject}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No inquiries stored yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
