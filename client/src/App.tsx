import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

const Home = lazy(() => import("./pages/Home"));
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
    <div className="container py-16 md:py-24">
      <div className="glass-panel mx-auto max-w-3xl rounded-3xl px-6 py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Loading
        </p>
        <h2 className="mt-3 text-heading text-foreground">Preparing your page</h2>
        <p className="mt-3 text-muted-foreground">
          We are fetching the next experience without blocking the rest of the storefront.
        </p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteLoader />}>
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
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Header />
            <Router />
            <Footer />
            <WhatsAppButton />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
