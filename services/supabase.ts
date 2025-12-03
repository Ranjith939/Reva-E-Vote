/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { createClient } from '@supabase/supabase-js';

// Configuration for Reva E-Vote Supabase Project
// NOTE: We only use the PUBLIC (Anon) key here. 
// The Service Role key and Database Passwords must NEVER be used in the frontend.

const SUPABASE_URL = "https://xwhzdqtchlhzufximjba.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aHpkcXRjaGxoenVmeGltamJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODI2ODQsImV4cCI6MjA4MDA1ODY4NH0.liffkw74Ay1a5fR6rNjrHbaeEeue-T2EB_E-eAT6uNU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
