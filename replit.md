# IPEORG SUPPORT - Discord Ticket Management System

## Overview

IPEORG SUPPORT is a comprehensive Discord ticket management system that combines a Discord bot with a full-featured web dashboard. The system enables Discord servers to manage support tickets through automated panel creation, ticket workflows, HTML transcript generation, and team collaboration tools. Users interact with ticket panels in Discord to create support channels, while staff manage everything through a React-based admin dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for Replit development
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching
- **Styling**: Tailwind CSS with custom Discord-inspired dark theme
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

The frontend follows a page-based structure under `client/src/pages/` with shared components in `client/src/components/`. Custom hooks in `client/src/hooks/` abstract API interactions (panels, tickets, settings).

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **Entry Point**: `server/index.ts` creates HTTP server and registers routes
- **API Structure**: RESTful endpoints defined in `server/routes.ts`
- **Shared Types**: Route definitions and schemas in `shared/routes.ts` for type-safe API contracts

The server handles both the web dashboard API and Discord bot integration from a single process.

### Discord Bot Integration
- **Library**: discord.js v14
- **Features**: Ticket panels, auto-pinning, transcript generation, role-based claiming
- **Bot Code**: `server/bot.ts` (integrated) and `bot.js` (standalone entry point)
- **Event Handling**: Button interactions for ticket creation, select menus for categories
- **Auto-Reconnection**: Handles session invalidation and reconnects automatically

### Data Storage
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts`
- **Tables**: 
  - `settings` - Bot configuration (guild ID, channel IDs, staff roles)
  - `panels` - Ticket panel definitions (title, description, emoji, messages)
  - `tickets` - Active/closed tickets (channel ID, creator, claimer, status)
  - `transcripts` - Archived message content and HTML URLs

### Authentication
- **Method**: Simple session-based auth with admin whitelist
- **Location**: `server/auth.ts`
- **Admin Control**: Hardcoded admin user IDs with full access
- **Sessions**: In-memory storage with 7-day expiration

### Build System
- **Development**: `npm run dev` runs TypeScript via tsx
- **Production**: `npm run build` uses esbuild for server bundling, Vite for client
- **Database Migrations**: `npm run db:push` using drizzle-kit

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **Provider**: Neon serverless recommended (uses WebSocket connections)

### Discord API
- **Bot Token**: Required via `DISCORD_TOKEN` environment variable
- **OAuth**: Client ID `1451587499469176914` for bot invites
- **Permissions**: Administrator (8) for full functionality
- **Required Intents**: Guilds, GuildMessages, MessageContent, GuildMembers

### Key NPM Packages
- `discord.js` - Discord bot framework
- `drizzle-orm` + `@neondatabase/serverless` - Database access
- `express` - HTTP server
- `@tanstack/react-query` - Client-side data fetching
- `zod` - Runtime type validation
- Various `@radix-ui/*` packages - UI primitives for shadcn/ui

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `DISCORD_TOKEN` - Discord bot token
- `NODE_ENV` - Set to "production" for production builds