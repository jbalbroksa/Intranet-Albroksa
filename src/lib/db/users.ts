import { supabase } from "../supabase";
import { Database } from "@/types/database.types";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

/**
 * Get the current user's profile from the database
 */
export async function getCurrentUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

/**
 * Create or update a user profile
 */
export async function upsertUserProfile(
  profile: Partial<UserProfile> & { id: string },
) {
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", profile.id)
    .single();

  if (existingUser) {
    // Update existing user
    const { data, error } = await supabase
      .from("users")
      .update({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }

    return data;
  } else {
    // Create new user
    const { data, error } = await supabase
      .from("users")
      .insert({
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }

    return data;
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data;
}
