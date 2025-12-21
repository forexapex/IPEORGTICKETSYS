
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Settings table for bot configuration
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  guildId: text("guild_id").notNull(),
  transcriptChannelId: text("transcript_channel_id"),
  categoryOpenId: text("category_open_id"),
  categoryClosedId: text("category_closed_id"),
  staffRoles: jsonb("staff_roles").$type<string[]>().default([]),
  welcomeMessage: text("welcome_message").default("Please be patient, staff will help you soon."),
  panelChannelId: text("panel_channel_id"), // Channel for ticket panels
  lastPanelMessageId: text("last_panel_message_id"), // Last posted panel message ID
});

// Ticket Panels (categories shown to users)
export const panels = pgTable("panels", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji"),
  buttonLabel: text("button_label").default("Open Ticket"),
  supportTeamRole: text("support_team_role"), // Role ID to ping
  createdMessage: text("created_message"), // Message inside the ticket
});

// Tickets
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  panelId: integer("panel_id").references(() => panels.id),
  channelId: text("channel_id").notNull(), // Discord Channel ID
  creatorId: text("creator_id").notNull(), // Discord User ID
  claimerId: text("claimer_id"), // Discord User ID of staff
  status: text("status").notNull().default("open"), // open, closed
  createdAt: timestamp("created_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

// Transcripts
export const transcripts = pgTable("transcripts", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id"),
  channelId: text("channel_id"),
  content: jsonb("content").$type<any[]>(), // Array of message objects
  htmlUrl: text("html_url"), // URL if hosted externally (optional)
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertPanelSchema = createInsertSchema(panels).omit({ id: true });
export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });
export const insertTicketSchema = createInsertSchema(tickets).omit({ id: true, createdAt: true, closedAt: true });

// Types
export type Panel = typeof panels.$inferSelect;
export type InsertPanel = z.infer<typeof insertPanelSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type Settings = typeof settings.$inferSelect;
