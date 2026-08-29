import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTables() {
  const tables = [
    'cms_homepage', 'cms_about', 'cms_courses', 'cms_services', 
    'cms_charity', 'cms_gallery', 'cms_forms', 'cms_settings', 
    'cms_notices', 'cms_testimonials', 'cms_media'
  ];

  for (const tbl of tables) {
    const { data, error } = await supabase.from(tbl).select('*');
    if (error) {
      console.log(`Table: ${tbl} -> Error: ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`Table: ${tbl} -> Count: ${data.length}`);
      if (data.length > 0 && tbl === 'cms_forms') {
        console.log('  Forms:', data.map(f => ({ id: f.id, title: f.title, type: f.type, is_active: f.is_active })));
      }
    }
  }
}

inspectTables();
