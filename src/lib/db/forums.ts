import { supabase } from "../supabase";
import { Database } from "@/types/database.types";

type ForumThread = Database["public"]["Tables"]["forum_threads"]["Row"];
type ForumReply = Database["public"]["Tables"]["forum_replies"]["Row"];

/**
 * Get all forum threads with reply counts
 */
export async function getForumThreads() {
  const { data, error } = await supabase
    .from("forum_threads")
    .select(
      `
      *,
      users:author_id(id, full_name, avatar_url),
      replies:forum_replies(count)
    `,
    )
    .order("is_sticky", { ascending: false })
    .order("last_activity", { ascending: false });

  if (error) {
    console.error("Error fetching forum threads:", error);
    return [];
  }

  return data;
}

/**
 * Get a forum thread by ID with its replies
 */
export async function getForumThreadById(id: string) {
  const { data, error } = await supabase
    .from("forum_threads")
    .select(
      `
      *,
      users:author_id(id, full_name, avatar_url),
      replies:forum_replies(*, users:author_id(id, full_name, avatar_url))
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching forum thread:", error);
    return null;
  }

  // Increment view count
  await supabase
    .from("forum_threads")
    .update({ views: (data.views || 0) + 1 })
    .eq("id", id);

  return data;
}

/**
 * Create a new forum thread
 */
export async function createForumThread(thread: {
  title: string;
  category: string;
  content: string;
  isSticky?: boolean;
}) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Create thread
    const { data: threadData, error: threadError } = await supabase
      .from("forum_threads")
      .insert({
        title: thread.title,
        category: thread.category,
        author_id: user.id,
        is_sticky: thread.isSticky || false,
        views: 0,
      })
      .select()
      .single();

    if (threadError) throw threadError;

    // Create initial reply (first post)
    const { data: replyData, error: replyError } = await supabase
      .from("forum_replies")
      .insert({
        thread_id: threadData.id,
        content: thread.content,
        author_id: user.id,
      })
      .select()
      .single();

    if (replyError) throw replyError;

    return threadData;
  } catch (error) {
    console.error("Error creating forum thread:", error);
    throw error;
  }
}

/**
 * Add a reply to a forum thread
 */
export async function createForumReply(reply: {
  threadId: string;
  content: string;
}) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Create reply
    const { data, error } = await supabase
      .from("forum_replies")
      .insert({
        thread_id: reply.threadId,
        content: reply.content,
        author_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Update thread's last_activity timestamp
    await supabase
      .from("forum_threads")
      .update({ last_activity: new Date().toISOString() })
      .eq("id", reply.threadId);

    return data;
  } catch (error) {
    console.error("Error creating forum reply:", error);
    throw error;
  }
}
