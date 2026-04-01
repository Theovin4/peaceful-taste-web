import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'peaceful123'; // Simple password for demo

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleDownloadOrders = () => {
    toast.info('Download orders.xlsx from the data folder on the server');
  };

  const handleDownloadInquiries = () => {
    toast.info('Download inquiries.xlsx from the data folder on the server');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-md">
          <Card className="p-8">
            <div className="flex justify-center mb-6">
              <Lock className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Admin Access</h1>
            <p className="text-muted-foreground text-center mb-6">Enter password to access the dashboard</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-foreground font-semibold mb-2 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2"
              >
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
      <div className="container">
        <h1 className="text-4xl font-bold text-foreground mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Orders Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">📋 Orders</h2>
            <p className="text-muted-foreground mb-6">
              All customer orders are automatically saved to <code className="bg-secondary px-2 py-1 rounded">data/orders.xlsx</code>
            </p>
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">Columns:</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Order Number</li>
                  <li>• Date Created</li>
                  <li>• Customer Name, Email, Phone</li>
                  <li>• Items (JSON format)</li>
                  <li>• Subtotal, Tax, Shipping, Total</li>
                  <li>• Payment Method & Status</li>
                  <li>• Receipt URL</li>
                </ul>
              </div>
            </div>
            <Button
              onClick={handleDownloadOrders}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Orders
            </Button>
          </Card>

          {/* Inquiries Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">💬 Inquiries</h2>
            <p className="text-muted-foreground mb-6">
              All customer inquiries are automatically saved to <code className="bg-secondary px-2 py-1 rounded">data/inquiries.xlsx</code>
            </p>
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">Columns:</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Date Received</li>
                  <li>• Name, Email, Phone</li>
                  <li>• Subject & Message</li>
                  <li>• Inquiry Type</li>
                  <li>• Status (new/replied)</li>
                </ul>
              </div>
            </div>
            <Button
              onClick={handleDownloadInquiries}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Inquiries
            </Button>
          </Card>
        </div>

        {/* Instructions Card */}
        <Card className="p-6 bg-secondary">
          <h2 className="text-2xl font-bold text-foreground mb-4">📖 How to Use</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-1">1. Access Excel Files</p>
              <p>The Excel files are stored in the <code className="bg-background px-2 py-1 rounded text-xs">data/</code> folder on the server. Download them directly from your server file manager.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">2. View & Edit Data</p>
              <p>Open the Excel files with Microsoft Excel, Google Sheets, or any spreadsheet application to view and manage your orders and inquiries.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">3. Email Notifications</p>
              <p>You also receive email notifications at <strong>queenofpeace323@gmail.com</strong> for every new order and inquiry.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">4. Export & Share</p>
              <p>Export the Excel files to PDF or CSV format for sharing with team members or for record-keeping.</p>
            </div>
          </div>
        </Card>

        {/* Stats Card */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">📊 Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-muted-foreground text-sm mb-1">Orders File</p>
              <p className="text-2xl font-bold text-primary">data/orders.xlsx</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-muted-foreground text-sm mb-1">Inquiries File</p>
              <p className="text-2xl font-bold text-primary">data/inquiries.xlsx</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-muted-foreground text-sm mb-1">Email Notifications</p>
              <p className="text-2xl font-bold text-primary">Enabled</p>
            </div>
          </div>
        </Card>

        <div className="mt-8">
          <Button
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="border-border text-foreground hover:bg-secondary"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
