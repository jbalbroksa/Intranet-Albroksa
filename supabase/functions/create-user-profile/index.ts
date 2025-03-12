import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("Not authenticated");
    }

    // Get the request body
    const { full_name, avatar_url, role } = await req.json();

    // Check if user already exists in the public.users table
    const { data: existingUser } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    let result;

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabaseClient
        .from("users")
        .update({
          full_name: full_name || existingUser.full_name,
          avatar_url: avatar_url || existingUser.avatar_url,
          role: role || existingUser.role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      result = { message: "User profile updated", user: data };
    } else {
      // Create new user
      const { data, error } = await supabaseClient
        .from("users")
        .insert({
          id: user.id,
          full_name: full_name || user.user_metadata?.full_name || "",
          avatar_url:
            avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          role: role || "employee",
        })
        .select()
        .single();

      if (error) throw error;
      result = { message: "User profile created", user: data };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
