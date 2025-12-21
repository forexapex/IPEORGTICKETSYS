
import { db } from "./db";
import {
  panels, tickets, settings,
  type InsertPanel, type InsertTicket, type Settings, type InsertPanel as InsertSettings // reusing type for now
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Panels
  getPanels(): Promise<typeof panels.$inferSelect[]>;
  createPanel(panel: InsertPanel): Promise<typeof panels.$inferSelect>;
  deletePanel(id: number): Promise<void>;
  getPanel(id: number): Promise<typeof panels.$inferSelect | undefined>;

  // Tickets
  getTickets(): Promise<typeof tickets.$inferSelect[]>;
  createTicket(ticket: InsertTicket): Promise<typeof tickets.$inferSelect>;
  updateTicketStatus(id: number, status: string): Promise<typeof tickets.$inferSelect | undefined>;
  getTicketByChannelId(channelId: string): Promise<typeof tickets.$inferSelect | undefined>;

  // Settings
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<Settings>): Promise<Settings>;
}

export class DatabaseStorage implements IStorage {
  async getPanels() {
    return await db.select().from(panels);
  }

  async createPanel(panel: InsertPanel) {
    const [newPanel] = await db.insert(panels).values(panel).returning();
    return newPanel;
  }

  async deletePanel(id: number) {
    await db.delete(panels).where(eq(panels.id, id));
  }

  async getPanel(id: number) {
    const [panel] = await db.select().from(panels).where(eq(panels.id, id));
    return panel;
  }

  async getTickets() {
    return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }

  async createTicket(ticket: InsertTicket) {
    const [newTicket] = await db.insert(tickets).values(ticket).returning();
    return newTicket;
  }

  async updateTicketStatus(id: number, status: string) {
    const [updated] = await db.update(tickets)
      .set({ status, closedAt: status === 'closed' ? new Date() : undefined })
      .where(eq(tickets.id, id))
      .returning();
    return updated;
  }

  async getTicketByChannelId(channelId: string) {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.channelId, channelId));
    return ticket;
  }

  async getSettings() {
    const [s] = await db.select().from(settings).limit(1);
    return s;
  }

  async updateSettings(newSettings: Partial<Settings>) {
    try {
      const existing = await this.getSettings();
      if (existing) {
        const [updated] = await db.update(settings)
          .set(newSettings)
          .where(eq(settings.id, existing.id))
          .returning();
        return updated;
      } else {
        // Create default if not exists
        const defaultSettings = {
          guildId: newSettings.guildId || "",
          transcriptChannelId: newSettings.transcriptChannelId,
          categoryOpenId: newSettings.categoryOpenId,
          categoryClosedId: newSettings.categoryClosedId,
          staffRoles: newSettings.staffRoles || [],
          welcomeMessage: newSettings.welcomeMessage || "",
        };
        const [created] = await db.insert(settings).values(defaultSettings).returning();
        return created;
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      throw new Error("Failed to update settings");
    }
  }
}

export const storage = new DatabaseStorage();
