# Vanto CRM

**WhatsApp AI CRM for MLM & APLGO Associates**

A powerful CRM system with WhatsApp integration, AI-powered auto-reply, group campaign scheduling, and knowledge vault for product information.

![Vanto CRM](https://img.shields.io/badge/version-5.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### 📱 WhatsApp Integration
- **Chrome Extension Sidebar** — Overlay CRM directly on WhatsApp Web
- **Contact Capture** — Auto-detect and save contacts from chats
- **Group Capture** — Automatically capture WhatsApp groups for campaigns

### 🤖 AI Auto-Reply
- **Intent Detection** — Understands menu selections (1, 2, 3) and natural language
- **Knowledge Vault RAG** — Answers from your uploaded documents
- **Smart Handoff** — Routes complex questions to human agents
- **Rate Limiting** — Prevents spam with configurable limits

### 📢 Group Campaigns
- **Scheduled Posting** — Schedule messages to WhatsApp groups
- **Bulk Campaigns** — Post across multiple days with time slots
- **Smart Date Picker** — Modern calendar UI with shadcn
- **Retry Failed Posts** — One-click retry with diagnostic info

### 📚 Knowledge Vault
- **Document Upload** — Support for .txt, .md, .csv, .json
- **Smart Paste** — Copy-paste from any source (PDFs, Word docs)
- **Collections** — Organize by topic (products, opportunity, compensation)
- **Strict Mode** — For factual content (prices, compensation details)
- **Force Retry** — Recovery for stuck documents

### 👥 Team Features
- **Contact Assignment** — Assign leads to team members
- **Lead Scoring** — Temperature and lead type tracking
- **Tags** — Organize contacts with custom tags

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Realtime)
- **WhatsApp**: Twilio WhatsApp Business API, Chrome Extension (MV3)
- **AI**: Lovable AI Gateway / Google Gemini

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vanto-crm.git
cd vanto-crm

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Add your Supabase credentials to .env
# VITE_SUPABASE_URL=https://yourproject.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Start development server
npm run dev
```

### Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Chrome Extension Setup

### Quick Setup (Windows)

```powershell
cd public/chrome-extension
.\setup.ps1 -SupabaseUrl "https://yourproject.supabase.co" -SupabaseAnonKey "your-key"
```

### Quick Setup (Mac/Linux)

```bash
cd public/chrome-extension
./setup.sh "https://yourproject.supabase.co" "your-key" "https://yourdomain.com"
```

### Install in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `chrome-extension` folder

## Project Structure

```
vanto-crm/
├── public/
│   └── chrome-extension/    # WhatsApp Web sidebar extension
│       ├── manifest.json    # Extension manifest (MV3)
│       ├── background.js    # Service worker (auth, polling)
│       ├── content.js       # DOM injection, UI
│       ├── popup.html       # Login popup
│       └── sidebar.css      # Sidebar styles
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── vanto/           # App modules
│   │       ├── DashboardModule.tsx
│   │       ├── InboxModule.tsx
│   │       ├── ContactsModule.tsx
│   │       ├── GroupCampaignsModule.tsx
│   │       ├── KnowledgeVaultModule.tsx
│   │       └── ...
│   ├── integrations/
│   │   └── supabase/        # Supabase client & types
│   └── lib/                 # Utilities
├── supabase/
│   ├── functions/           # Edge Functions
│   │   ├── whatsapp-auto-reply/
│   │   ├── knowledge-search/
│   │   ├── send-message/
│   │   └── ...
│   └── migrations/          # Database migrations
└── docs/                    # Specification documents
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `LOVABLE_API_KEY` | For AI auto-reply (Edge Function) |

## Database Schema

Key tables:

- `profiles` — User profiles
- `contacts` — CRM contacts/leads
- `conversations` — WhatsApp conversations
- `messages` — Chat messages
- `whatsapp_groups` — Captured groups
- `scheduled_group_posts` — Campaign scheduler
- `knowledge_files` — Knowledge Vault documents
- `knowledge_chunks` — Searchable text chunks
- `auto_reply_events` — Auto-reply logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License — See [LICENSE](LICENSE) for details.

## Support

For issues and feature requests, please open a GitHub issue.

---

Built with ❤️ for MLM professionals and APLGO associates.
