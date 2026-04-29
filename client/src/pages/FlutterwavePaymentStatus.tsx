import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, CheckCircle, Loader2, MessageCircle, ReceiptText, ShieldCheck, Sparkles, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { formatNaira } from '@/lib/format';
import { downloadPdfReceipt, loadLatestReceipt, saveLatestReceipt } from '@/lib/orderReceipt';
import PageMeta from '@/components/PageMeta';

type VerificationState = 'loading' | 'success' | 'failed' | 'cancelled';

const statusCopy: Record<
  VerificationState,
  {
    badge: string;
    title: string;
    tone: string;
    detail: string;
  }
> = {
  loading: {
    badge: 'Checking Payment',
    title: 'We are confirming your Flutterwave payment',
    tone: 'border-accent/20 bg-accent/10 text-accent',
    detail: 'Please keep this page open for a few seconds while we confirm the payment securely on the backend.',
  },
  success: {
    badge: 'Payment Confirmed',
    title: 'Your payment is verified successfully',
    tone: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    detail: 'Your order has been created and the admin dashboard has been updated automatically.',
  },
  failed: {
    badge: 'Verification Needed',
    title: 'Payment could not be confirmed yet',
    tone: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
    detail: 'If your account was debited, contact us immediately on WhatsApp and share the transaction details so we can help you quickly.',
  },
  cancelled: {
    badge: 'Payment Cancelled',
    title: 'The Flutterwave payment was cancelled',
    tone: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    detail: 'No order was finalized from this payment attempt. You can safely return to checkout and try again.',
  },
};

