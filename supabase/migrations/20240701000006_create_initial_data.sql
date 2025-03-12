-- Insert initial admin user
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@insuranceconnect.com',
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"System Administrator"}'
)
ON CONFLICT (id) DO NOTHING;

-- Insert admin user profile
INSERT INTO public.users (id, full_name, avatar_url, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'System Administrator',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  'admin',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Insert initial categories for documents
INSERT INTO public.documents (id, title, description, file_type, category, file_size, version, file_path, uploaded_by, uploaded_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Welcome Guide',
  'Introduction to the Insurance Connect platform',
  'pdf',
  'Onboarding',
  '1.2 MB',
  '1.0',
  'documents/welcome-guide.pdf',
  '00000000-0000-0000-0000-000000000000',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Insert initial news item
INSERT INTO public.news (id, title, content, excerpt, category, author_id, published_at, is_pinned, image_url)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Welcome to InsuranceConnect',
  'Welcome to our new intranet platform! This platform is designed to help you access all the resources you need to succeed in your franchise.',
  'Welcome to our new intranet platform designed to help you succeed in your franchise...',
  'Announcements',
  '00000000-0000-0000-0000-000000000000',
  now(),
  true,
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- Insert initial training course
INSERT INTO public.training_courses (id, title, description, category, duration, level, image_url, is_required, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Insurance Policy Fundamentals',
  'Learn the basics of insurance policies and coverage types',
  'Fundamentals',
  '2 hours',
  'Beginner',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80',
  true,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Insert initial forum thread
INSERT INTO public.forum_threads (id, title, category, author_id, created_at, last_activity, views, is_sticky, is_locked)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Welcome to the Insurance Connect Forum',
  'Announcements',
  '00000000-0000-0000-0000-000000000000',
  now(),
  now(),
  0,
  true,
  false
)
ON CONFLICT (id) DO NOTHING;

-- Insert initial forum reply
INSERT INTO public.forum_replies (id, thread_id, content, author_id, created_at, updated_at)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '44444444-4444-4444-4444-444444444444',
  'Welcome to the Insurance Connect forum! This is a place to discuss topics related to insurance, share best practices, and connect with other franchise owners.',
  '00000000-0000-0000-0000-000000000000',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Insert initial content
INSERT INTO public.content (id, title, content, excerpt, category, status, author_id, published_at, created_at, updated_at)
VALUES (
  '66666666-6666-6666-6666-666666666666',
  '2024 Policy Updates: What You Need to Know',
  'We\'ve updated our policies for 2024 to better serve our clients and comply with new regulations. Key changes include:\n\n1. Updated privacy policy language\n2. New claims processing procedures\n3. Revised commission structure\n4. Enhanced customer service protocols\n\nPlease review these changes carefully and update your materials accordingly.',
  'Important policy updates for 2024 including privacy policy changes, claims processing, and more...',
  'Policies',
  'published',
  '00000000-0000-0000-0000-000000000000',
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Insert content tags
INSERT INTO public.content_tags (id, content_id, tag)
VALUES 
  ('77777777-7777-7777-7777-777777777771', '66666666-6666-6666-6666-666666666666', 'policy'),
  ('77777777-7777-7777-7777-777777777772', '66666666-6666-6666-6666-666666666666', 'updates'),
  ('77777777-7777-7777-7777-777777777773', '66666666-6666-6666-6666-666666666666', '2024'),
  ('77777777-7777-7777-7777-777777777774', '66666666-6666-6666-6666-666666666666', 'compliance')
ON CONFLICT (id) DO NOTHING;

-- Insert initial calendar event
INSERT INTO public.calendar_events (id, title, description, event_date, start_time, end_time, location, category, created_by, created_at, updated_at)
VALUES (
  '88888888-8888-8888-8888-888888888888',
  'Quarterly Sales Meeting',
  'Review Q2 sales performance and discuss Q3 targets',
  '2024-07-15',
  '10:00 AM',
  '11:30 AM',
  'Main Conference Room',
  'Meeting',
  '00000000-0000-0000-0000-000000000000',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;
