import { supabase } from "../supabase";
import { Database } from "@/types/database.types";

type News = Database["public"]["Tables"]["news"]["Row"];

/**
 * Get all news items
 */
export async function getNews() {
  const { data, error } = await supabase
    .from("news")
    .select(
      `
      *,
      users:author_id(id, full_name, avatar_url)
    `,
    )
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }

  return data;
}

/**
 * Get a news item by ID
 */
export async function getNewsById(id: string) {
  const { data, error } = await supabase
    .from("news")
    .select(
      `
      *,
      users:author_id(id, full_name, avatar_url)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching news item:", error);
    return null;
  }

  return data;
}

/**
 * Create or update a news item
 */
export async function upsertNews(news: {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  isPinned?: boolean;
  imageUrl?: string;
}) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const excerpt = news.excerpt || news.content.substring(0, 150) + "...";

    if (news.id) {
      // Update existing news
      const { data, error } = await supabase
        .from("news")
        .update({
          title: news.title,
          content: news.content,
          excerpt,
          category: news.category,
          is_pinned: news.isPinned || false,
          image_url: news.imageUrl || null,
        })
        .eq("id", news.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new news
      const { data, error } = await supabase
        .from("news")
        .insert({
          title: news.title,
          content: news.content,
          excerpt,
          category: news.category,
          author_id: user.id,
          is_pinned: news.isPinned || false,
          image_url: news.imageUrl || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error saving news:", error);
    throw error;
  }
}

/**
 * Delete a news item
 */
export async function deleteNews(id: string) {
  try {
    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
}