export default function FlutterwavePaymentStatus() {
  const [, setLocation] = useLocation();
  const latestReceipt = useMemo(() => loadLatestReceipt(), []);
  const [state, setState] = useState<VerificationState>('loading');
  const [message, setMessage] = useState('We are verifying your Flutterwave payment securely.');
  const [receiptPackage, setReceiptPackage] = useState(latestReceipt);
  const [paymentDetails, setPaymentDetails] = useState<null | {
    orderNumber: string;
    transactionId: string;
    amount: number;
    currency: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paidAt: string;
  }>(null);
  const verificationAttemptKey = useRef<string | null>(null);

  const verifyMutation = trpc.orders.verifyFlutterwavePayment.useMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get('transaction_id');
    const txRef = params.get('tx_ref');
    const status = params.get('status') || undefined;

    const attemptKey = `${transactionId || 'missing'}:${txRef || 'missing'}:${status || 'none'}`;
    if (verificationAttemptKey.current === attemptKey) {
      return;
    }

    if (!transactionId || !txRef) {
      if (status === 'cancelled') {
        setState('cancelled');
        setMessage('You cancelled the Flutterwave payment before it completed.');
        return;
      }

      setState('failed');
      setMessage('Missing Flutterwave verification details. Please try the payment again.');
      return;
    }

    verificationAttemptKey.current = attemptKey;
    verifyMutation
      .mutateAsync({ transactionId, txRef, status })
      .then((response) => {
        if (!response.success) {
          setState(response.status === 'cancelled' ? 'cancelled' : 'failed');
          setMessage(response.message);
          return;
        }

        setState('success');
        setMessage(response.message);
        if (response.receipt) {
          saveLatestReceipt(response.receipt);
          setReceiptPackage(response.receipt);
        }
        setPaymentDetails({
          orderNumber: response.orderNumber || '',
          transactionId: response.payment?.transactionId || '',
          amount: response.payment?.amount || 0,
          currency: response.payment?.currency || 'NGN',
          customerName: response.payment?.customerName || '',
          customerEmail: response.payment?.customerEmail || '',
          customerPhone: response.payment?.customerPhone || '',
          paidAt: response.payment?.paidAt || '',
        });
      })
      .catch((error) => {
        setState('failed');
        const fallbackMessage =
          'Unable to verify this Flutterwave payment right now. Please wait a moment and refresh once, or contact us on WhatsApp if the debit already happened.';
        setMessage(error instanceof Error ? error.message : fallbackMessage);
      });
  }, [verifyMutation]);

  const orderNumber = paymentDetails?.orderNumber || latestReceipt?.payload.orderNumber || '';
  const ui = statusCopy[state];
  const paidAtLabel = paymentDetails?.paidAt
    ? new Date(paymentDetails.paidAt).toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '';

  return (
    <div className="min-h-screen bg-background py-12">
      <PageMeta
        title="Flutterwave Payment Status"
        description="Verify your Flutterwave checkout securely before Peaceful Taste confirms your order."
        path="/payment-status"
        robots="noindex, nofollow"
      />
      <div className="container max-w-3xl">
        <Card className="glass-panel border-0 overflow-hidden p-0">
          <div className="border-b border-border/60 bg-[radial-gradient(circle_at_top,_rgba(180,120,40,0.16),_transparent_52%)] px-8 py-8">
            <div className="mb-6 flex items-start gap-4">
              {state === 'loading' ? (
                <div className="rounded-3xl border border-accent/20 bg-accent/10 p-3">
                  <Loader2 className="h-10 w-10 animate-spin text-accent" />
                </div>
              ) : state === 'success' ? (
                <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>
              ) : (
                <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-3">
                  <XCircle className="h-10 w-10 text-rose-400" />
                </div>
              )}
              <div className="flex-1">
                <p className={`mb-3 inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${ui.tone}`}>
                  {ui.badge}
                </p>
                <h1 className="text-4xl font-bold text-foreground">{ui.title}</h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">{message}</p>
                <p className="mt-2 text-sm text-muted-foreground/90">{ui.detail}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: 'Step 1',
                  title: 'Checkout started',
                  description: 'Your payment request reached Flutterwave.',
                  active: true,
                },
                {
                  label: 'Step 2',
                  title: 'Payment processed',
                  description: state === 'cancelled' ? 'This payment was cancelled before completion.' : 'Flutterwave completed the payment step.',
                  active: state !== 'failed',
                },
                {
                  label: 'Step 3',
                  title: 'Order confirmed',
                  description: state === 'success' ? 'Your order is now stored on the site and dashboard.' : 'We verify and finalize the order here before showing success.',
                  active: state === 'success',
                },
              ].map((step) => (
                <div
                  key={step.label}
                  className={`rounded-3xl border p-4 ${
                    step.active ? 'border-accent/20 bg-background/70' : 'border-border/70 bg-background/40'
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent/80">{step.label}</p>
                  <p className="mt-2 font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 py-8">
            {state === 'success' && paymentDetails ? (
              <>
                <div className="mb-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-200">
                        Your Flutterwave payment has been confirmed on the backend.
                      </p>
                      <p className="mt-2 text-sm text-emerald-100/90">
                        We have already updated the order record and admin dashboard. You do not need to upload payment proof again unless support asks for it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-8 grid gap-4 rounded-3xl bg-background/60 p-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Order Number</p>
                    <p className="mt-2 font-mono text-lg text-foreground">{paymentDetails.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Transaction ID</p>
                    <p className="mt-2 font-mono text-lg text-foreground">{paymentDetails.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Amount</p>
                    <p className="mt-2 text-lg font-semibold text-primary">{formatNaira(paymentDetails.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Customer</p>
                    <p className="mt-2 text-foreground">{paymentDetails.customerName}</p>
                    <p className="text-sm text-muted-foreground">{paymentDetails.customerEmail}</p>
                  </div>
                  {paidAtLabel && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Verified At</p>
                      <p className="mt-2 text-foreground">{paidAtLabel}</p>
                    </div>
                  )}
                </div>

                {receiptPackage && (
                  <div className="mb-8 grid gap-3 sm:grid-cols-2">
                    <Button
                      onClick={() => downloadPdfReceipt(receiptPackage.fileName, receiptPackage.pdfBase64)}
                      className="btn-primary text-white"
                    >
                      <ReceiptText className="mr-2 h-4 w-4" />
                      Download Customer Receipt
                    </Button>
                    <a
                      href={receiptPackage.businessWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-400">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send Receipt to WhatsApp
                      </Button>
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="mb-8 rounded-3xl border border-border bg-background/60 p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {state === 'loading'
                        ? 'Secure verification is in progress'
                        : state === 'cancelled'
                          ? 'You can safely try the payment again'
                          : 'Need help with a debited payment?'}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {state === 'loading'
                        ? 'Please avoid refreshing repeatedly while we confirm the transaction. This usually completes shortly.'
                        : state === 'cancelled'
                          ? 'Return to checkout when you are ready. If you changed your mind, nothing else is required.'
                          : 'If Flutterwave charged you but this page still failed, contact us on WhatsApp with your transaction ID and we will help you confirm it quickly.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {state === 'success' ? (
                <>
                  <Button onClick={() => setLocation('/shop')} className="btn-primary text-white">
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={() => setLocation(orderNumber ? `/payment-success?order=${encodeURIComponent(orderNumber)}&method=flutterwave` : '/payment-success')}
                    variant="outline"
                    className="border-accent/40 bg-card/30 text-accent hover:bg-accent/10"
                  >
                    Optional proof upload
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setLocation('/checkout')} className="btn-primary text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Checkout
                  </Button>
                  <a
                    href="https://wa.me/2349022621323?text=Hi%20I%20need%20help%20with%20my%20Flutterwave%20payment"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-400">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact via WhatsApp
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
