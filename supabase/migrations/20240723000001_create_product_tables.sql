-- Add new fields to content table for product structure
ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS procesos TEXT,
ADD COLUMN IF NOT EXISTS debilidades TEXT,
ADD COLUMN IF NOT EXISTS observaciones TEXT,
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Create subcategories table
CREATE TABLE IF NOT EXISTS public.content_subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable realtime for the new table
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_subcategories;

-- Create initial subcategories for each main category
INSERT INTO public.content_subcategories (name, parent_category)
VALUES
  ('Seguro para particulares/Hogar', 'Seguro para particulares'),
  ('Seguro para particulares/Auto', 'Seguro para particulares'),
  ('Seguro para particulares/Vida', 'Seguro para particulares'),
  ('Seguros para empresas/Responsabilidad Civil', 'Seguros para empresas'),
  ('Seguros para empresas/Multirriesgo', 'Seguros para empresas'),
  ('Seguros Agrarios/Cultivos', 'Seguros Agrarios'),
  ('Seguros Agrarios/Ganado', 'Seguros Agrarios'),
  ('Seguros Personales/Salud', 'Seguros Personales'),
  ('Seguros Personales/Accidentes', 'Seguros Personales')
ON CONFLICT (id) DO NOTHING;
