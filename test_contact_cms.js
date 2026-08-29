import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const devClient = createClient(supabaseUrl, supabaseAnonKey);

async function runContactCmsTests() {
  console.log('====================================================');
  console.log('CONTACT PAGE CMS & PORTAL ACCESS VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
    }
  }

  try {
    // 1. Anon read of cms_settings
    console.log('--- TEST GROUP 1: Anonymous Public Contact Read ---');
    const { data: publicData, error: publicError } = await anonClient
      .from('cms_settings')
      .select('*')
      .eq('id', 'global')
      .single();

    assert(!publicError && publicData !== null, 'Public anonymous user can read cms_settings');
    assert(publicData?.site_name !== undefined, `Site settings site_name present: "${publicData?.site_name}"`);
    assert(publicData?.contact_email !== undefined, `Site settings contact_email present: "${publicData?.contact_email}"`);

    // 2. Developer authentication
    console.log('\n--- TEST GROUP 2: Developer Authentication ---');
    const { data: authData, error: authError } = await devClient.auth.signInWithPassword({
      email: 'developer@mrinstitute.edu',
      password: 'Developer@2026!'
    });
    assert(!authError && authData.session !== null, 'Developer successfully authenticated');

    // 3. Developer update of contact content
    console.log('\n--- TEST GROUP 3: Contact CMS Content Persistence ---');
    const testHeadline = `Get In Touch (Verified ${Date.now()})`;
    const testMapUrl = 'https://maps.google.com/maps?q=MR+Institute+of+Learning+Kerala&t=&z=14&ie=UTF8&iwloc=&output=embed';
    const testPhone = '+91 98765 43210';
    const testEmail = 'info@mrinstitute.edu';
    const testOfficeHours = 'Mon - Sat: 8:30 AM - 5:30 PM';

    const testContactContent = {
      headline: testHeadline,
      subheadline: 'We are here to answer your questions and guide you.',
      description: 'Have questions about admissions, courses, or charity programs? Our team is here to help you.',
      heroImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
      primaryCtaText: 'Send a Message',
      primaryCtaLink: '#contact-form',
      infoTitle: 'Contact Information',
      infoSubtitle: 'Fill out the form and our admissions team will get back to you within 24 hours.',
      mapEmbedUrl: testMapUrl,
      mapLocationName: 'MR Institute Main Campus, Knowledge City, Kerala',
      mapTitle: 'Our Campus Location',
      formTitle: 'Send Us a Message',
      submitButtonText: 'Submit Enquiry',
      portalSectionTitle: 'Institutional Portal Access',
      portalSectionSubtitle: 'Authorized staff and administrators can access their respective management portals here.',
      staffPortalButtonText: 'Staff Login',
      developerPortalButtonText: 'Developer Login'
    };

    const updatePayload = {
      contact_phone: testPhone,
      contact_email: testEmail,
      office_hours: testOfficeHours,
      seo: {
        title: 'Contact Us - MR Institute of Learning',
        description: 'Get in touch with MR Institute of Learning.',
        contactContent: testContactContent
      }
    };

    const { data: updatedData, error: updateError } = await devClient
      .from('cms_settings')
      .update(updatePayload)
      .eq('id', 'global')
      .select()
      .single();

    assert(!updateError, 'Developer can update Contact CMS & Settings');
    assert(updatedData?.seo?.contactContent?.headline === testHeadline, 'Contact headline persisted properly');
    assert(updatedData?.seo?.contactContent?.mapEmbedUrl === testMapUrl, 'Google Maps embed URL persisted properly');
    assert(updatedData?.contact_phone === testPhone, 'Primary phone number persisted');
    assert(updatedData?.office_hours === testOfficeHours, 'Office hours persisted');

    // 4. Verify Public client reads the updated contact content
    console.log('\n--- TEST GROUP 4: Public Client Fresh Read ---');
    const { data: freshPublicData, error: freshError } = await anonClient
      .from('cms_settings')
      .select('*')
      .eq('id', 'global')
      .single();

    assert(!freshError, 'Public client successfully fetches updated Contact data');
    assert(freshPublicData?.seo?.contactContent?.headline === testHeadline, 'Public client receives updated headline');
    assert(freshPublicData?.seo?.contactContent?.mapEmbedUrl === testMapUrl, 'Public client receives updated map URL');

    // 5. Verify Enquiry submission workflow remains intact
    console.log('\n--- TEST GROUP 5: Contact Form Enquiry CRM Workflow ---');
    const testEnqId = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const testEnquiry = {
      id: testEnqId,
      name: 'CMS Test User',
      email: 'cms_test@example.com',
      phone: '+91 99999 88888',
      subject: 'Admission Inquiry Test',
      message: 'This is a test enquiry to verify form submission continues to work.',
      status: 'new',
      created_at: new Date().toISOString()
    };

    const { error: enquiryError } = await anonClient
      .from('enquiries')
      .insert(testEnquiry);

    assert(!enquiryError, `Enquiry submission succeeds (ID: ${testEnqId})`);

    // Clean up test enquiry with dev client
    await devClient.from('enquiries').delete().eq('id', testEnqId);
    console.log('✅ Cleaned up temporary test enquiry');

  } catch (err) {
    console.error('Unexpected error during test execution:', err);
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runContactCmsTests();
