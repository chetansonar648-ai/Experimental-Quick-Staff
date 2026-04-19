-- Add portfolio column to worker_profiles
ALTER TABLE worker_profiles 
ADD COLUMN IF NOT EXISTS portfolio JSONB DEFAULT '[]'::jsonb;
