import { Button } from "@/components/ui/button";
import { ShieldAlert, PlusCircle, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function NoAccess() {
  const [, setLocation] = useLocation();
  const botInviteLink = "https://discord.com/oauth2/authorize?client_id=1451587499469176914&permissions=8&integration_type=0&scope=bot";

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-orange-900/10 pointer-events-none" />
      
      <div className="max-w-2xl w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm relative z-10 text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Access Restricted</h1>
          <p className="text-zinc-400 text-lg">
            It looks like you don't have permission to access the dashboard or the bot isn't in your server yet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-4">
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 space-y-2">
            <h3 className="font-semibold text-blue-400">Step 1: Invite Bot</h3>
            <p className="text-sm text-zinc-400">
              Ensure the IPEORG SUPPORT bot is invited to your server with Administrator permissions.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 space-y-2">
            <h3 className="font-semibold text-orange-400">Step 2: Assign Role</h3>
            <p className="text-sm text-zinc-400">
              You must have one of the authorized Staff Roles to access the admin dashboard.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <a href={botInviteLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg group">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Bot to Server
            </Button>
          </a>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 py-6 text-lg"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Switch Account
          </Button>
        </div>

        <p className="text-sm text-zinc-500">
          Need help? Contact the organization administrator or join our support Discord.
        </p>
      </div>
    </div>
  );
}
