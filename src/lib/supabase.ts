import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://gvljtwufckjvykinvkul.supabase.co';
const DEFAULT_KEY = 'sb_publishable_iKBzHNZZHQekG7p9fGig6g_XAJfIQX5';

function sanitizeUrl(candidate?: string): string {
  if (!candidate || typeof candidate !== 'string') return DEFAULT_URL;
  const trimmed = candidate.trim();
  if (!trimmed) return DEFAULT_URL;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch (e) {
    // Invalid URL format
  }
  return DEFAULT_URL;
}

function sanitizeKey(candidate?: string): string {
  if (!candidate || typeof candidate !== 'string') return DEFAULT_KEY;
  const trimmed = candidate.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_KEY;
}

// Extract potential URL candidates safely
const envUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL));

const envKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY));

export const SUPABASE_URL = sanitizeUrl(envUrl);
export const SUPABASE_ANON_KEY = sanitizeKey(envKey);

let clientInstance: SupabaseClient;
try {
  clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (err) {
  console.warn('Failed to initialize Supabase client, falling back to default:', err);
  clientInstance = createClient(DEFAULT_URL, DEFAULT_KEY);
}

export const supabase = clientInstance;
