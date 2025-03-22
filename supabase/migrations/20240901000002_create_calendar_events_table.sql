-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time VARCHAR NOT NULL,
  end_time VARCHAR NOT NULL,
  location VARCHAR,
  category VARCHAR NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We're not adding the table to the publication explicitly
-- because the publication is defined as FOR ALL TABLES
-- The table will be automatically included in the publication