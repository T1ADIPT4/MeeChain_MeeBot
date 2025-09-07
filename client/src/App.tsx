import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/missions" component={Missions} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/history" component={TransactionHistory} />
      <Route path="/receive" component={ReceiveTokens} />
      <Route path="/send" component={SendTokens} />
      <Route path="/tasks" component={ScheduledTasks} />
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