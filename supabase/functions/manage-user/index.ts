// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/runtime/manual/getting_started

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UserData {
  email: string;
  password: string;
  name: string;
  role: string;
  action: "create" | "update" | "delete" | "activate" | "deactivate";
  userId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const userData: UserData = await req.json();

    let result;

    switch (userData.action) {
      case "create":
        // Create user with admin API
        const { data: createData, error: createError } =
          await supabase.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,
            user_metadata: {
              full_name: userData.name,
              role: userData.role,
            },
          });

        if (createError) throw createError;

        // Create user profile in users table
        const { error: profileError } = await supabase.from("users").insert({
          id: createData.user.id,
          full_name: userData.name,
          email: userData.email,
          role: userData.role,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        });

        if (profileError) throw profileError;

        result = { user: createData.user };
        break;

      case "update":
        if (!userData.userId) throw new Error("User ID is required for update");

        // Update user metadata
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          userData.userId,
          { user_metadata: { full_name: userData.name, role: userData.role } },
        );

        if (updateError) throw updateError;

        // Update user profile
        const { error: updateProfileError } = await supabase
          .from("users")
          .update({
            full_name: userData.name,
            email: userData.email,
            role: userData.role,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userData.userId);

        if (updateProfileError) throw updateProfileError;

        result = { success: true };
        break;

      case "delete":
        if (!userData.userId)
          throw new Error("User ID is required for deletion");

        // Delete user from auth
        const { error: deleteError } = await supabase.auth.admin.deleteUser(
          userData.userId,
        );

        if (deleteError) throw deleteError;

        // Delete user profile
        const { error: deleteProfileError } = await supabase
          .from("users")
          .delete()
          .eq("id", userData.userId);

        if (deleteProfileError) throw deleteProfileError;

        result = { success: true };
        break;

      case "activate":
        if (!userData.userId)
          throw new Error("User ID is required for activation");

        // Update user status in profile
        const { error: activateError } = await supabase
          .from("users")
          .update({
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userData.userId);

        if (activateError) throw activateError;

        result = { success: true };
        break;

      case "deactivate":
        if (!userData.userId)
          throw new Error("User ID is required for deactivation");

        // Update user status in profile
        const { error: deactivateError } = await supabase
          .from("users")
          .update({
            status: "inactive",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userData.userId);

        if (deactivateError) throw deactivateError;

        result = { success: true };
        break;

      default:
        throw new Error("Invalid action");
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
