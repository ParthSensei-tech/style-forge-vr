-- Create items table for clothing items (if not exists)
CREATE TABLE IF NOT EXISTS public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  asset_path TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Create items policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'items' AND policyname = 'items_select_user') THEN
    CREATE POLICY "items_select_user" ON public.items FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'items' AND policyname = 'items_insert_user') THEN
    CREATE POLICY "items_insert_user" ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'items' AND policyname = 'items_update_user') THEN
    CREATE POLICY "items_update_user" ON public.items FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'items' AND policyname = 'items_delete_user') THEN
    CREATE POLICY "items_delete_user" ON public.items FOR DELETE USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create outfits table for saved outfits (if not exists)
CREATE TABLE IF NOT EXISTS public.outfits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  avatar_type TEXT,
  items_used JSONB,
  preview_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on outfits
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;

-- Create outfits policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfits' AND policyname = 'outfits_select_user') THEN
    CREATE POLICY "outfits_select_user" ON public.outfits FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfits' AND policyname = 'outfits_insert_user') THEN
    CREATE POLICY "outfits_insert_user" ON public.outfits FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfits' AND policyname = 'outfits_update_user') THEN
    CREATE POLICY "outfits_update_user" ON public.outfits FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outfits' AND policyname = 'outfits_delete_user') THEN
    CREATE POLICY "outfits_delete_user" ON public.outfits FOR DELETE USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create leads table for contact form (if not exists)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  company TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create leads policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'leads_public_insert') THEN
    CREATE POLICY "leads_public_insert" ON public.leads FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'leads_select_auth') THEN
    CREATE POLICY "leads_select_auth" ON public.leads FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END
$$;