import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, HelpCircle, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function UserDashboard() {
  const [, navigate] = useLocation();
  
  const { data: tickets = [] } = useQuery({
    queryKey: ["/api/tickets"],
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("selectedServerId");
      localStorage.removeItem("isAdmin");
      document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <img src="/ipeorg-badge.png" alt="IPEORG" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold">IPEORG SUPPORT</h1>
              <p className="text-xs text-gray-400">User Dashboard</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-red-400 hover:text-red-300">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Your Tickets</p>
                <p className="text-2xl font-bold">{tickets.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <HelpCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Resolved</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'closed').length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Your Tickets Section */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h2 className="text-xl font-bold mb-6">Your Support Tickets</h2>
          
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No tickets yet</p>
              <p className="text-gray-500 text-sm mt-2">Create a ticket in your Discord server to get support</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Ticket #{ticket.id}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ticket.status === 'open' 
                        ? 'bg-yellow-500/20 text-yellow-300' 
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Info Section */}
        <div className="mt-8 p-6 border border-gray-700 rounded-lg bg-gray-800/50">
          <h3 className="font-semibold mb-3">Need Help?</h3>
          <p className="text-gray-400 text-sm mb-4">
            Open a ticket in your Discord server using the support panels. Our team will respond within 24 hours.
          </p>
          <a href="https://discord.gg/ipeorg" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">
            Join IPEORG Discord Server →
          </a>
        </div>
      </div>
    </div>
  );
}
