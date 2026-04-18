import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="container max-w-2xl">
        <div className="glass-panel rounded-3xl px-8 py-14 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full border border-destructive/30 bg-destructive/10 p-5">
              <AlertCircle className="h-14 w-14 text-destructive" />
            </div>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent">404</p>
          <h1 className="mb-3 text-4xl font-bold text-foreground">Page Not Found</h1>
          <p className="mx-auto mb-8 max-w-xl leading-relaxed text-muted-foreground">
            Sorry, the page you are looking for does not exist or may have moved. Let’s get you back to the main storefront.
          </p>

          <Button onClick={() => setLocation("/")} className="btn-primary gap-2 text-white">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
