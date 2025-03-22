-- Enable realtime for news tables
alter publication supabase_realtime add table news;
alter publication supabase_realtime add table news_tags;
alter publication supabase_realtime add table news_visibility;
