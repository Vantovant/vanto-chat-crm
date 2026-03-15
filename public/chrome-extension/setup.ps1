# Vanto CRM Chrome Extension Setup Script (PowerShell)
# Run this script to configure your extension with your Supabase credentials

param(
    [Parameter(Mandatory=$true)]
    [string]$SupabaseUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$SupabaseAnonKey,
    
    [string]$DashboardUrl = "https://yourdomain.com"
)

Write-Host "=========================================="
Write-Host "Vanto CRM Chrome Extension Setup"
Write-Host "=========================================="
Write-Host ""

# Update config.js
Write-Host "Updating config.js..."
$configContent = Get-Content "config.js" -Raw
$configContent = $configContent -replace "YOUR_SUPABASE_URL_HERE", $SupabaseUrl
$configContent = $configContent -replace "YOUR_SUPABASE_ANON_KEY_HERE", $SupabaseAnonKey
$configContent = $configContent -replace "https://your-domain.com", $DashboardUrl
Set-Content "config.js" -Value $configContent

# Update manifest.json
Write-Host "Updating manifest.json..."
Copy-Item "manifest.template.json" "manifest.json"
$manifestContent = Get-Content "manifest.json" -Raw
$manifestContent = $manifestContent -replace "{{SUPABASE_URL}}", $SupabaseUrl
Set-Content "manifest.json" -Value $manifestContent

Write-Host ""
Write-Host "=========================================="
Write-Host "✅ Setup Complete!"
Write-Host "=========================================="
Write-Host ""
Write-Host "Your Chrome extension is now configured with:"
Write-Host "  Supabase URL: $SupabaseUrl"
Write-Host "  Dashboard URL: $DashboardUrl"
Write-Host ""
Write-Host "To install the extension:"
Write-Host "  1. Open Chrome and go to chrome://extensions/"
Write-Host "  2. Enable 'Developer mode' (top right)"
Write-Host "  3. Click 'Load unpacked'"
Write-Host "  4. Select this chrome-extension folder"
Write-Host ""
