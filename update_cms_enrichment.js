import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const client = createClient(supabaseUrl, supabaseAnonKey);

async function enrichCMSData() {
  console.log('=== ENRICHING CMS ABOUT & SETTINGS ===\n');

  const devAuth = await client.auth.signInWithPassword({
    email: 'developer@mrinstitute.edu',
    password: 'Developer@2026!'
  });

  if (devAuth.error) {
    console.error('Dev auth error:', devAuth.error);
    process.exit(1);
  }

  // Update cms_about with infrastructure and team members
  const aboutUpdate = {
    infrastructure: [
      {
        title: 'Modern Hi-Tech Classrooms',
        description: 'Acoustically treated, air-conditioned lecture halls with interactive smart boards and digital projectors.',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80'
      },
      {
        title: 'Advanced Computer & AI Lab',
        description: 'Over 100 high-performance workstations with high-speed internet and dedicated developer toolchains.',
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80'
      },
      {
        title: 'Comprehensive Reference Library',
        description: 'Extensive repository of over 10,000 reference books, journals, past exam papers, and quiet study cubicles.',
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80'
      },
      {
        title: 'Student Seminar & Conference Hall',
        description: 'Multipurpose auditorium for guest lectures, industry seminars, cultural events, and placement drives.',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80'
      }
    ],
    team_members: [
      {
        name: 'Dr. Mohammed Rashid',
        role: 'Founder & Director',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
        is_leadership: true
      },
      {
        name: 'Prof. Aisha Siddiqui',
        role: 'Dean of Academics',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        is_leadership: true
      }
    ],
    updated_at: new Date().toISOString()
  };

  const { error: aboutErr } = await client
    .from('cms_about')
    .update(aboutUpdate)
    .eq('id', 'main');

  if (aboutErr) console.error('Error updating cms_about:', aboutErr.message);
  else console.log('✅ cms_about enriched with infrastructure & team.');

  // Update cms_settings with branches and department contacts
  const settingsUpdate = {
    branches: [
      {
        name: 'Main Campus',
        address: 'MR Knowledge City, Highway Road, Kerala 673001',
        phone: '+91 98765 43210',
        email: 'maincampus@mrinstitute.edu'
      },
      {
        name: 'City Learning Centre',
        address: '2nd Floor, Apex Plaza, City Centre, Kerala 673004',
        phone: '+91 98765 43211',
        email: 'citycentre@mrinstitute.edu'
      }
    ],
    department_contacts: [
      {
        department: 'Admissions Office',
        name: 'Admissions Desk',
        email: 'admissions@mrinstitute.edu',
        phone: '+91 98765 43212'
      },
      {
        department: 'Scholarship & Charity Cell',
        name: 'Welfare Officer',
        email: 'charity@mrinstitute.edu',
        phone: '+91 98765 43213'
      }
    ],
    updated_at: new Date().toISOString()
  };

  const { error: setErr } = await client
    .from('cms_settings')
    .update(settingsUpdate)
    .eq('id', 'global');

  if (setErr) console.error('Error updating cms_settings:', setErr.message);
  else console.log('✅ cms_settings enriched with branches & departments.');

  await client.auth.signOut();
}

enrichCMSData();
