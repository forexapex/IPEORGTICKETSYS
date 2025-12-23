# IPEORG SUPPORT - Discord Ticket Management System

![IPEORG SUPPORT](./client/public/ipeorg-badge.png)

IPEORG SUPPORT is a professional-grade Discord ticket management system that combines a powerful Discord bot with a real-time web dashboard. It features HTML transcripts, role-based claiming, and automated panel creation.

## 🚀 Quick Setup Guide

### 1. Discord Developer Portal Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications).
2. **Bot Settings**:
   - Enable **Message Content Intent**, **Server Members Intent**, and **Presence Intent**.
   - Reset/Copy your **Bot Token**.
3. **OAuth2 Settings**:
   - Add this Redirect URI: `https://YOUR_REPLIT_DOMAIN/auth/callback`
   - Copy your **Client ID** and **Client Secret**.

### 2. Environment Variables
Add these secrets in Replit (or your `.env` file):
- `DISCORD_TOKEN`: Your bot token.
- `DISCORD_CLIENT_ID`: Your application Client ID.
- `DISCORD_CLIENT_SECRET`: Your application Client Secret.
- `DATABASE_URL`: Your PostgreSQL connection string (Neon recommended).

### 3. Server Configuration (Important IDs)
The system is pre-configured for **IPEORG** with these specific IDs:
- **Staff Roles**: 8 specific roles (Admins, Moderators, etc.) have dashboard access.
- **Auto-Pin Channel**: `1439165973708935209`
- **Transcript Channel**: `1439166007263498352`

## 🛠️ Main Features

### 💻 Web Dashboard
- **Home Page**: Beautiful landing page showing system capabilities.
- **Real-time Stats**: View active, closed, and pending tickets.
- **Support Management**: Claim, close, and manage tickets directly from the web.
- **Role-Based Access**: Only users with authorized staff roles can log in.

### 🤖 Discord Bot
- **Ticket Panels**: Automated "Create Ticket" buttons in designated channels.
- **Auto-Pin**: Automatically pins new ticket channels for visibility.
- **Transcripts**: Generates professional HTML transcripts when tickets close.
- **Claim System**: Staff can claim tickets via buttons or the web dashboard.

## 📋 Full Process Workflow

1. **Deployment**: Ensure all environment variables are set.
2. **Bot Invite**: Invite the bot to your server with 'Administrator' permissions.
3. **Panel Creation**: The bot will automatically post a ticket panel in your configured channel.
4. **User Experience**: Users click a button -> A private channel is created -> Staff is notified.
5. **Staff Experience**: Staff can claim the ticket -> Assist the user -> Close when finished.
6. **Archiving**: Upon closing, a transcript is saved and sent to the logs channel and the user.

## 📁 Project Structure
- `server/bot.ts`: Discord bot logic and event handlers.
- `server/auth.ts`: Discord OAuth2 authentication and role checks.
- `client/src/pages/`: Frontend pages (Dashboard, Landing, NoAccess).
- `shared/schema.ts`: Database models for tickets, panels, and settings.

---

## ☁️ Hosting Instructions (Production)

### 1. Prerequisites (All Platforms)
- **Node.js**: Version 20 or higher.
- **PostgreSQL Database**: You need a connection string (Neon, RDS, or local).
- **Discord Bot Token**: From the Discord Developer Portal.

### 2. Linux Hosting (Ubuntu/Debian - AWS EC2 or Google Cloud)
1. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. **Clone and Install**:
   ```bash
   git clone <your-repo-url>
   cd <repo-name>
   npm install
   ```
3. **Run with PM2**:
   ```bash
   sudo npm install -g pm2
   pm2 start "npm run dev" --name "ipeorg-bot"
   pm2 save
   pm2 startup
   ```

### 3. Windows Hosting (AWS or Google Cloud)
1. Install [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/).
2. `git clone <your-repo-url>` and `npm install`.
3. Create `.env` file with secrets.
4. `npm run dev` to start.

---
*Built for professional Discord support management by IPEORG.*
🎯 High-Impact Features
1. Ticket Priority Levels
Low, Medium, High, Urgent status badges
Sort queue by priority
Visual indicators in the dashboard
2. Auto-Close Inactive Tickets
Automatically close tickets after X days of inactivity
Notify users before closing
Reopen with a single button click
3. Ticket Tags/Categories
Add custom tags (e.g., "Billing", "Bug", "Feature Request")
Filter tickets by tags in dashboard
Analytics on tag distribution
4. SLA (Service Level Agreement) Tracking
Track first response time
Track resolution time
Show SLA status in dashboard with alerts
5. Staff Performance Metrics
Average response time per staff member
Tickets handled per staff
Customer satisfaction ratings
Leaderboards
6. Customer Feedback/Rating System
After ticket closure, ask users to rate their experience
Show star ratings in transcripts
Aggregate feedback analytics
7. Bulk Operations
Close multiple tickets at once
Assign batch of tickets
Export tickets as CSV
8. Canned Replies/Quick Responses
Pre-written templates for common issues
Staff can use macros to respond faster
9. Ticket Search & Advanced Filtering
Search by keyword, user, date range
Filter by status, assignee, priority, tags
Save favorite filters
10. Ban System for Abusive Users
Prevent banned users from creating tickets
Staff can ban from Discord or dashboard
Ban list management
💡 Quick Wins (Easiest to Implement)
Priority Levels - Add status field, update UI
Auto-Close - Simple scheduled task
Tags - Add to database schema, filter UI
Search - Frontend filtering with existing data
