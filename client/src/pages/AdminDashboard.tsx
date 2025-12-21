import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Dashboard from "./Dashboard";
import Panels from "./Panels";
import Tickets from "./Tickets";
import Settings from "./Settings";

export default function AdminDashboard() {
  const [location, navigate] = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem("selectedServerId");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const currentPage = location.split("/")[2] || "dashboard";

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
      case "":
        return <Dashboard />;
      case "panels":
        return <Panels />;
      case "tickets":
        return <Tickets />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="absolute top-8 right-8">
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        {renderPage()}
      </main>
    </div>
  );
}
