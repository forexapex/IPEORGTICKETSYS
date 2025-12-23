
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { startBot } from "./bot";
import { createSession, isUserAdmin } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth callback endpoint
  app.get("/auth/callback", async (req, res) => {
    try {
      const code = req.query.code as string;
      if (!code) {
        return res.status(400).json({ success: false, error: "No auth code provided" });
      }

      const params = new URLSearchParams();
      params.append('client_id', process.env.DISCORD_CLIENT_ID!);
      params.append('client_secret', process.env.DISCORD_CLIENT_SECRET!);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      // Force HTTPS for redirect_uri in production to match Discord settings
      const origin = process.env.NODE_ENV === 'production' 
        ? `https://${req.get('host')}` 
        : `${req.protocol}://${req.get('host')}`;
      const redirectUri = `${origin}/auth/callback`;
      params.append('redirect_uri', redirectUri);

      console.log("Token exchange redirect_uri:", redirectUri);

      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const tokenData = await tokenResponse.json() as any;
      if (!tokenResponse.ok) {
        console.error("❌ Token exchange failed:", tokenData);
        return res.status(500).json({ success: false, error: "Token exchange failed" });
      }

      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });

      const userData = await userResponse.json() as any;
      if (!userResponse.ok) {
        return res.status(500).json({ success: false, error: "Failed to fetch user data" });
      }

      const userId = userData.id;
      const guildId = "1439165596725022753"; // Default guild ID
      
      const isAdmin = isUserAdmin(userId);
      const sessionId = createSession(userId, guildId, isAdmin);
      
      res.cookie("session_id", sessionId, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
      });

      console.log(`✅ User ${userId} authenticated as ${isAdmin ? 'admin' : 'user'}`);
      
      return res.status(200).json({ 
        success: true, 
        redirect: isAdmin ? "/admin" : "/no-access",
        isAdmin,
        sessionId
      });
    } catch (error) {
      console.error("❌ Auth callback error:", error);
      return res.status(500).json({ success: false, error: "Authentication failed" });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    res.clearCookie("session_id");
    res.json({ success: true });
  });

  // Panels
  app.get(api.panels.list.path, async (req, res) => {
    const panels = await storage.getPanels();
    res.json(panels);
  });

  app.post(api.panels.create.path, async (req, res) => {
    try {
      const input = api.panels.create.input.parse(req.body);
      const panel = await storage.createPanel(input);
      res.status(201).json(panel);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.panels.delete.path, async (req, res) => {
    await storage.deletePanel(Number(req.params.id));
    res.status(204).send();
  });

  // Tickets
  app.get(api.tickets.list.path, async (req, res) => {
    const tickets = await storage.getTickets();
    res.json(tickets);
  });

  app.get(api.tickets.stats.path, async (req, res) => {
    const tickets = await storage.getTickets();
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    res.json({ total, open, closed });
  });

  app.patch("/api/tickets/:id/priority", async (req, res) => {
    try {
      const { priority } = req.body;
      const validPriorities = ["low", "medium", "high", "urgent"];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: "Invalid priority level" });
      }
      const ticket = await storage.updateTicketPriority(Number(req.params.id), priority);
      res.json(ticket);
    } catch (err) {
      res.status(400).json({ message: "Failed to update priority" });
    }
  });

  // Settings
  app.get(api.settings.get.path, async (req, res) => {
    const settings = await storage.getSettings();
    res.json(settings || {});
  });

  app.post(api.settings.update.path, async (req, res) => {
    const updated = await storage.updateSettings(req.body);
    res.json(updated);
  });

  // Start the Discord Bot
  // Initialize with the token provided by user or env
  try {
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      console.warn("DISCORD_TOKEN not set - bot will not start. Set it in your .env file");
    } else {
      await startBot(token);
      console.log("Discord bot started successfully");
    }
  } catch (error) {
    console.error("Failed to start Discord bot:", error);
  }

  // Seed default data - ensure all 4 categories exist
  const existingPanels = await storage.getPanels();
  const defaultPanels = [
    {
      title: "General Support",
      description: "General help and questions",
      emoji: "💬",
      buttonLabel: "Open Ticket",
      supportTeamRole: "1439165889785364581"
    },
    {
      title: "Bug Report",
      description: "Report a bug or issue",
      emoji: "🐛",
      buttonLabel: "Open Ticket",
      supportTeamRole: "1439165889785364581"
    },
    {
      title: "Billing Support",
      description: "Billing related questions",
      emoji: "💳",
      buttonLabel: "Open Ticket",
      supportTeamRole: "1439165889785364581"
    },
    {
      title: "Report",
      description: "Report a problem or complaint",
      emoji: "⚠️",
      buttonLabel: "Open Ticket",
      supportTeamRole: "1439165889785364581"
    }
  ];
  
  for (const panel of defaultPanels) {
    const exists = existingPanels.some(p => p.title === panel.title);
    if (!exists) {
      await storage.createPanel(panel);
      console.log(`Created panel: ${panel.title}`);
    }
  }

  // Ensure ticket channel is configured
  const settings = await storage.getSettings();
  if (!settings?.categoryOpenId) {
    await storage.updateSettings({
      categoryOpenId: "1439165921863405763"
    });
    console.log("✅ Configured ticket channel: 1439165921863405763");
  }

  return httpServer;
}
