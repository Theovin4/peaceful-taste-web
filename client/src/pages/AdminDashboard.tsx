import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Eye, EyeOff, Lock, BarChart3, FileSpreadsheet, Mail, MessageCircle, Package, Receipt, Users } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { formatNaira } from '@/lib/format';

const ADMIN_PASSWORD = 'peaceful123';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const summaryQuery = trpc.orders.dashboardSummary.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  const summary = summaryQuery.data;
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Admin access granted');
      setPassword('');
    } else {
      toast.error('Invalid password');
      setPassword('');
    }
  };

  const openDownload = (type: 'orders' | 'inquiries') => {
    const url = type === 'orders' ? '/api/admin/export/orders' : '/api/admin/export/inquiries';
    window.open(url, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-md">
          <Card className="glass-panel border-0 p-8">
            <div className="mb-6 flex justify-center">
              <Lock className="h-12 w-12 text-accent" />
            </div>
            <h1 className="mb-2 text-center text-3xl font-bold text-foreground">Admin Access</h1>
            <p className="mb-6 text-center text-muted-foreground">Enter password to access workbook downloads and analysis.</p>

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

              <Button type="submit" className="btn-primary w-full text-white">
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
      <div className="container space-y-8">
        <div>
          <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Workbook control
          </p>
          <h1 className="text-4xl font-bold text-foreground">Orders, receipts, and inquiry analysis</h1>
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="glass-panel border-0 p-6">
            <div className="mb-4 flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Excel downloads</h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Download the latest workbook files for offline review, filtering, charting, and analysis in Excel or Google Sheets.
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
            <div className="mt-6 rounded-3xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
              Orders workbook columns include customer details, totals, payment status, and receipt storage path for auditing.
            </div>
          </Card>

          <Card className="glass-panel border-0 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Mail className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Notification status</h2>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-3xl border border-border bg-background/60 p-4">
                <p className="font-semibold text-foreground">Customer receipt copy</p>
                <p className="mt-1">Enabled. Each order now generates a downloadable PDF receipt immediately.</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/60 p-4">
                <p className="flex items-center gap-2 font-semibold text-foreground"><MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp business copy</p>
                <p className="mt-1">Enabled through prefilled business-share links. Fully automatic sending still requires a real provider account.</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/60 p-4">
                <p className="font-semibold text-foreground">Email business copy</p>
                <p className="mt-1">Chosen provider: Resend free tier. The code is ready, but automatic sending still needs a real Resend account key and verified sending domain.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="glass-panel border-0 p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Recent orders</h2>
            {summaryQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading workbook summary...</p>
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
                        <p className="font-semibold text-primary">{formatNaira(order.totalAmount)}</p>
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
              <p className="text-sm text-muted-foreground">Loading workbook summary...</p>
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

        <div>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline" className="border-border text-foreground hover:bg-secondary">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
