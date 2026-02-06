-- Privacy Jobs Table
CREATE TABLE public.privacy_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'protected', 'completed', 'error')),
  ipfs_hash TEXT,
  risk_tier TEXT CHECK (risk_tier IN ('A', 'B', 'C', 'D')),
  mrenclave TEXT,
  encrypted_data_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Disclosure Tokens Table
CREATE TABLE public.disclosure_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  privacy_job_id UUID REFERENCES public.privacy_jobs(id) ON DELETE CASCADE,
  token_id INTEGER NOT NULL,
  verifier_address TEXT NOT NULL,
  disclosure_level INTEGER NOT NULL DEFAULT 0 CHECK (disclosure_level IN (0, 1, 2)),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  revoked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Attestations Table
CREATE TABLE public.attestations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  privacy_job_id UUID REFERENCES public.privacy_jobs(id) ON DELETE CASCADE,
  mrenclave TEXT NOT NULL,
  mr_signer TEXT,
  risk_tier TEXT NOT NULL CHECK (risk_tier IN ('A', 'B', 'C', 'D')),
  chain_id INTEGER NOT NULL DEFAULT 421614,
  tx_hash TEXT,
  signature TEXT NOT NULL,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.privacy_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disclosure_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attestations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for privacy_jobs
CREATE POLICY "Users can view their own privacy jobs" 
ON public.privacy_jobs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own privacy jobs" 
ON public.privacy_jobs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own privacy jobs" 
ON public.privacy_jobs FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for disclosure_tokens
CREATE POLICY "Users can view their own disclosure tokens" 
ON public.disclosure_tokens FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own disclosure tokens" 
ON public.disclosure_tokens FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own disclosure tokens" 
ON public.disclosure_tokens FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own disclosure tokens" 
ON public.disclosure_tokens FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for attestations
CREATE POLICY "Users can view their own attestations" 
ON public.attestations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attestations" 
ON public.attestations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger for privacy_jobs
CREATE TRIGGER update_privacy_jobs_updated_at
BEFORE UPDATE ON public.privacy_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create sequence for token IDs
CREATE SEQUENCE IF NOT EXISTS public.disclosure_token_id_seq START 1000;

-- Function to get next token ID
CREATE OR REPLACE FUNCTION public.get_next_token_id()
RETURNS INTEGER AS $$
BEGIN
  RETURN nextval('public.disclosure_token_id_seq');
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Enable realtime for privacy tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.privacy_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.disclosure_tokens;