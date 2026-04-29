import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2, Upload, MessageCircle, Download, Mail, Copy } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  copyTextToClipboard,
  downloadPdfReceipt,
  fileToDataUrl,
  loadLatestReceipt,
  saveLatestReceipt,
} from '@/lib/orderReceipt';
import PageMeta from '@/components/PageMeta';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const latestReceipt = useMemo(() => loadLatestReceipt(), []);
  const [orderNumber, setOrderNumber] = useState('');
  const [checkoutReference, setCheckoutReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'flutterwave'>('bank_transfer');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [createdReceipt, setCreatedReceipt] = useState(latestReceipt);

  const uploadReceiptMutation = trpc.orders.uploadReceipt.useMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderFromQuery = params.get('order');
    const checkoutReferenceFromQuery = params.get('checkoutReference');
    const methodFromQuery = params.get('method');

    if (orderFromQuery) {
      setOrderNumber(orderFromQuery);
    }

    if (checkoutReferenceFromQuery) {
      setCheckoutReference(checkoutReferenceFromQuery);
    }

    if (methodFromQuery === 'flutterwave' || methodFromQuery === 'bank_transfer') {
      setPaymentMethod(methodFromQuery);
    }

    if (!orderFromQuery && latestReceipt?.payload.orderNumber) {
      setOrderNumber(latestReceipt.payload.orderNumber);
    }
  }, [latestReceipt]);

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

    if (!orderNumber.trim() && !checkoutReference.trim()) {
      toast.error('Please enter your order number or payment reference.');
      return;
    }

    if (!receiptFile) {
      toast.error('Please select a receipt image');
      return;
    }

    setIsLoading(true);

    try {
      const receiptDataUrl = await fileToDataUrl(receiptFile);
      const response = await uploadReceiptMutation.mutateAsync({
        orderNumber: orderNumber.trim() || undefined,
        checkoutReference: checkoutReference.trim() || undefined,
        receiptName: receiptFile.name,
        receiptDataUrl,
        paymentMethod,
      });

      if (response.receipt) {
        saveLatestReceipt(response.receipt);
        setCreatedReceipt(response.receipt);
      }

      if (response.orderNumber) {
        setOrderNumber(response.orderNumber);
      }

      setUploadSuccess(true);
      toast.success(
        response.orderNumber
          ? `Payment proof uploaded. Your real order number is ${response.orderNumber}.`
          : 'Receipt uploaded successfully. We will verify and process your payment soon.'
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to upload receipt';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReceiptSummary = async () => {
    if (!createdReceipt?.receiptText) return;
    await copyTextToClipboard(createdReceipt.receiptText);
    setSummaryCopied(true);
    toast.success('Receipt summary copied.');
    setTimeout(() => setSummaryCopied(false), 1800);
  };

  if (uploadSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background py-12">
        <PageMeta
          title="Payment Submitted"
          description="Your Peaceful Taste payment proof has been uploaded successfully."
          path="/payment-success"
          robots="noindex, nofollow"
        />
        <div className="container max-w-2xl">
          <Card className="glass-panel border-0 p-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-emerald-400" />
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              {orderNumber ? 'Order created successfully' : 'Receipt uploaded'}
            </h1>
            <p className="mb-6 text-muted-foreground">
              {orderNumber
                ? `Your payment step is complete and your real order number is ${orderNumber}.`
                : 'Thank you for your payment. We have received your proof and will verify it shortly.'}
            </p>

            {orderNumber && (
              <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-300">
                  Order Number: <span className="font-mono font-bold">{orderNumber}</span>
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {createdReceipt && (
                <>
                  <Button onClick={() => downloadPdfReceipt(createdReceipt.fileName, createdReceipt.pdfBase64)} className="btn-primary text-white">
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                  <a href={createdReceipt.businessWhatsAppUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-400">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Copy to WhatsApp
                    </Button>
                  </a>
                </>
              )}
            </div>

            <Button onClick={() => setLocation('/shop')} className="mt-6 btn-primary w-full text-white">
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <PageMeta
        title="Upload Payment Proof"
        description="Upload your Peaceful Taste direct bank transfer proof so we can complete your order."
        path="/payment-success"
        robots="noindex, nofollow"
      />
      <div className="container max-w-3xl">
        <div className="mb-8">
          <p className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Bank Transfer Proof
          </p>
          <h1 className="text-4xl font-bold text-foreground">Upload your transfer confirmation</h1>
        </div>

        <Card className="glass-panel border-0 p-8">
          <div className="mb-6 rounded-2xl border border-accent/20 bg-accent/10 p-4">
            <p className="text-sm text-muted-foreground">
              After your direct bank transfer, upload a screenshot, PDF, or clear photo of the confirmation. Your real order number will be created after this payment step is submitted.
            </p>
          </div>

          {createdReceipt && (
            <div className="mb-6 rounded-3xl border border-border bg-background/60 p-5">
              <h2 className="mb-2 text-lg font-semibold text-foreground">Latest receipt</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                If you already created an order earlier, you can still download that receipt or copy it again here.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button onClick={() => downloadPdfReceipt(createdReceipt.fileName, createdReceipt.pdfBase64)} className="btn-primary text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
                <Button onClick={copyReceiptSummary} variant="outline" className="border-accent/40 bg-card/30 text-accent hover:bg-accent/10">
                  <Copy className="mr-2 h-4 w-4" />
                  {summaryCopied ? 'Receipt Copied' : 'Copy Receipt Summary'}
                </Button>
                <a href={createdReceipt.businessWhatsAppUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-400">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Copy to WhatsApp
                  </Button>
                </a>
                <a href={createdReceipt.businessEmailUrl}>
                  <Button variant="outline" className="w-full border-accent/40 bg-card/30 text-accent hover:bg-accent/10">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Copy to Email
                  </Button>
                </a>
              </div>
            </div>
          )}

          <form onSubmit={handleUploadReceipt} className="space-y-6">
            <div>
              <Label htmlFor="checkoutReference" className="font-semibold text-foreground">
                Payment Reference *
              </Label>
              <Input
                id="checkoutReference"
                type="text"
                value={checkoutReference}
                onChange={(e) => setCheckoutReference(e.target.value)}
                placeholder="e.g., CHK-1777467869099-ABC123"
                required={!orderNumber}
                className="mt-2 bg-background"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Use the payment reference shown on the bank transfer page if you do not yet have a real order number.
              </p>
            </div>

            <div>
              <Label htmlFor="orderNumber" className="font-semibold text-foreground">
                Existing Order Number (optional)
              </Label>
              <Input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., ORD-1234567890-abcde"
                className="mt-2 bg-background"
              />
            </div>

            <div>
              <Label htmlFor="receipt" className="font-semibold text-foreground">Payment Receipt *</Label>
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
                <li>- Bank app confirmation page</li>
                <li>- PDF or image showing the exact transfer amount</li>
              </ul>
            </div>

            <Button type="submit" disabled={isLoading || !receiptFile} className="btn-primary w-full text-white">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Transfer Proof'
              )}
            </Button>

            <Button type="button" variant="outline" onClick={() => setLocation('/shop')} className="w-full border-accent/40 bg-card/30 text-accent hover:bg-accent/10">
              Cancel
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
