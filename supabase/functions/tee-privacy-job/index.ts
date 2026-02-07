import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PrivacyJobRequest {
  encryptedDataHash: string;
  ipfsHash?: string;
}

interface TEEResult {
  score: number;
  riskTier: "A" | "B" | "C" | "D";
  confidence: number;
  computeTime: number;
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

    console.log(`Processing TEE privacy job for user: ${user.id}`);

    const body: PrivacyJobRequest = await req.json();
    const { encryptedDataHash, ipfsHash } = body;

    if (!encryptedDataHash) {
      return new Response(
        JSON.stringify({ error: "encryptedDataHash is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create privacy job record
    const { data: job, error: jobError } = await supabase
      .from("privacy_jobs")
      .insert({
        user_id: user.id,
        status: "processing",
        encrypted_data_hash: encryptedDataHash,
        ipfs_hash: ipfsHash || null,
      })
      .select()
      .single();

    if (jobError) {
      console.error("Failed to create privacy job:", jobError);
      return new Response(
        JSON.stringify({ error: "Failed to create privacy job" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Created privacy job: ${job.id}`);

    // Simulate TEE processing (in production, this would call iExec SDK)
    const startTime = Date.now();
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock TEE result (in production, this comes from the enclave)
    const score = 650 + Math.floor(Math.random() * 200);
    const riskTier: TEEResult["riskTier"] = score >= 750 ? "A" : score >= 700 ? "B" : score >= 650 ? "C" : "D";
    const computeTime = (Date.now() - startTime) / 1000;

    const teeResult: TEEResult = {
      score,
      riskTier,
      confidence: 0.92 + Math.random() * 0.07,
      computeTime,
    };

    // Generate mock mrenclave and attestation signature
    const mrenclave = "0x" + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    
    const mrSigner = "0x" + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    
    const signature = "0x" + Array.from({ length: 128 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    // Update job with results
    const { error: updateError } = await supabase
      .from("privacy_jobs")
      .update({
        status: "completed",
        risk_tier: riskTier,
        mrenclave,
        completed_at: new Date().toISOString(),
      })
      .eq("id", job.id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Failed to update privacy job:", updateError);
    }

    // Create attestation record
    const { data: attestation, error: attestError } = await supabase
      .from("attestations")
      .insert({
        user_id: user.id,
        privacy_job_id: job.id,
        mrenclave,
        mr_signer: mrSigner,
        risk_tier: riskTier,
        chain_id: 421614,
        signature,
        is_valid: true,
      })
      .select()
      .single();

    if (attestError) {
      console.error("Failed to create attestation:", attestError);
    }

    console.log(`TEE job completed: ${job.id}, score: ${score}, tier: ${riskTier}`);

    return new Response(
      JSON.stringify({
        success: true,
        jobId: job.id,
        result: teeResult,
        attestation: {
          id: attestation?.id,
          mrenclave,
          mrSigner,
          riskTier,
          chainId: 421614,
          signature,
          isValid: true,
          timestamp: Date.now(),
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("TEE privacy job error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
