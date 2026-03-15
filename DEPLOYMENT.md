# Vanto CRM — Deployment Guide

Complete guide to deploying Vanto CRM to your own infrastructure.

## Overview

Vanto CRM is a WhatsApp AI CRM for MLM & APLGO Associates. This guide covers:

1. Setting up your own Supabase project
2. Deploying the web app to Vercel
3. Configuring the Chrome Extension
4. Setting up Twilio WhatsApp Business API

---

## Prerequisites

- [Supabase Account](https://supabase.com) (free tier works)
- [Vercel Account](https://vercel.com) (free tier works)
- [GitHub Account](https://github.com)
- Twilio Account with WhatsApp Business API (optional, for WhatsApp features)

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your **Project URL** and **anon/public key** from Settings → API
3. Run the database migrations from the `supabase/migrations` folder:

```sql
-- Run migrations in order in the SQL Editor
-- Or use the Supabase CLI: supabase db push
```

### Required Database Tables

The following tables will be created by migrations:
- `profiles` — User profiles
- `contacts` — Contact/lead database
- `conversations` — WhatsApp conversations
- `messages` — Chat messages
- `whatsapp_groups` — Captured WhatsApp groups
- `scheduled_group_posts` — Group campaign scheduler
- `knowledge_files` — Knowledge Vault documents
- `knowledge_chunks` — Searchable text chunks
- `auto_reply_events` — Auto-reply logs
- `integration_settings` — App settings

### Enable Row Level Security (RLS)

RLS policies are included in migrations. Ensure they're enabled for all tables.

---

## Step 2: Deploy Edge Functions

Deploy the Supabase Edge Functions:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy whatsapp-auto-reply
supabase functions deploy knowledge-search
supabase functions deploy knowledge-ingest
supabase functions deploy send-message
supabase functions deploy upsert-whatsapp-contact
# ... deploy other functions as needed
```

### Set Environment Variables

In Supabase Dashboard → Edge Functions → Settings:

```
LOVABLE_API_KEY=your-lovable-api-key  # For AI auto-reply
```

---

## Step 3: Deploy to Vercel

### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/vanto-crm)

### Option B: Manual Deploy

1. Push this repository to GitHub

2. In Vercel, import the repository

3. Set environment variables:
   - `VITE_SUPABASE_URL` — Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — Your Supabase anon key

4. Deploy!

### Environment Variables for Vercel

```
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## Step 4: Configure Chrome Extension

### Windows (PowerShell)

```powershell
cd public/chrome-extension
.\setup.ps1 -SupabaseUrl "https://yourproject.supabase.co" -SupabaseAnonKey "eyJhbG..." -DashboardUrl "https://yourdomain.com"
```

### Mac/Linux (Bash)

```bash
cd public/chrome-extension
chmod +x setup.sh
./setup.sh "https://yourproject.supabase.co" "eyJhbG..." "https://yourdomain.com"
```

### Manual Configuration

1. Edit `public/chrome-extension/config.js`:
   ```javascript
   var VANTO_CONFIG = {
     SUPABASE_URL: 'https://yourproject.supabase.co',
     SUPABASE_ANON_KEY: 'your-anon-key',
     DASHBOARD_URL: 'https://yourdomain.com',
     VERSION: '5.1.0'
   };
   ```

2. Edit `public/chrome-extension/manifest.json`:
   - Update `host_permissions` to include your Supabase URL

### Install Extension

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `public/chrome-extension` folder

---

## Step 5: Configure Twilio WhatsApp (Optional)

### Twilio Webhook Setup

1. In Twilio Console → Messaging → Settings
2. Set the webhook URL for incoming messages:
   ```
   https://yourproject.supabase.co/functions/v1/twilio-whatsapp-inbound
   ```

3. Set the status callback URL:
   ```
   https://yourproject.supabase.co/functions/v1/twilio-whatsapp-status
   ```

### Required Twilio Environment Variables

In Supabase Edge Functions settings:

```
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=whatsapp:+1234567890
```

---

## Step 6: Test Your Deployment

### Test Checklist

- [ ] User registration/login works
- [ ] Dashboard loads correctly
- [ ] Contacts can be created/edited
- [ ] Knowledge Vault documents can be uploaded
- [ ] Knowledge search returns results
- [ ] Chrome Extension sidebar appears on WhatsApp Web
- [ ] Contacts can be saved from WhatsApp Web
- [ ] WhatsApp groups are captured
- [ ] Group campaigns can be scheduled
- [ ] Auto-reply responds to WhatsApp messages

---

## Troubleshooting

### Chrome Extension Not Working

1. Check if `config.js` has correct values
2. Check Console for errors in WhatsApp Web tab
3. Ensure Supabase URL is in `host_permissions`
4. Verify user is logged in via extension popup

### Auto-Reply Not Working

1. Check Edge Function logs in Supabase
2. Verify `LOVABLE_API_KEY` is set
3. Check Knowledge Vault has documents with status `approved`
4. Test with a simple query in Knowledge Vault search

### Group Campaigns Failing

1. Ensure Chrome Extension is installed and active
2. Keep WhatsApp Web tab open (not in background)
3. Check Extension Health status in dashboard
4. Review failure reason in scheduled posts table

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Chrome Ext    │────▶│    Supabase     │◀────│   Vercel App    │
│  (WhatsApp Web) │     │   (Database +   │     │    (React)      │
└─────────────────┘     │   Edge Funcs)   │     └─────────────────┘
                        └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │     Twilio      │
                        │   (WhatsApp)    │
                        └─────────────────┘
```

---

## Support

For issues and feature requests, please open a GitHub issue.

---

## License

MIT License - See LICENSE file for details.
