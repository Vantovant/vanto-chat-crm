#!/bin/bash

# Vanto CRM Chrome Extension Setup Script
# Run this script to configure your extension with your Supabase credentials

echo "=========================================="
echo "Vanto CRM Chrome Extension Setup"
echo "=========================================="
echo ""

# Check if config values are provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./setup.sh <SUPABASE_URL> <SUPABASE_ANON_KEY> [DASHBOARD_URL]"
  echo ""
  echo "Example:"
  echo "  ./setup.sh https://yourproject.supabase.co eyJhbG...yourkey... https://yourdomain.com"
  echo ""
  echo "You can find these values in your Supabase dashboard:"
  echo "  Settings → API → Project URL and anon/public key"
  exit 1
fi

SUPABASE_URL=$1
SUPABASE_ANON_KEY=$2
DASHBOARD_URL=${3:-"https://yourdomain.com"}

# Escape special characters for sed
SUPABASE_URL_ESCAPED=$(echo "$SUPABASE_URL" | sed 's/[\/&]/\\&/g')
SUPABASE_ANON_KEY_ESCAPED=$(echo "$SUPABASE_ANON_KEY" | sed 's/[\/&]/\\&/g')
DASHBOARD_URL_ESCAPED=$(echo "$DASHBOARD_URL" | sed 's/[\/&]/\\&/g')

# Update config.js
echo "Updating config.js..."
sed -i "s|YOUR_SUPABASE_URL_HERE|$SUPABASE_URL_ESCAPED|g" config.js
sed -i "s|YOUR_SUPABASE_ANON_KEY_HERE|$SUPABASE_ANON_KEY_ESCAPED|g" config.js
sed -i "s|https://your-domain.com|$DASHBOARD_URL_ESCAPED|g" config.js

# Update manifest.json
echo "Updating manifest.json..."
cp manifest.template.json manifest.json
sed -i "s|{{SUPABASE_URL}}|$SUPABASE_URL_ESCAPED|g" manifest.json

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Your Chrome extension is now configured with:"
echo "  Supabase URL: $SUPABASE_URL"
echo "  Dashboard URL: $DASHBOARD_URL"
echo ""
echo "To install the extension:"
echo "  1. Open Chrome and go to chrome://extensions/"
echo "  2. Enable 'Developer mode' (top right)"
echo "  3. Click 'Load unpacked'"
echo "  4. Select this chrome-extension folder"
echo ""
