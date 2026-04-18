import { ShoppingCart, MapPin, CreditCard, CheckCircle } from 'lucide-react';

export type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation';

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps: Array<{ id: CheckoutStep; label: string; icon: React.ReactNode }> = [
    { id: 'cart', label: 'Cart', icon: <ShoppingCart className="h-5 w-5" /> },
    { id: 'delivery', label: 'Delivery', icon: <MapPin className="h-5 w-5" /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'confirmation', label: 'Confirmation', icon: <CheckCircle className="h-5 w-5" /> },
  ];

  const stepOrder: CheckoutStep[] = ['cart', 'delivery', 'payment', 'confirmation'];
  const currentStepIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="border-b border-border bg-background/70 px-4 py-8 backdrop-blur-xl">
      <div className="container">
        <div className="glass-panel rounded-3xl p-5 md:p-7">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.id} className="relative flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all ${
                      isCompleted || isCurrent
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-[0.2em] ${isCurrent ? 'text-accent' : 'text-muted-foreground'}`}>
                      Step {index + 1}
                    </p>
                    <p className={`text-sm font-semibold ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
