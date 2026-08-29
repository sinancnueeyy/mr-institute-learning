import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectColumns() {
  const tables = [
    'applications',
    'students',
    'enquiries',
    'scholarships',
    'charity_applications',
    'form_submissions',
    'follow_ups',
    'notifications',
    'activity_logs'
  ];

  const devLogin = await supabase.auth.signInWithPassword({
    email: 'developer@mrinstitute.edu',
    password: 'Developer@2026!'
  });

  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table ${t}: Error -> ${error.message}`);
    } else {
      console.log(`Table ${t}: sample row keys ->`, data && data[0] ? Object.keys(data[0]) : '(empty table)');
    }
  }
}

inspectColumns();
