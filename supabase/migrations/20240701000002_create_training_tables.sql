-- Create training_courses table
CREATE TABLE IF NOT EXISTS public.training_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
  image_url TEXT,
  is_required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_courses table to track user progress
CREATE TABLE IF NOT EXISTS public.user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  course_id UUID REFERENCES public.training_courses(id) NOT NULL,
  completion_rate INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  status TEXT CHECK (status IN ('attending', 'declined', 'tentative')) NOT NULL DEFAULT 'tentative',
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Create basic policies
-- Everyone can view training courses
DROP POLICY IF EXISTS "Everyone can view training courses" ON public.training_courses;
CREATE POLICY "Everyone can view training courses"
  ON public.training_courses FOR SELECT
  USING (true);

-- Users can view their own course progress
DROP POLICY IF EXISTS "Users can view own course progress" ON public.user_courses;
CREATE POLICY "Users can view own course progress"
  ON public.user_courses FOR SELECT
  USING (auth.uid() = user_id);

-- Everyone can view calendar events
DROP POLICY IF EXISTS "Everyone can view calendar events" ON public.calendar_events;
CREATE POLICY "Everyone can view calendar events"
  ON public.calendar_events FOR SELECT
  USING (true);

-- Enable realtime for all tables
alter publication supabase_realtime add table public.training_courses;
alter publication supabase_realtime add table public.user_courses;
alter publication supabase_realtime add table public.calendar_events;
alter publication supabase_realtime add table public.event_attendees;