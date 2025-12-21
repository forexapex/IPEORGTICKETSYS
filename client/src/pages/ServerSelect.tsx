import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader } from "lucide-react";

interface Server {
  id: string;
  name: string;
  icon?: string;
  isAdmin: boolean;
}

export default function ServerSelect() {
  const [location, navigate] = useLocation();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user's servers where bot is installed
    const mockServers: Server[] = [
      {
        id: "1439165596725022753",
        name: "IPEORG Main Server",
        icon: "https://discord.com/api/guilds/1439165596725022753/widget.json",
        isAdmin: true,
      },
      {
        id: "server2",
        name: "Community Hub",
        isAdmin: false,
      },
    ];
    
    setTimeout(() => {
      setServers(mockServers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSelectServer = (serverId: string, isAdmin: boolean) => {
    localStorage.setItem("selectedServerId", serverId);
    localStorage.setItem("isAdmin", isAdmin.toString());
    navigate(isAdmin ? "/admin" : "/user");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <img src="/ipeorg-badge.png" alt="IPEORG" className="w-10 h-10 rounded-lg" />
            <h1 className="text-3xl font-bold">IPEORG SUPPORT</h1>
          </div>
          <p className="text-gray-400">Select a server to continue</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {servers.map((server) => (
              <Card
                key={server.id}
                className="p-6 bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
                onClick={() => handleSelectServer(server.id, server.isAdmin)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-green-400 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{server.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                      <p className="text-sm text-gray-400">
                        {server.isAdmin ? "🔒 Admin Panel" : "👤 User Panel"}
                      </p>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Access →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-4">Don't see your server?</p>
          <a href="https://discord.com/oauth2/authorize?client_id=1451587499469176914&permissions=8&integration_type=0&scope=bot" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-white/10 w-full">
              Add Bot to Another Server
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
