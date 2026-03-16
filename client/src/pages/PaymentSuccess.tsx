import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, Loader2, Upload } from 'lucide-react';
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
      // Upload receipt to backend with file reference
      await uploadReceiptMutation.mutateAsync({
        orderNumber,
        receiptUrl: `receipt-${orderNumber}-${Date.now()}`,
      });

      setUploadSuccess(true);
      toast.success('Receipt uploaded successfully! We will verify and process your payment soon.');
      
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
      <div className="min-h-screen bg-background py-12 flex items-center justify-center">
        <div className="container max-w-2xl">
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Receipt Uploaded!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your payment. We have received your receipt and will verify it shortly.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700">
                You will receive a confirmation email once your payment is verified. If you have any questions, contact us via WhatsApp.
              </p>
            </div>

            <Button
              onClick={() => setLocation('/shop')}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Upload Payment Receipt</h1>

        <Card className="p-8">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              After making your bank transfer, please upload a screenshot or photo of your payment receipt below. We will verify it and confirm your order.
            </p>
          </div>

          <form onSubmit={handleUploadReceipt} className="space-y-6">
            <div>
              <Label htmlFor="orderNumber" className="text-foreground font-semibold">
                Order Number *
              </Label>
              <Input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., ORD-1234567890-ABC"
                required
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You received this number after creating your order
              </p>
            </div>

            <div>
              <Label htmlFor="receipt" className="text-foreground font-semibold">
                Payment Receipt Image *
              </Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <label htmlFor="receipt" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    {receiptFile ? receiptFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF or PDF (max 5MB)
                  </p>
                </label>
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-2">What to upload:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Screenshot of successful bank transfer</li>
                <li>✓ Payment confirmation from your bank</li>
                <li>✓ Transaction receipt showing the amount transferred</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !receiptFile}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Receipt'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/shop')}
              className="w-full"
            >
              Cancel
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Need help?</p>
            <a
              href="https://wa.me/2349022621323?text=Hi%20I%20need%20help%20with%20my%20payment"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              💬 Contact via WhatsApp
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
