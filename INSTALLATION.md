# IPEORG SUPPORT - Installation Guide

## Quick Links
- **Full Documentation**: See [README.md](./README.md) for complete feature list
- **Usage Guide**: See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed usage
- **Project**: IPEORG Support Discord Ticket Management System

---

## Windows Installation (Step by Step)

### Step 1: Install Node.js
1. Go to https://nodejs.org
2. Download **LTS version** (recommended)
3. Run installer (accept all defaults)
4. Check "Add to PATH" if not already checked
5. Restart your computer

**Verify installation**:
```cmd
node --version
npm --version
```

### Step 2: Get the Project
**Option A: Download ZIP**
1. Download project ZIP
2. Extract to a folder: `C:\Users\YourName\ipeorg-support`

**Option B: Use Git**
1. Install Git: https://git-scm.com/download/win
2. Open Command Prompt
3. Run: `git clone <repository-url>`

### Step 3: Install Dependencies
1. Open Command Prompt
2. Navigate to project folder:
   ```cmd
   cd C:\Users\YourName\ipeorg-support
   ```
3. Install packages:
   ```cmd
   npm install
   ```
   (This takes 2-3 minutes)

### Step 4: Discord Bot Setup
1. Go to https://discord.com/developers/applications
2. Click **"New Application"**
3. Name it: **IPEORG SUPPORT**
4. Go to **"Bot"** tab → Click **"Add Bot"**
5. Under **TOKEN**, click **"Copy"** (keep secret!)
6. Go to **OAuth2** → **URL Generator**
7. Select:
   - **Scopes**: `bot`
   - **Permissions**: 
     - ✅ Manage Channels
     - ✅ Manage Messages
     - ✅ Read Messages
     - ✅ Send Messages
     - ✅ Embed Links
8. Copy the URL and open in browser
9. Select your server and authorize

### Step 5: Configure Database

**Easiest Option (Recommended): Use Online Database**
1. Go to https://www.elephantsql.com (free tier)
2. Sign up
3. Create a database
4. Copy connection URL

**Local Option: Install PostgreSQL**
1. Download: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Note username (default: `postgres`) and password

### Step 6: Create .env File
1. Open Notepad
2. Paste this:
   ```
   DISCORD_TOKEN=your_bot_token_here
   DATABASE_URL=postgresql://user:password@localhost:5432/ipeorg_support
   ```
3. Save as `.env` in project folder
4. **IMPORTANT**: Don't share this file!

### Step 7: Run Application
1. Open Command Prompt
2. Navigate to project: `cd C:\...\ipeorg-support`
3. Start app:
   ```cmd
   npm run dev
   ```
4. Open: http://localhost:5000
5. Complete settings in the app

---

## Linux Installation (Ubuntu/Debian)

### Step 1: Update System
```bash
sudo apt update
sudo apt upgrade
```

### Step 2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify**:
```bash
node --version
npm --version
```

### Step 3: Clone Project
```bash
cd ~
git clone <repository-url>
cd ipeorg-support
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Discord Bot Setup
Same as Windows (Steps 1-9)

### Step 6: Install PostgreSQL
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Create database**:
```bash
sudo -u postgres psql
CREATE DATABASE ipeorg_support;
CREATE USER ipeorg WITH PASSWORD 'securepassword123';
GRANT ALL PRIVILEGES ON DATABASE ipeorg_support TO ipeorg;
\q
```

### Step 7: Create .env File
```bash
nano .env
```

Paste:
```
DISCORD_TOKEN=your_bot_token_here
DATABASE_URL=postgresql://ipeorg:securepassword123@localhost:5432/ipeorg_support
```

Press `Ctrl+X` → `Y` → `Enter` to save

### Step 8: Run Application
```bash
npm run dev
```

Open: http://localhost:5000

---

## Mac Installation

### Step 1: Install Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Node.js
```bash
brew install node
```

### Step 3: Get Project
```bash
git clone <repository-url>
cd ipeorg-support
npm install
```

### Step 4: Install PostgreSQL
```bash
brew install postgresql
brew services start postgresql
```

**Create database**:
```bash
createdb ipeorg_support
```

### Step 5: Create .env
```bash
echo "DISCORD_TOKEN=your_token" > .env
echo "DATABASE_URL=postgresql://localhost/ipeorg_support" >> .env
```

### Step 6: Run
```bash
npm run dev
```

---

## Troubleshooting Installation

### "npm: command not found"
- Node.js not installed correctly
- Restart your computer after installation
- Reinstall Node.js

### "DATABASE_URL must be set"
- Create `.env` file (see Step 6 above)
- Verify DATABASE_URL is correct
- Don't use quotes around URL

### "Port 5000 already in use"
1. Kill process:
   - **Windows**: `netstat -ano | findstr :5000`
   - **Linux/Mac**: `lsof -i :5000`
2. Or edit `server/index.ts` and change port

### "Bot doesn't appear in Discord"
1. Check Discord token in `.env` is correct
2. Make sure bot was invited to your server
3. Check bot role position (must be high in role list)

### "Database connection failed"
- **Windows**: Check PostgreSQL is running (Services)
- **Linux**: `sudo systemctl status postgresql`
- **Verify credentials** in .env file

---

## Next Steps

1. **Read full docs**: Open DOCUMENTATION.md
2. **Create first panel**: Go to http://localhost:5000 → Panels
3. **Configure settings**: Fill in Discord IDs
4. **Post panel to Discord**: Button will appear in your server
5. **Test**: Create a test ticket

---

## Getting Help

1. Check DOCUMENTATION.md for detailed guides
2. Verify Discord permissions on bot
3. Check `.env` file has correct credentials
4. Read troubleshooting section above
5. Check application logs (in terminal)

---

## Useful Commands

### Restart Application
```bash
npm run dev
```

### Stop Application
Press `Ctrl+C`

### Reset Database (Be Careful!)
```bash
psql ipeorg_support
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS panels;
\q
npm run dev
```

### View Database
```bash
psql ipeorg_support
\dt        # Show tables
\q         # Exit
```

---

## Security Notes

⚠️ **Keep your `.env` file private!**
- Never commit to Git
- Never share bot token
- Don't post screenshots with token visible

✅ **Best practices**:
- Use strong database password
- Regularly backup database
- Keep bot token rotated
- Use secure hosting if deploying

---

**Installation Complete!** 🎉

Proceed to [DOCUMENTATION.md](./DOCUMENTATION.md) for usage instructions.
