/**
 * Vanto CRM Chrome Extension Configuration
 *
 * IMPORTANT: Update these values with your own Supabase credentials
 * before building the extension.
 *
 * You can find these values in your Supabase project dashboard:
 * Settings → API → Project URL and anon/public key
 */

var VANTO_CONFIG = {
  // Your Supabase project URL
  SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
  
  // Your Supabase anon/public key (this is safe to expose in client-side code)
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',
  
  // Your Vanto CRM dashboard URL (for links from extension)
  DASHBOARD_URL: 'https://your-domain.com',
  
  // Extension version
  VERSION: '5.0.0'
};

// Do not modify below this line
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VANTO_CONFIG;
}
