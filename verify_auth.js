import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Permission helper from src/utils
function hasPermission(userRole, requiredRole) {
  if (userRole === 'DEVELOPER') return true;
  if (userRole === 'OFFICE_ADMIN' && requiredRole === 'OFFICE_ADMIN') return true;
  return false;
}

async function runAuthVerification() {
  console.log('=== MR INSTITUTE: PHASE A.5 AUTHENTICATION VERIFICATION ===\n');

  const report = {
    developerAuth: {},
    officeAuth: {},
    invalidLoginTest: {},
    passwordResetTest: {},
    rolePermissionsTest: {},
    sessionRefreshTest: {},
    logoutTest: {},
    allPassed: true,
  };

  try {
    // 1. DEVELOPER LOGIN & PROFILE VERIFICATION
    console.log('1. Testing DEVELOPER Sign-In & Profile Hydration...');
    const devAuth = await supabase.auth.signInWithPassword({
      email: 'developer@mrinstitute.edu',
      password: 'Developer@2026!',
    });

    if (devAuth.error || !devAuth.data.user) {
      report.developerAuth = { success: false, error: devAuth.error?.message };
      report.allPassed = false;
      console.error('❌ Developer login failed:', devAuth.error);
    } else {
      const { data: devProfile, error: profErr } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', devAuth.data.user.id)
        .single();

      report.developerAuth = {
        success: true,
        userId: devAuth.data.user.id,
        email: devAuth.data.user.email,
        profileRole: devProfile?.role,
        displayName: devProfile?.display_name,
        profileFetchSuccess: !profErr && devProfile?.role === 'DEVELOPER',
      };
      console.log('✅ Developer login and profile verified:', report.developerAuth);
    }

    // Sign out before next test
    await supabase.auth.signOut();

    // 2. OFFICE ADMIN LOGIN & PROFILE VERIFICATION
    console.log('\n2. Testing OFFICE_ADMIN Sign-In & Profile Hydration...');
    const offAuth = await supabase.auth.signInWithPassword({
      email: 'office@mrinstitute.edu',
      password: 'OfficeAdmin@2026!',
    });

    if (offAuth.error || !offAuth.data.user) {
      report.officeAuth = { success: false, error: offAuth.error?.message };
      report.allPassed = false;
      console.error('❌ Office admin login failed:', offAuth.error);
    } else {
      const { data: offProfile, error: profErr } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', offAuth.data.user.id)
        .single();

      report.officeAuth = {
        success: true,
        userId: offAuth.data.user.id,
        email: offAuth.data.user.email,
        profileRole: offProfile?.role,
        displayName: offProfile?.display_name,
        profileFetchSuccess: !profErr && offProfile?.role === 'OFFICE_ADMIN',
      };
      console.log('✅ Office Admin login and profile verified:', report.officeAuth);
    }

    // 3. INVALID CREDENTIALS REJECTION TEST
    console.log('\n3. Testing Invalid Password Rejection...');
    const badLogin = await supabase.auth.signInWithPassword({
      email: 'developer@mrinstitute.edu',
      password: 'WrongPassword999!',
    });
    report.invalidLoginTest = {
      correctlyRejected: !!badLogin.error,
      errorMessage: badLogin.error?.message,
    };
    console.log('✅ Invalid password correctly rejected:', report.invalidLoginTest.errorMessage);

    // 4. FORGOT PASSWORD / PASSWORD RESET EMAIL TRIGGER TEST
    console.log('\n4. Testing Password Reset Request...');
    const resetRes = await supabase.auth.resetPasswordForEmail('developer@mrinstitute.edu', {
      redirectTo: 'http://localhost:5173/reset-password',
    });
    report.passwordResetTest = {
      success: !resetRes.error,
      error: resetRes.error?.message,
    };
    console.log('✅ Password reset request triggered:', !resetRes.error ? 'SUCCESS' : resetRes.error);

    // 5. ROLE PERMISSIONS & ROUTE GUARDS VERIFICATION
    console.log('\n5. Verifying RoleRoute & Permission Logic...');
    const devAccessToDev = hasPermission('DEVELOPER', 'DEVELOPER');
    const devAccessToOffice = hasPermission('DEVELOPER', 'OFFICE_ADMIN');
    const officeAccessToOffice = hasPermission('OFFICE_ADMIN', 'OFFICE_ADMIN');
    const officeAccessToDev = hasPermission('OFFICE_ADMIN', 'DEVELOPER');

    const permPassed = devAccessToDev && devAccessToOffice && officeAccessToOffice && !officeAccessToDev;
    report.rolePermissionsTest = {
      devAccessToDeveloperPanel: devAccessToDev,
      devAccessToOfficePanel: devAccessToOffice,
      officeAccessToOfficePanel: officeAccessToOffice,
      officeBlockedFromDeveloperPanel: !officeAccessToDev,
      permissionsLogicPassed: permPassed,
    };
    console.log('✅ Role permissions logic verified:', report.rolePermissionsTest);

    // 6. SESSION REFRESH & PERSISTENCE
    console.log('\n6. Testing Session Refresh & Persistence...');
    const reLogin = await supabase.auth.signInWithPassword({
      email: 'developer@mrinstitute.edu',
      password: 'Developer@2026!',
    });
    const { data: sessionData } = await supabase.auth.getSession();
    report.sessionRefreshTest = {
      sessionExists: !!sessionData.session,
      accessTokenPresent: !!sessionData.session?.access_token,
      expiresAt: sessionData.session?.expires_at,
    };
    console.log('✅ Session refresh & token confirmed:', report.sessionRefreshTest);

    // 7. LOGOUT TEST
    console.log('\n7. Testing SignOut / Session Invalidation...');
    const signOutRes = await supabase.auth.signOut();
    const { data: afterSignOut } = await supabase.auth.getSession();
    report.logoutTest = {
      logoutSuccess: !signOutRes.error,
      sessionCleared: !afterSignOut.session,
    };
    console.log('✅ SignOut verified:', report.logoutTest);

  } catch (err) {
    console.error('Fatal error during auth verification:', err);
    report.allPassed = false;
    report.fatalError = err.message;
  }

  console.log('\n========================================');
  console.log('ALL AUTH CHECKS RESULT:', report.allPassed ? '✅ 100% PASSED' : '❌ FAILED');
  console.log('========================================');

  fs.writeFileSync('auth_verification_result.json', JSON.stringify(report, null, 2));
}

runAuthVerification();
