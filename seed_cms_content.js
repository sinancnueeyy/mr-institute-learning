import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const client = createClient(supabaseUrl, supabaseAnonKey);

async function seedCMSContent() {
  console.log('=== SEEDING CMS CONTENT & FORMS FOR MR INSTITUTE ===\n');

  // Authenticate as Developer to satisfy RLS
  const devAuth = await client.auth.signInWithPassword({
    email: 'developer@mrinstitute.edu',
    password: 'Developer@2026!'
  });

  if (devAuth.error || !devAuth.data.user) {
    console.error('Failed to sign in as Developer:', devAuth.error);
    process.exit(1);
  }
  console.log('✅ Developer authenticated.');

  // 1. SEED CMS FORMS
  console.log('\n1. Seeding Forms (contact, enquiry, charity, admission, scholarship)...');
  const forms = [
    {
      id: 'form_contact',
      title: 'General Contact & Enquiry Form',
      type: 'contact',
      description: 'Send us a message and our team will get back to you within 24 hours.',
      is_active: true,
      steps: [
        {
          id: 'step_1',
          title: 'Your Message',
          order: 0,
          fields: [
            { id: 'f_name', name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true, width: 'half', order: 0 },
            { id: 'f_email', name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com', required: true, width: 'half', order: 1 },
            { id: 'f_phone', name: 'phone', label: 'Phone Number', type: 'phone', placeholder: '+91 98765 43210', required: true, width: 'half', order: 2 },
            { id: 'f_subject', name: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help you?', required: true, width: 'half', order: 3 },
            { id: 'f_msg', name: 'message', label: 'Message', type: 'textarea', placeholder: 'Write your message details here...', required: true, width: 'full', order: 4 }
          ]
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'form_enquiry',
      title: 'Course Admission Enquiry',
      type: 'enquiry',
      description: 'Inquire about batch timings, fees, and syllabus details for this course.',
      is_active: true,
      steps: [
        {
          id: 'step_1',
          title: 'Enquiry Details',
          order: 0,
          fields: [
            { id: 'fe_name', name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name', required: true, width: 'half', order: 0 },
            { id: 'fe_email', name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com', required: true, width: 'half', order: 1 },
            { id: 'fe_phone', name: 'phone', label: 'Phone Number', type: 'phone', placeholder: '+91 98765 43210', required: true, width: 'half', order: 2 },
            { 
              id: 'fe_mode', name: 'preferredMode', label: 'Preferred Learning Mode', type: 'select', required: true, width: 'half', order: 3,
              options: [{ label: 'Offline / Classroom', value: 'Offline' }, { label: 'Online Live', value: 'Online' }, { label: 'Hybrid', value: 'Hybrid' }]
            },
            { id: 'fe_msg', name: 'message', label: 'Questions / Remarks', type: 'textarea', placeholder: 'Any specific questions about this course?', required: false, width: 'full', order: 4 }
          ]
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'form_charity',
      title: 'Charity Aid & Support Application',
      type: 'charity',
      description: 'Apply for educational aid, fee concessions, or scholarship assistance.',
      is_active: true,
      steps: [
        {
          id: 'step_1',
          title: 'Applicant Details',
          order: 0,
          fields: [
            { id: 'fc_name', name: 'applicantName', label: 'Applicant Full Name', type: 'text', placeholder: 'Enter full name', required: true, width: 'half', order: 0 },
            { id: 'fc_contact', name: 'contact', label: 'Contact Number', type: 'phone', placeholder: '+91 98765 43210', required: true, width: 'half', order: 1 },
            { 
              id: 'fc_type', name: 'requestType', label: 'Assistance Type', type: 'select', required: true, width: 'full', order: 2,
              options: [
                { label: 'Tuition Fee Waiver', value: 'Tuition Fee Waiver' },
                { label: 'Study Materials Support', value: 'Study Materials Support' },
                { label: 'Merit-Cum-Means Scholarship', value: 'Merit-Cum-Means Scholarship' },
                { label: 'Special Talent Aid', value: 'Special Talent Aid' }
              ]
            },
            { id: 'fc_desc', name: 'description', label: 'Reason & Family Financial Background', type: 'textarea', placeholder: 'Describe your current situation and why you are seeking assistance...', required: true, width: 'full', order: 3 },
            { id: 'fc_doc', name: 'incomeProof', label: 'Upload Income Certificate or Marksheet (PDF/Image)', type: 'file', required: false, width: 'full', order: 4 }
          ]
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'form_admission',
      title: 'General Admission Form',
      type: 'admission',
      description: 'Complete student intake registration.',
      is_active: true,
      steps: [
        {
          id: 'step_1',
          title: 'Personal Info',
          order: 0,
          fields: [
            { id: 'fa_name', name: 'applicantName', label: 'Student Full Name', type: 'text', placeholder: 'Full Name', required: true, width: 'half', order: 0 },
            { id: 'fa_email', name: 'email', label: 'Email Address', type: 'email', placeholder: 'student@example.com', required: true, width: 'half', order: 1 },
            { id: 'fa_phone', name: 'phone', label: 'Phone Number', type: 'phone', placeholder: '+91 9876543210', required: true, width: 'half', order: 2 },
            { id: 'fa_dob', name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true, width: 'half', order: 3 }
          ]
        },
        {
          id: 'step_2',
          title: 'Academic & Verification',
          order: 1,
          fields: [
            { id: 'fa_edu', name: 'education', label: 'Highest Qualification', type: 'text', placeholder: 'e.g. 10th / 12th / Degree', required: true, width: 'half', order: 0 },
            { id: 'fa_addr', name: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Permanent address', required: true, width: 'full', order: 1 },
            { id: 'fa_doc', name: 'idProof', label: 'Identity / Marksheet Document', type: 'file', required: false, width: 'full', order: 2 }
          ]
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const f of forms) {
    const { error } = await client.from('cms_forms').upsert(f, { onConflict: 'id' });
    if (error) console.error(`Error seeding form ${f.id}:`, error.message);
    else console.log(`  ✅ Seeded Form: ${f.title} (type: ${f.type})`);
  }

  // 2. SEED CMS SERVICES
  console.log('\n2. Seeding CMS Services...');
  const services = [
    {
      id: 'srv_1',
      title: 'Academic Tuition & School Support',
      description: 'Targeted coaching for Secondary and Higher Secondary school curriculum with regular testing and individual doubt clearing.',
      icon_name: 'BookOpen',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      benefits: ['Chapter-wise structured modules', 'Weekly evaluation tests', 'Personalized mentor attention'],
      eligibility: 'Open to 8th, 9th, 10th, 11th and 12th standard students',
      cta_text: 'Explore Batches',
      cta_link: '/courses',
      order_index: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'srv_2',
      title: 'Degree Programs Support',
      description: 'Holistic university degree coaching covering Computer Science, Commerce, and Arts with practical project guidance.',
      icon_name: 'GraduationCap',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
      benefits: ['Curriculum-aligned lecture notes', 'University lab assignment help', 'Capstone project mentorship'],
      eligibility: 'Enrolled undergraduate and postgraduate students',
      cta_text: 'View Degree Support',
      cta_link: '/courses',
      order_index: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'srv_3',
      title: 'AI & Future Skills Training',
      description: 'Modern hands-on training in Artificial Intelligence, Python programming, Data Science, and Machine Learning.',
      icon_name: 'Cpu',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
      benefits: ['Real-world coding projects', 'AI tools & API integration', 'Internship & career placement support'],
      eligibility: 'Open to college students, graduates, and working professionals',
      cta_text: 'Learn AI Skills',
      cta_link: '/courses',
      order_index: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'srv_4',
      title: 'Direct Examination Coaching',
      description: 'Fast-track and intensive academic programs for students appearing directly for secondary and higher secondary board exams.',
      icon_name: 'Award',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
      benefits: ['Concise study packages', 'Previous 10 years question banks', 'Frequent full-length mock exams'],
      eligibility: 'All candidates eligible for direct board registrations',
      cta_text: 'Join Direct Batch',
      cta_link: '/contact',
      order_index: 4,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'srv_5',
      title: 'Professional Computer Courses',
      description: 'Job-oriented diplomas in Fullstack Web Development, Graphic Design, Digital Marketing, and Accounting Software.',
      icon_name: 'Monitor',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      benefits: ['100% practical lab training', 'Industry-standard software exposure', 'Portfolio building guidance'],
      eligibility: 'Basic computer literacy recommended',
      cta_text: 'Explore Tech Courses',
      cta_link: '/courses',
      order_index: 5,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'srv_6',
      title: 'Competitive Exam Preparation',
      description: 'Comprehensive entrance coaching for medical (NEET), engineering (JEE), and national eligibility tests.',
      icon_name: 'Target',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
      benefits: ['Daily Practice Problem sheets (DPP)', 'All India mock rankings', 'Special speed and accuracy drills'],
      eligibility: 'Science stream students and repeaters',
      cta_text: 'Get Entrance Guidance',
      cta_link: '/contact',
      order_index: 6,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const s of services) {
    const { error } = await client.from('cms_services').upsert(s, { onConflict: 'id' });
    if (error) console.error(`Error seeding service ${s.id}:`, error.message);
    else console.log(`  ✅ Seeded Service: ${s.title}`);
  }

  // 3. SEED CMS GALLERY
  console.log('\n3. Seeding CMS Gallery...');
  const galleryItems = [
    {
      id: 'gal_1',
      title: 'Modern Smart Classrooms',
      category: 'Campus',
      tags: ['Classrooms', 'Infrastructure', 'Smart Learning'],
      image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
      is_featured: true,
      order_index: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'gal_2',
      title: 'Annual Graduation Day Ceremony',
      category: 'Events',
      tags: ['Convocation', 'Success', 'Alumni'],
      image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
      is_featured: true,
      order_index: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'gal_3',
      title: 'High-Tech Computing & AI Lab',
      category: 'Labs',
      tags: ['Computers', 'AI', 'Technology'],
      image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
      is_featured: true,
      order_index: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'gal_4',
      title: 'Collaborative Study & Library Lounge',
      category: 'Campus',
      tags: ['Library', 'Books', 'Research'],
      image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80',
      is_featured: false,
      order_index: 4,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'gal_5',
      title: 'Youth Leadership & Cultural Festival',
      category: 'Events',
      tags: ['Cultural', 'Sports', 'Leadership'],
      image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
      is_featured: false,
      order_index: 5,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'gal_6',
      title: 'Science & Robotics Exhibition',
      category: 'Academics',
      tags: ['Robotics', 'Innovation', 'STEM'],
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
      is_featured: true,
      order_index: 6,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const g of galleryItems) {
    const { error } = await client.from('cms_gallery').upsert(g, { onConflict: 'id' });
    if (error) console.error(`Error seeding gallery ${g.id}:`, error.message);
    else console.log(`  ✅ Seeded Gallery: ${g.title} (${g.category})`);
  }

  // 4. SEED CMS NOTICES
  console.log('\n4. Seeding CMS Notices...');
  const notices = [
    {
      id: 'not_1',
      type: 'announcement',
      title: 'Admissions Open for Academic Year 2026-2027',
      description: 'Applications are now being accepted for all Higher Secondary, Degree Support, and AI Foundation courses.',
      link: '/courses',
      publish_date: new Date().toISOString(),
      is_featured: true,
      priority: 'high',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'not_2',
      type: 'scholarship',
      title: 'Merit-cum-Means Scholarship Window Open',
      description: 'Deserving students can apply for up to 100% fee waiver under the MR Charity Initiative before September 15th.',
      link: '/charity',
      publish_date: new Date().toISOString(),
      is_featured: true,
      priority: 'high',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'not_3',
      type: 'event',
      title: 'Hands-on Generative AI & Python Bootcamp',
      description: 'A 2-day intensive weekend workshop on building modern web applications with Large Language Models.',
      link: '/courses',
      publish_date: new Date().toISOString(),
      is_featured: false,
      priority: 'medium',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'not_4',
      type: 'news',
      title: 'MR Institute Students Secure Top Honors in State Examination',
      description: 'Over 98% of our 2025 batch achieved distinction in the direct examination board rankings.',
      publish_date: new Date().toISOString(),
      is_featured: false,
      priority: 'medium',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const n of notices) {
    const { error } = await client.from('cms_notices').upsert(n, { onConflict: 'id' });
    if (error) console.error(`Error seeding notice ${n.id}:`, error.message);
    else console.log(`  ✅ Seeded Notice: ${n.title}`);
  }

  await client.auth.signOut();
  console.log('\n✅ All CMS Content & Forms Successfully Seeded!');
}

seedCMSContent();
