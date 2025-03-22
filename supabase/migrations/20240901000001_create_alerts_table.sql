-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Note: We're not adding the table to the publication explicitly
-- because the publication is defined as FOR ALL TABLES
-- The table will be automatically included in the publication