import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useTelegram } from "@/hooks/useTelegram";
import SalesFlow from "@/pages/SalesFlow";
import TrainingFlow from "@/pages/TrainingFlow";
import TrainingFinal from "@/pages/TrainingFinal";
import NotFound from "@/pages/not-found";
import PhoneFrame from "@/components/PhoneFrame";

function Router() {
  const [location, setLocation] = useLocation();
  const { webApp } = useTelegram();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const reelId = params.get('reel');

    if (mode === 'training') {
      setLocation('/training');
    } else if (mode === 'sales') {
      setLocation('/');
    }

    if (reelId) {
      console.log('Deep link to reel:', reelId);
    }
  }, [setLocation]);

  return (
    <Switch>
      <Route path="/" component={SalesFlow} />
      <Route path="/training" component={TrainingFlow} />
      <Route path="/training/final" component={TrainingFinal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PhoneFrame>
          <Toaster />
          <Router />
        </PhoneFrame>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
