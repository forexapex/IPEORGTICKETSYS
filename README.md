# IPEORG SUPPORT - Discord Ticket Management System

![IPEORG SUPPORT](./client/public/ipeorg-badge.png)

A comprehensive support ticket management system for Discord servers with a full-featured dashboard, automated transcript generation, and team collaboration tools.

## Features

✨ **Ticket Management**
- Multiple ticket panels with custom categories
- Automatic ticket channel creation
- Ticket claiming system for staff
- Auto-close tickets after 7 days of inactivity

📊 **Dashboard**
- Real-time ticket statistics (Total, Open, Closed)
- Manage support panels and categories
- View ticket history and transcripts
- Staff role permissions

📝 **Transcripts & Logging**
- Complete message transcripts for every ticket
- Searchable transcript history
- Automatic XML export when tickets close
- Send transcripts to users via DM

👥 **Team Features**
- Multi-language support ready
- Custom support teams per panel
- Role-based permissions
- Staff claiming and assignment

🔧 **Easy Configuration**
- Intuitive web dashboard
- Custom ticket messages
- Emoji support for panels
- Support team role assignment

## Installation

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org)
- **PostgreSQL Database** - [Use Replit Database](https://replit.com) or [Local PostgreSQL](https://www.postgresql.org/download/)
- **Discord Bot Token** - [Create bot on Discord Developer Portal](https://discord.com/developers/applications)
- **Discord Server** - For testing the bot

### Windows Installation

#### 1. Install Node.js
1. Download from https://nodejs.org (LTS recommended)
2. Run the installer and follow the setup wizard
3. Check `Add to PATH` during installation
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### 2. Download & Setup Project
1. Download this project as ZIP or clone with Git
2. Extract the ZIP file to a folder (e.g., `C:\ipeorg-support`)
3. Open Command Prompt and navigate to the folder:
   ```cmd
   cd C:\ipeorg-support
   ```
4. Install dependencies:
   ```cmd
   npm install
   ```

#### 3. Configure Discord Bot
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it "IPEORG SUPPORT"
3. Go to "Bot" tab and click "Add Bot"
4. Copy the token (keep it secret!)
5. Go to "OAuth2" → "URL Generator"
6. Select scopes: `bot`
7. Select permissions:
   - Manage Channels
   - Manage Messages
   - Read Messages/View Channels
   - Send Messages
   - Embed Links
8. Copy the generated URL and open in browser to invite bot to your server

#### 4. Setup Database
- **Option A: Using Replit** (Easiest)
  - Replit databases are auto-configured
  
- **Option B: Local PostgreSQL**
  1. Install PostgreSQL from https://www.postgresql.org/download/windows/
  2. Create a new database:
     ```cmd
     psql -U postgres
     CREATE DATABASE ipeorg_support;
     \q
     ```
  3. Create `.env` file in project root with:
     ```
     DATABASE_URL=postgresql://postgres:password@localhost:5432/ipeorg_support
     DISCORD_TOKEN=your_bot_token_here
     ```

#### 5. Run the Application
```cmd
npm run dev
```

The application will start at `http://localhost:5000`

---

### Linux Installation

#### 1. Install Node.js
```bash
# Using apt (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### 2. Download & Setup Project
```bash
# Clone or download the project
cd ~/projects
wget https://your-project-url.zip
unzip project.zip
cd ipeorg-support

# Install dependencies
npm install
```

#### 3. Configure Discord Bot
Same as Windows steps 1-8 above.

#### 4. Setup Database
```bash
# Option A: PostgreSQL Local
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE ipeorg_support;
CREATE USER ipeorg WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE ipeorg_support TO ipeorg;
\q

# Create .env file
echo "DATABASE_URL=postgresql://ipeorg:yourpassword@localhost:5432/ipeorg_support" > .env
echo "DISCORD_TOKEN=your_bot_token_here" >> .env
```

#### 5. Run the Application
```bash
npm run dev
```

Access at `http://localhost:5000`

---

## Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Required - Your Discord Bot Token
DISCORD_TOKEN=your_bot_token_here

# Database URL (auto-set on Replit)
DATABASE_URL=postgresql://user:password@host:5432/database

# Optional
DISCORD_GUILD_ID=your_server_id
TRANSCRIPT_CHANNEL_ID=channel_id_for_transcripts
```

### First Run Setup
1. Start the application
2. Open http://localhost:5000
3. Go to **Settings** tab
4. Fill in:
   - **Guild ID**: Your Discord server ID
   - **Category Open ID**: Channel ID for open tickets
   - **Category Closed ID**: Channel ID for closed tickets
   - **Transcript Channel ID**: Where to save transcripts
   - **Staff Roles**: Comma-separated Discord role IDs

---

## Usage

### For Users (Creating Tickets)
1. Go to your Discord server
2. Look for ticket panels (buttons)
3. Click a panel that matches your issue
4. A private channel is created automatically
5. Describe your issue
6. Staff will respond and help resolve

### For Staff (Managing Tickets)
1. Open IPEORG SUPPORT Dashboard
2. **Dashboard**: View ticket stats at a glance
3. **Panels**: Create/edit support categories
   - Title: Category name (e.g., "Bug Report")
   - Description: Help text for users
   - Support Team: Role to notify
4. **Tickets**: Monitor all tickets
   - Click to view details
   - Assign staff member (Claim)
   - Close when resolved
5. **Transcripts**: View chat history
   - Searchable
   - Export as XML
6. **Settings**: Configure bot behavior

### Dashboard Pages

#### Dashboard
- Overview of ticket statistics
- Quick access to recent tickets
- Server health status

#### Panels
Create support categories:
```
Title: General Support
Description: General help and questions
Emoji: 🆘
Support Team: @support-role
```

#### Tickets
Real-time ticket management:
- View open/closed tickets
- Filter by status
- Quick actions (claim, close, view)

#### Settings
Bot configuration:
- Guild/Server ID
- Channel IDs for categories
- Staff role IDs (separate with commas)
- Welcome message

#### Transcripts
Access ticket history:
- Search by ticket ID or user
- View message transcripts
- Download as XML
- Auto-export on close

---

## Ticket Workflow

### User Journey
1. **User finds panel** → Clicks "Open Ticket" button
2. **Channel created** → Private ticket channel with user + staff
3. **Bot message** → Welcome message from bot
4. **Discussion** → User describes issue, staff responds
5. **Resolution** → Staff marks ticket as claimed and resolved
6. **Closure** → Channel closes, transcript saved
7. **Feedback** → Optional user feedback on service

### Staff Journey
1. **Notification** → Alerted when new ticket opens
2. **Claim ticket** → Click "Claim" to take ownership
3. **Assist user** → Discuss and resolve issue
4. **Close ticket** → Click "Close Ticket"
5. **Transcript** → Automatically saved and available
6. **Review** → Check transcript and stats

---

## Advanced Features

### Auto-Close Tickets
Tickets automatically close after 7 days with no messages.

### Transcript Export
Tickets generate XML transcripts containing:
- All messages
- Timestamps
- User/Staff mentions
- Reactions and edits

### Role Permissions
Configure which roles can:
- View dashboard
- Manage panels
- Close tickets
- Access transcripts

### Custom Messages
Set custom welcome messages for each panel:
```
"Hi {{user}}, our team will assist you shortly. 
Please describe your issue in detail."
```

---

## Troubleshooting

### Bot Not Appearing
- Check Discord bot token in `.env`
- Verify bot has been invited to server
- Check bot permissions on Discord Developer Portal

### Database Connection Error
```
Error: DATABASE_URL must be set
```
- Set DATABASE_URL environment variable
- Verify PostgreSQL is running
- Check connection string format

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
- Kill process on port 5000: `lsof -ti:5000 | xargs kill -9` (Linux)
- Or change port in `server/index.ts`

### Tickets Not Creating
- Verify bot has "Manage Channels" permission
- Check category IDs are correct in Settings
- Ensure bot role is high enough in Discord

---

## Support

Need help? 
- Check the **DOCUMENTATION.md** for detailed guides
- Review Discord bot permissions
- Verify all environment variables are set

---

## License

Created for IPEORG (India Premier Esports Organization)

---

## Technical Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Discord**: discord.js v14
- **Real-time**: WebSocket support
- **UI**: Shadcn/ui components
