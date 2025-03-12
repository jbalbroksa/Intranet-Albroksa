import { supabase } from "../supabase";
import { Database } from "@/types/database.types";

type Content = Database["public"]["Tables"]["content"]["Row"];
type ContentTag = Database["public"]["Tables"]["content_tags"]["Row"];

/**
 * Get all content items with their tags
 */
export async function getContent() {
  const { data, error } = await supabase
    .from("content")
    .select(
      `
      *,
      users:author_id(id, full_name, avatar_url),
      content_tags(id, tag)
    `,
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching content:", error);
    return [];
  }

  return data;
}

/**
 * Get content by ID
 */
export async function getContentById(id: string) {
  const { data, error } = await supabase
    .from("content")
    .select(
      `
      *,
      users:author_id(id, full_name, avatar_url),
      content_tags(id, tag)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching content:", error);
    return null;
  }

  return data;
}

/**
 * Create or update content
 */
export async function upsertContent(content: {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  status?: "published" | "draft";
  tags?: string[];
}) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const isPublished = content.status === "published";
    const excerpt =
      content.excerpt || content.content.substring(0, 150) + "...";

    if (content.id) {
      // Update existing content
      const { data, error } = await supabase
        .from("content")
        .update({
          title: content.title,
          content: content.content,
          excerpt,
          category: content.category,
          status: content.status || "draft",
          published_at: isPublished ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", content.id)
        .select()
        .single();

      if (error) throw error;

      // Delete existing tags and add new ones
      if (content.tags) {
        // Delete existing tags
        await supabase
          .from("content_tags")
          .delete()
          .eq("content_id", content.id);

        // Add new tags
        if (content.tags.length > 0) {
          const tagInserts = content.tags.map((tag) => ({
            content_id: content.id,
            tag,
          }));

          await supabase.from("content_tags").insert(tagInserts);
        }
      }

      return data;
    } else {
      // Create new content
      const { data, error } = await supabase
        .from("content")
        .insert({
          title: content.title,
          content: content.content,
          excerpt,
          category: content.category,
          status: content.status || "draft",
          author_id: user.id,
          published_at: isPublished ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;

      // Add tags if provided
      if (content.tags && content.tags.length > 0) {
        const tagInserts = content.tags.map((tag) => ({
          content_id: data.id,
          tag,
        }));

        await supabase.from("content_tags").insert(tagInserts);
      }

      return data;
    }
  } catch (error) {
    console.error("Error saving content:", error);
    throw error;
  }
}

/**
 * Delete content and its tags
 */
export async function deleteContent(id: string) {
  try {
    // Delete content record (tags will be deleted via cascade)
    const { error } = await supabase.from("content").delete().eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error deleting content:", error);
    throw error;
  }
}
