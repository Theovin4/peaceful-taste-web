import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2, Upload, MessageCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [orderNumber, setOrderNumber] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const uploadReceiptMutation = trpc.orders.uploadReceipt.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      toast.error('Please enter your order number');
      return;
    }

    if (!receiptFile) {
      toast.error('Please select a receipt image');
      return;
    }

    setIsLoading(true);

    try {
      await uploadReceiptMutation.mutateAsync({
        orderNumber,
        receiptUrl: `receipt-${orderNumber}-${Date.now()}`,
      });

      setUploadSuccess(true);
      toast.success('Receipt uploaded successfully. We will verify and process your payment soon.');

      setTimeout(() => {
        setLocation('/shop');
      }, 3000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to upload receipt';
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background py-12">
        <div className="container max-w-2xl">
          <Card className="glass-panel border-0 p-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-emerald-400" />
            <h1 className="mb-2 text-3xl font-bold text-foreground">Receipt uploaded</h1>
            <p className="mb-6 text-muted-foreground">
              Thank you for your payment. We have received your proof and will verify it shortly.
            </p>

            <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-300">
                You will receive a confirmation once your payment is verified. If you need help, contact us via WhatsApp.
              </p>
            </div>

            <Button onClick={() => setLocation('/shop')} className="btn-primary w-full text-white">
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-3xl">
        <div className="mb-8">
          <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Payment proof
          </p>
          <h1 className="text-4xl font-bold text-foreground">Upload your payment receipt</h1>
        </div>

        <Card className="glass-panel border-0 p-8">
          <div className="mb-6 rounded-2xl border border-accent/20 bg-accent/10 p-4">
            <p className="text-sm text-muted-foreground">
              After your bank transfer, upload a screenshot, PDF, or clear photo of the receipt. We will verify it and confirm your order.
            </p>
          </div>

          <form onSubmit={handleUploadReceipt} className="space-y-6">
            <div>
              <Label htmlFor="orderNumber" className="text-foreground font-semibold">Order Number *</Label>
              <Input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., ORD-1234567890-ABC"
                required
                className="mt-2 bg-background"
              />
              <p className="mt-1 text-xs text-muted-foreground">You received this number after creating your order.</p>
            </div>

            <div>
              <Label htmlFor="receipt" className="text-foreground font-semibold">Payment Receipt *</Label>
              <div className="mt-2 rounded-3xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-accent">
                <input id="receipt" type="file" accept="image/*,.pdf" onChange={handleFileChange} required className="hidden" />
                <label htmlFor="receipt" className="cursor-pointer">
                  <Upload className="mx-auto mb-3 h-12 w-12 text-accent" />
                  <p className="mb-1 text-sm font-medium text-foreground">
                    {receiptFile ? receiptFile.name : 'Click to upload your proof of payment'}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF, or PDF up to 5MB</p>
                </label>
              </div>
            </div>

            <div className="rounded-2xl bg-background/70 p-4">
              <p className="mb-2 text-sm font-semibold text-foreground">What to upload:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>- Screenshot of successful bank transfer</li>
                <li>- Payment confirmation from your bank</li>
                <li>- Transaction receipt showing the amount transferred</li>
              </ul>
            </div>

            <Button type="submit" disabled={isLoading || !receiptFile} className="btn-primary w-full text-white">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Receipt'
              )}
            </Button>

            <Button type="button" variant="outline" onClick={() => setLocation('/shop')} className="w-full border-accent/40 bg-card/30 text-accent hover:bg-accent/10">
              Cancel
            </Button>
          </form>

          <div className="mt-8 border-t border-border pt-8">
            <p className="mb-3 text-sm text-muted-foreground">Need help?</p>
            <a
              href="https://wa.me/2349022621323?text=Hi%20I%20need%20help%20with%20my%20payment"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-400"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact via WhatsApp
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
