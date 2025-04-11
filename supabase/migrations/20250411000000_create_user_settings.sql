
-- Create a table for user settings
CREATE TABLE IF NOT EXISTS public.user_settings (
  id TEXT PRIMARY KEY,
  sheet_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Allow public access for now since we don't have user authentication
-- This will store the sheet URL for persistence between sessions
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous access to user_settings" 
  ON public.user_settings 
  FOR ALL 
  USING (true);
