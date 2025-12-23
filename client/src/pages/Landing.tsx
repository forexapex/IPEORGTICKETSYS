import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, FileText, Users, ChevronDown } from "lucide-react";

export default function Landing() {
  const botInviteLink = "https://discord.com/oauth2/authorize?client_id=1451587499469176914&permissions=8&integration_type=0&scope=bot";
  
  const handleLogin = () => {
    const clientId = "1451587499469176914";
    // Using a more robust way to get the origin
    const origin = window.location.origin;
    const redirectUri = encodeURIComponent(`${origin}/auth/callback`);
    const scope = encodeURIComponent("identify guilds");
    // Ensure the URL is clean and correct
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    console.log("Redirect URI being sent:", `${origin}/auth/callback`);
    window.open(discordAuthUrl, "_blank", "width=500,height=800");
  };

  const scrollToFeatures = () => {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-orange-900/20 pointer-events-none" />
      
      {/* Header Navigation */}
      <header className="relative z-20 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/ipeorg-badge.png" alt="IPEORG" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-lg">IPEORG SUPPORT</span>
          </div>
          <a href={botInviteLink} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Add Bot
            </Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-blue-400 text-sm font-semibold">System Operational</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-7xl font-bold leading-tight">
                <span className="block text-white">Professional</span>
                <span className="block bg-gradient-to-r from-blue-400 via-orange-400 to-green-400 bg-clip-text text-transparent">Support</span>
                <span className="block text-gray-300">Management</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                Enterprise-grade Discord ticket system for IPEORG. Manage support efficiently with automated workflows, real-time tracking, and comprehensive analytics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <div className="flex-1">
                <Button size="lg" onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-base font-semibold group">
                  Login with Discord
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <a href={botInviteLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="lg" variant="outline" className="w-full border-blue-500/30 text-white hover:bg-blue-500/10 text-base font-semibold">
                  Add to Discord
                  <span className="ml-2">↗</span>
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                24/7 Uptime
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Discord Native
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Secure & Fast
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* Animated rings */}
              <div className="absolute w-64 h-64 border border-blue-500/20 rounded-full animate-pulse" />
              <div className="absolute w-48 h-48 border border-orange-500/20 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
              
              {/* Badge */}
              <div className="relative z-10">
                <img 
                  src="/ipeorg-badge.png" 
                  alt="IPEORG SUPPORT" 
                  className="w-64 h-64 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-8 animate-bounce">
          <button 
            onClick={scrollToFeatures}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to manage support tickets efficiently and professionally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ticket Panels</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Create unlimited support categories with custom forms and automatic team assignments
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Dashboard</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Real-time ticket analytics and status monitoring with beautiful visualizations
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-xl border border-gray-700 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transcripts</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Complete searchable records of all interactions with XML export and archival
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Management</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Role-based permissions, support teams, and intelligent ticket routing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to improve your support?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join IPEORG in providing world-class support to your community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 px-8">
              Get Started
            </Button>
            <a href="https://discord.gg/ipeorg" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-gray-600 px-8">
                Join Discord Server
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">IPEORG SUPPORT</h4>
              <p className="text-gray-400 text-sm">Professional Discord ticket management system</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/README.md" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://discord.gg/ipeorg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 IPEORG Support. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="https://discord.gg/ipeorg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
              <a href="https://twitter.com/ipeorg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
