# IPEORG SUPPORT - Complete Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Guide](#dashboard-guide)
3. [Panel Management](#panel-management)
4. [Ticket Workflow](#ticket-workflow)
5. [Transcript Management](#transcript-management)
6. [Settings & Configuration](#settings--configuration)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Time Setup
After installation, follow these steps:

1. **Start the application**
   ```bash
   npm run dev
   ```
   Application opens at `http://localhost:5000`

2. **Complete initial configuration** in the Settings tab:
   - Enter your Discord Guild ID
   - Set ticket category IDs
   - Assign staff roles

3. **Post the first panel** to a channel:
   - Go to Panels → Create a new panel
   - The panel appears as a button in your configured channel
   - Users can click to create tickets

---

## Dashboard Guide

### Overview
The dashboard is your command center for all ticket management.

#### Statistics Section
- **Total Tickets**: All tickets (open + closed)
- **Open Tickets**: Currently active tickets awaiting resolution
- **Closed Tickets**: Resolved and archived tickets

Click on any stat to filter tickets by status.

#### Recent Tickets
- Shows latest 10 tickets
- Displays status with color coding:
  - 🟢 **Green** = Open (active)
  - 🔴 **Red** = Closed (resolved)

Click a ticket to view details, messages, and transcript.

---

## Panel Management

### What are Panels?
Panels are support categories that appear to users as clickable buttons. Each panel represents a type of support request.

### Creating a Panel

1. Go to **Panels** tab
2. Click **Create New Panel**
3. Fill in:
   ```
   Title:              "Bug Report"
   Description:        "Report a bug or technical issue"
   Emoji:              "🐛"
   Button Label:       "Report Bug"
   Support Team Role:  1439165889785364581
   ```

4. Click **Create**

### Panel Fields Explained

| Field | Description |
|-------|-------------|
| **Title** | Name shown in panel list (e.g., "General Support") |
| **Description** | Help text shown to users when selecting |
| **Emoji** | Icon for the panel (🆘, 🐛, 💳, etc.) |
| **Button Label** | Text on the button users click |
| **Support Team Role** | Discord role ID to ping when new ticket opens |
| **Created Message** | Optional message inside ticket channel |

### Example Panels

**General Support**
```
Title: General Support
Description: General help and questions
Emoji: 🆘
Support Team: @support-team
```

**Bug Report**
```
Title: Bug Report
Description: Report a bug or technical issue
Emoji: 🐛
Support Team: @developers
```

**Billing**
```
Title: Billing Support
Description: Payment and subscription issues
Emoji: 💳
Support Team: @billing-team
```

### Editing Panels
1. Go to Panels tab
2. Click the panel to edit
3. Update fields
4. Click Save

### Deleting Panels
1. Go to Panels tab
2. Click Delete button (⚠️ cannot be undone)
3. Existing tickets remain unaffected

---

## Ticket Workflow

### User Creating a Ticket

**Step 1: Find Panel**
- User sees buttons in your Discord channel
- Each button represents a support category
- User reads the description

**Step 2: Click Button**
- Clicking opens a dialog
- User selects the appropriate panel
- Ticket is created automatically

**Step 3: Private Channel**
- A new text channel is created: `#ticket-username`
- Channel is private (only user + staff can see)
- Ticket ID linked in channel topic

**Step 4: Describe Issue**
- User types their issue/question
- Includes all relevant details
- Staff notified automatically

**Step 5: Staff Response**
- Support staff joins channel
- Can see full conversation history
- Provides solution or assistance

**Step 6: Resolution**
- Issue is resolved
- Staff types `/close` or clicks "Close Ticket"
- Transcript is generated and saved

### Staff Claiming Tickets

When a ticket is created, staff can claim it:

1. Open the ticket channel
2. Click **Claim Ticket** button
3. Your name appears as ticket owner
4. Other staff know you're handling it
5. Prevents duplicate responses

### Closing Tickets

1. Go to ticket channel
2. Verify issue is resolved
3. Click **Close Ticket** button
4. Channel is archived
5. Transcript saved automatically
6. User receives transcript via DM (if enabled)

---

## Transcript Management

### What are Transcripts?
Complete records of all messages in a ticket, including:
- All user and staff messages
- Timestamps
- User mentions and reactions
- File attachments
- Edited messages

### Accessing Transcripts

1. Go to **Transcripts** tab
2. View list of all ticket transcripts
3. Search by:
   - Ticket ID
   - Username
   - Date range

### Transcript Features

**View**: Click to see full conversation
**Download**: Export as XML file
**Search**: Find specific keywords
**Export**: Save to external system

### Transcript Format (XML)
```xml
<?xml version="1.0"?>
<transcript>
  <ticket id="42" user="username" created="2024-01-01T10:00:00Z">
    <message author="username" timestamp="2024-01-01T10:05:00Z">
      My issue is...
    </message>
    <message author="staff-member" timestamp="2024-01-01T10:06:00Z">
      We'll help you with...
    </message>
  </ticket>
</transcript>
```

### Automatic Export
When a ticket closes:
1. Transcript is automatically generated
2. Saved in database with ticket
3. Sent to user via DM (if enabled)
4. Available in Transcripts tab

---

## Settings & Configuration

### Accessing Settings
Go to **Settings** tab to configure:

### Guild Configuration
| Setting | Required | Description |
|---------|----------|-------------|
| Guild ID | ✅ | Discord server ID (right-click server → Copy Server ID) |
| Category Open ID | ✅ | Channel category for new tickets |
| Category Closed ID | ⭕ | Category to archive closed tickets |
| Transcript Channel | ⭕ | Channel to post transcript links |

### Staff Permissions
| Role ID | Permission |
|---------|-----------|
| 1439165889785364581 | Can claim & close tickets |
| 1439258461769695303 | Can create panels |
| 1439165890464841799 | Can view transcripts |

Add multiple role IDs separated by commas.

### Bot Behavior
- **Auto-close after**: 7 days of no messages
- **Welcome message**: Sent when ticket opens
- **Mention on open**: Ping specific roles

### Custom Welcome Message
Set a custom message sent to every new ticket:
```
Welcome to {server_name} support!
Our team will assist you shortly.
Please describe your issue in detail.
```

**Variables**:
- `{server_name}` - Your Discord server name
- `{user}` - User's Discord name
- `{category}` - Panel/category name

---

## API Reference

### Endpoints

#### Panels
```
GET  /api/panels              - List all panels
POST /api/panels              - Create new panel
DELETE /api/panels/:id        - Delete panel
```

#### Tickets
```
GET  /api/tickets             - List all tickets
GET  /api/stats               - Get ticket statistics
```

#### Settings
```
GET  /api/settings            - Get current settings
POST /api/settings            - Update settings
```

### Request Examples

**Create Panel**
```bash
curl -X POST http://localhost:5000/api/panels \
  -H "Content-Type: application/json" \
  -d '{
    "title": "General Support",
    "description": "General help and questions",
    "emoji": "🆘",
    "supportTeamRole": "1439165889785364581"
  }'
```

**Get Stats**
```bash
curl http://localhost:5000/api/stats
```

Response:
```json
{
  "total": 42,
  "open": 5,
  "closed": 37
}
```

---

## Troubleshooting

### Issue: Bot doesn't respond to button clicks

**Solution 1**: Check bot permissions
1. Open Discord server settings
2. Go to Roles → Select bot role
3. Enable:
   - Send Messages
   - Manage Channels
   - Manage Messages

**Solution 2**: Verify bot token
1. Go to Settings tab
2. Check DISCORD_TOKEN environment variable
3. Token must be valid and not expired

### Issue: Tickets not creating

**Cause**: Bot lacks channel management permission

**Fix**:
1. Go to Discord server → roles
2. Find bot role
3. Check "Manage Channels" permission
4. Ensure bot role is higher than user roles

### Issue: Database errors

**Error**: `DATABASE_URL must be set`
- Add DATABASE_URL to `.env` or environment
- Format: `postgresql://user:pass@host:port/database`

**Error**: `Unable to connect to database`
- Verify PostgreSQL is running
- Test connection: `psql -c "SELECT 1"`
- Check username/password

### Issue: Dashboard not loading

**Check 1**: Application is running
```bash
curl http://localhost:5000
```

**Check 2**: Database is connected
- Check logs for connection errors
- Verify DATABASE_URL is set

**Check 3**: Frontend built correctly
```bash
npm run build
```

### Issue: Auto-close not working

**Solution**: Check job queue
- Auto-close runs every 24 hours
- 7-day timer resets on every message
- Manually close via dashboard if needed

---

## Performance Tips

### For Large Servers (1000+ tickets)
1. Archive old transcripts monthly
2. Set up separate channel categories:
   - Active tickets (recent)
   - Archived tickets (older)
3. Use filters in dashboard to view subsets

### Database Optimization
- Backup regularly: `pg_dump ipeorg_support > backup.sql`
- Analyze query performance
- Index frequently searched fields

### Bot Performance
- Limit panel count to 10-15
- Use role-based filtering
- Cache staff role lookups

---

## Security

### Protect Your Bot Token
- Never commit `.env` to Git
- Use environment variables only
- Rotate token if exposed
- Use bot with minimal permissions needed

### Transcript Privacy
- Transcripts stored in database (encrypted if available)
- Don't share URLs with unauthorized users
- Implement access controls on transcript endpoints

### Backup Strategy
```bash
# Weekly backup
pg_dump ipeorg_support > backup_$(date +%Y%m%d).sql

# Restore from backup
psql ipeorg_support < backup_20240101.sql
```

---

## Contacting Support

For issues not covered here:
1. Check application logs
2. Review Discord bot permissions
3. Verify environment variables
4. Check database connectivity

---

**Last Updated**: January 2025
**Version**: 1.0.0
