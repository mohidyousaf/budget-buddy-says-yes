
-- Create function to get the sheet URL
CREATE OR REPLACE FUNCTION public.get_sheet_url()
RETURNS TABLE (id TEXT, sheet_url TEXT) 
LANGUAGE SQL
AS $$
  SELECT id, sheet_url FROM public.user_settings WHERE id = 'default' LIMIT 1;
$$;

-- Create function to save or update the sheet URL
CREATE OR REPLACE FUNCTION public.save_sheet_url(p_id TEXT, p_url TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_settings (id, sheet_url, updated_at)
  VALUES (p_id, p_url, now())
  ON CONFLICT (id)
  DO UPDATE SET 
    sheet_url = p_url,
    updated_at = now();
END;
$$;
