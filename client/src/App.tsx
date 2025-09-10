import { Switch, Route } from "wouter";
import { lazy } from 'react';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OnboardingProvider } from "@/hooks/use-onboarding";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Missions from "@/pages/missions";
import Dashboard from "@/pages/dashboard";
import TransactionHistory from "@/pages/transaction-history";
import ReceiveTokens from "@/pages/receive-tokens";
import SendTokens from "@/pages/send-tokens";
import ScheduledTasks from "@/pages/scheduled-tasks";
import SwapBridge from './pages/swap-bridge';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/missions" component={Missions} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/earnings" component={lazy(() => import('./pages/earnings'))} />
      <Route path="/send" component={SendTokens} />
      <Route path="/receive" component={ReceiveTokens} />
      <Route path="/history" component={TransactionHistory} />
      <Route path="/scheduled-tasks" component={ScheduledTasks} />
      <Route path="/swap-bridge" component={SwapBridge} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}

export default App;