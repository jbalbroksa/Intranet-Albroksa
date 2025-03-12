import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../../supabase/auth";
import { Database } from "@/types/database.types";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function fetchUserProfile() {
      try {
        setLoading(true);

        // Check if user exists in the users table
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is the error code for no rows returned
          throw error;
        }

        if (data) {
          setProfile(data);
        } else {
          // User doesn't exist in the users table, create directly in the database
          try {
            const { data: newUser, error: insertError } = await supabase
              .from("users")
              .insert({
                id: user.id,
                full_name: user.user_metadata?.full_name || "",
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                role: "employee",
              })
              .select()
              .single();

            if (insertError) throw insertError;
            setProfile(newUser);
          } catch (insertErr) {
            console.error("Error creating user profile:", insertErr);
            // Try to fetch again in case another process created the user
            const { data: retryData, error: retryError } = await supabase
              .from("users")
              .select("*")
              .eq("id", user.id)
              .single();

            if (retryError) throw retryError;
            if (retryData) setProfile(retryData);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return null;

    try {
      setLoading(true);

      // Update directly in the database
      const { data, error } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
}
