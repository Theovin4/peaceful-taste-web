import { ShoppingCart, MapPin, CreditCard, CheckCircle } from 'lucide-react';

export type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation';

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps: Array<{ id: CheckoutStep; label: string; icon: React.ReactNode }> = [
    { id: 'cart', label: 'Cart', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'delivery', label: 'Delivery', icon: <MapPin className="w-5 h-5" /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'confirmation', label: 'Confirmation', icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const stepOrder = ['cart', 'delivery', 'payment', 'confirmation'];
  const currentStepIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="bg-background border-b border-border py-8 px-4">
      <div className="container">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary text-background'
                      : isCurrent
                      ? 'bg-primary text-background ring-4 ring-primary/30'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.icon}
                </div>

                {/* Step Label */}
                <span
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isCurrent
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute w-16 h-1 top-6 -right-8 transition-all duration-300 ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`}
                    style={{
                      left: 'calc(50% + 24px)',
                      width: 'calc(100% - 48px)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Percentage */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Step Description */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}:{' '}
            <span className="text-foreground font-semibold">
              {steps[currentStepIndex].label}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
