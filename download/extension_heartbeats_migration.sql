-- =====================================================
-- MIGRATION: extension_heartbeats table
-- PURPOSE: Track Chrome extension "last seen" status
-- FIXES: RLS blocking heartbeat writes to webhook_events
-- =====================================================

-- Create extension_heartbeats table
CREATE TABLE IF NOT EXISTS extension_heartbeats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  whatsapp_tab_open BOOLEAN DEFAULT false,
  extension_version TEXT DEFAULT '6.0.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint for upsert (one heartbeat per user)
  CONSTRAINT unique_user_heartbeat UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE extension_heartbeats ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own heartbeat
CREATE POLICY "Users can insert own heartbeat" ON extension_heartbeats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own heartbeat
CREATE POLICY "Users can update own heartbeat" ON extension_heartbeats
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own heartbeat
CREATE POLICY "Users can view own heartbeat" ON extension_heartbeats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role can view all heartbeats (for dashboard)
CREATE POLICY "Service role can view all heartbeats" ON extension_heartbeats
  FOR SELECT
  USING (auth.jwt()->>'role' = 'service_role');

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_extension_heartbeats_user ON extension_heartbeats(user_id);
CREATE INDEX IF NOT EXISTS idx_extension_heartbeats_created ON extension_heartbeats(created_at DESC);

-- Function to get latest heartbeat for display
CREATE OR REPLACE FUNCTION get_latest_extension_heartbeat(user_uuid UUID)
RETURNS TABLE (
  user_id UUID,
  last_seen TIMESTAMPTZ,
  whatsapp_tab_open BOOLEAN,
  extension_version TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    eh.user_id,
    eh.created_at as last_seen,
    eh.whatsapp_tab_open,
    eh.extension_version
  FROM extension_heartbeats eh
  WHERE eh.user_id = user_uuid;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_latest_extension_heartbeat(UUID) TO authenticated;
