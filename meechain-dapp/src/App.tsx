
import { Switch, Route } from "wouter";
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/hooks/use-web3";
import { MeeBotProvider } from "@/hooks/use-meebot";
import NotFound from '@/pages/not-found';
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import NFTCollection from "@/pages/nft-collection";
import Marketplace from "@/pages/marketplace";
import Academy from '@/pages/academy';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Lazy load heavy components
const SwapBridge = lazy(() => import('./pages/swap-bridge'));
const Earnings = lazy(() => import('./pages/earnings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function Router() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-slate-400">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/nft" component={NFTCollection} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/academy" component={Academy} />
        <Route path="/swap" component={SwapBridge} />
        <Route path="/earnings" component={Earnings} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <MeeBotProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              <Router />
              <Toaster />
            </div>
          </TooltipProvider>
        </MeeBotProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;
