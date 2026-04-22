import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

import Home from "./pages/Home";
const Shop = lazy(() => import("./pages/Shop"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const PaymentCheckout = lazy(() => import("./pages/PaymentCheckout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const SocialShowcase = lazy(() => import("./pages/SocialShowcase"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="glass-panel w-full max-w-lg rounded-3xl px-6 py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Peaceful Taste
        </p>
        <h2 className="mt-3 text-heading text-foreground">Loading your page</h2>
        <p className="mt-3 text-muted-foreground">
          Bringing in the next page as quickly as possible.
        </p>
        <div className="mx-auto mt-6 h-2 w-40 overflow-hidden rounded-full bg-card">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/shop"} component={Shop} />
      <Route path={"/services"} component={Services} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={PaymentCheckout} />
      <Route path={"/payment-success"} component={PaymentSuccess} />
      <Route path={"/social"} component={SocialShowcase} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const preload = () => {
      void import("./pages/Shop");
      void import("./pages/Services");
      void import("./pages/About");
      void import("./pages/Contact");
      void import("./pages/Cart");
      void import("./pages/PaymentCheckout");
      void import("./pages/PaymentSuccess");
      void import("./pages/SocialShowcase");
      void import("./pages/AdminDashboard");
      void import("./pages/NotFound");
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(preload, 600);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Suspense fallback={<RouteLoader />}>
              {!isAdminRoute && <Header />}
              <Router />
              {!isAdminRoute && <Footer />}
              {!isAdminRoute && <WhatsAppButton />}
            </Suspense>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
