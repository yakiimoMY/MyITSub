import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gwmkafvpekccycuytlqe.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bWthZnZwZWtjY3ljdXl0bHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjc1MDAsImV4cCI6MjA5MjgwMzUwMH0.Mmy_szEhmsNeCYHPbxyfKJ5sNgciyVlkIjxRwOeHG3s'

// Supabase client for authentication and user management
export const supabase = createClient(supabaseUrl, supabaseAnonKey)