import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Landing from "@/pages/Landing";
import ServerSelect from "@/pages/ServerSelect";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

function Router() {
  const handleAuthRedirect = () => {
    // Check if we have a valid session
    const hasSession = document.cookie.includes('session_id');
    if (!hasSession) {
      return <Landing />;
    }
  };

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/servers" component={ServerSelect} />
      <Route path="/user/*" component={UserDashboard} />
      <Route path="/admin/*" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
