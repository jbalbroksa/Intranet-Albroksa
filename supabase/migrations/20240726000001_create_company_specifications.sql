-- Create company specifications table
CREATE TABLE IF NOT EXISTS public.company_specifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subcategory TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable realtime for the new table
ALTER PUBLICATION supabase_realtime ADD TABLE public.company_specifications;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS company_specifications_company_id_idx ON public.company_specifications(company_id);
CREATE INDEX IF NOT EXISTS company_specifications_category_idx ON public.company_specifications(category);
