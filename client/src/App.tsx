import { Switch, Route, Redirect } from "wouter";
import { lazy, Suspense } from 'react';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from '@/components/ui/toaster';
import { DeploymentStatusOverlay } from '@/components/meebot/deployment-status-overlay';
import { TooltipProvider } from "@/components/ui/tooltip";
import { OnboardingProvider } from "@/hooks/use-onboarding";
import NotFound from '@/pages/not-found';
import Home from "@/pages/home";
import Missions from "@/pages/missions";
import Dashboard from "@/pages/dashboard";
import TransactionHistory from '@/pages/transaction-history';
import ReceiveTokens from '@/pages/receive-tokens';
import SendTokens from '@/pages/send-tokens';
import ScheduledTasks from '@/pages/scheduled-tasks';
import SwapBridge from './pages/swap-bridge';
import MeeBotPage from '@/pages/meebot';
import Academy from './pages/academy';
import TeamDashboard from './pages/team-dashboard';
import AdminPage from './pages/admin';

// Lazy load components
const Earnings = lazy(() => import('./pages/earnings'));
const TokenActions = lazy(() => import("@/pages/token-actions"));

function Router() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/missions" component={Missions} />
        <Route path="/academy" component={Academy} />
        <Route path="/swap" component={SwapBridge} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/earnings" component={Earnings} />
        <Route path="/send" component={SendTokens} />
        <Route path="/receive" component={ReceiveTokens} />
        <Route path="/history" component={TransactionHistory} />
        <Route path="/scheduled-tasks" component={ScheduledTasks} />
        <Route path="/team-dashboard" component={TeamDashboard} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/meebot" component={MeeBotPage} />
        <Route path="/token-actions" component={TokenActions} />
        <Route path="/quest-tracker">{() => <Redirect to="/missions" />}</Route>
        <Route path="/mission-test-mode" component={lazy(() => import('@/pages/mission-test-mode'))} />
        <Route path="/nft-collection" component={lazy(() => import('./pages/nft-collection'))} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingProvider>
        <TooltipProvider>
          <Toaster />
          <DeploymentStatusOverlay />
          <Router />
        </TooltipProvider>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}

export default App;