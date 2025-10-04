import { Switch, Route } from "wouter";
import { queryClient } from "../utils/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../components/ui/toaster";
import { TooltipProvider } from "../components/ui/tooltip";
import { OnboardingProvider } from "../hooks/use-onboarding";
import NotFound from "./not-found";
import Home from "./home";
import Missions from "./missions";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/missions" component={Missions} />
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
