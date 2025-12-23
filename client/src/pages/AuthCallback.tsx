import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      alert("No authentication code received from Discord.");
      setLocation("/");
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await fetch(`/auth/callback?code=${code}`);
        const data = await response.json();

        if (data.success) {
          window.location.href = data.redirect;
        } else {
          alert(`Login failed: ${data.error || "Unknown error"}`);
          setLocation("/");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        alert("Authentication failed. Please try again.");
        setLocation("/");
      }
    };

    exchangeCode();
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xl font-medium">Authenticating with Discord...</p>
      </div>
    </div>
  );
}
