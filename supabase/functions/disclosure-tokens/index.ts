import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface IssueTokenRequest {
  verifierAddress: string;
  disclosureLevel: 0 | 1 | 2;
  expiresInDays: number;
  privacyJobId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const method = req.method;

    // GET - List user's disclosure tokens
    if (method === "GET") {
      console.log(`Fetching disclosure tokens for user: ${user.id}`);
      
      const { data: tokens, error } = await supabase
        .from("disclosure_tokens")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch tokens:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch tokens" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ tokens }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST - Issue new disclosure token
    if (method === "POST") {
      const body: IssueTokenRequest = await req.json();
      const { verifierAddress, disclosureLevel, expiresInDays, privacyJobId } = body;

      if (!verifierAddress) {
        return new Response(
          JSON.stringify({ error: "verifierAddress is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate disclosure level
      if (![0, 1, 2].includes(disclosureLevel)) {
        return new Response(
          JSON.stringify({ error: "disclosureLevel must be 0, 1, or 2" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get next token ID
      const { data: tokenIdResult } = await supabase.rpc("get_next_token_id");
      const tokenId = tokenIdResult || Math.floor(Math.random() * 10000) + 1000;

      // Calculate expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 7));

      console.log(`Issuing disclosure token for user: ${user.id}, verifier: ${verifierAddress}`);

      const { data: token, error } = await supabase
        .from("disclosure_tokens")
        .insert({
          user_id: user.id,
          privacy_job_id: privacyJobId || null,
          token_id: tokenId,
          verifier_address: verifierAddress,
          disclosure_level: disclosureLevel,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to create token:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create disclosure token" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Created disclosure token: ${token.id}, tokenId: ${tokenId}`);

      return new Response(
        JSON.stringify({ token }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // DELETE - Revoke a token
    if (method === "DELETE") {
      const tokenId = url.searchParams.get("tokenId");
      
      if (!tokenId) {
        return new Response(
          JSON.stringify({ error: "tokenId query param is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Revoking token: ${tokenId} for user: ${user.id}`);

      const { error } = await supabase
        .from("disclosure_tokens")
        .update({ revoked: true })
        .eq("id", tokenId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to revoke token:", error);
        return new Response(
          JSON.stringify({ error: "Failed to revoke token" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Disclosure tokens error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
