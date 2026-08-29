import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from './constants';
import { AuthProvider, ThemeProvider, SettingsProvider, NotificationProvider, LoadingProvider } from './contexts';
import { RoleRoute } from './components/guards/RoleRoute';
import { safeLazy } from './utils/safeLazy';

const PublicLayout = safeLazy(() => import('./layouts/PublicLayout').then(m => ({ default: m.PublicLayout })));
const DeveloperLayout = safeLazy(() => import('./layouts/DeveloperLayout').then(m => ({ default: m.DeveloperLayout })));
const OfficeLayout = safeLazy(() => import('./layouts/OfficeLayout').then(m => ({ default: m.OfficeLayout })));
const AuthLayout = safeLazy(() => import('./layouts/AuthLayout').then(m => ({ default: m.AuthLayout })));
const BlankLayout = safeLazy(() => import('./layouts/BlankLayout').then(m => ({ default: m.BlankLayout })));

// Lazy loaded Pages
const Home = safeLazy(() => import('./pages/Home'));
const About = safeLazy(() => import('./pages/About'));
const Courses = safeLazy(() => import('./pages/Courses'));
const CourseDetails = safeLazy(() => import('./pages/CourseDetails'));
const Services = safeLazy(() => import('./pages/Services'));
const Charity = safeLazy(() => import('./pages/Charity'));
const Gallery = safeLazy(() => import('./pages/Gallery'));
const Contact = safeLazy(() => import('./pages/Contact'));
const Login = safeLazy(() => import('./pages/Login'));
const ForgotPassword = safeLazy(() => import('./pages/ForgotPassword'));
const ResetPassword = safeLazy(() => import('./pages/ResetPassword'));
const OfficeDashboard = safeLazy(() => import('./pages/office/OfficeDashboard'));
const AdmissionsManagement = safeLazy(() => import('./pages/office/AdmissionsManagement'));
const StudentDirectory = safeLazy(() => import('./pages/office/StudentDirectory'));
const ScholarshipManagement = safeLazy(() => import('./pages/office/ScholarshipManagement'));
const CharityApplications = safeLazy(() => import('./pages/office/CharityApplications'));
const EnquiryCRM = safeLazy(() => import('./pages/office/EnquiryCRM'));
const Notifications = safeLazy(() => import('./pages/office/Notifications'));
const Reports = safeLazy(() => import('./pages/office/Reports'));
const DeveloperDashboard = safeLazy(() => import('./pages/developer/DeveloperDashboard'));
const DeveloperHomepage = safeLazy(() => import('./pages/developer/DeveloperHomepage'));
const DeveloperAbout = safeLazy(() => import('./pages/developer/DeveloperAbout'));
const DeveloperCourses = safeLazy(() => import('./pages/developer/DeveloperCourses'));
const DeveloperServices = safeLazy(() => import('./pages/developer/DeveloperServices'));
const DeveloperCharity = safeLazy(() => import('./pages/developer/DeveloperCharity'));
const DeveloperGallery = safeLazy(() => import('./pages/developer/DeveloperGallery'));
const DeveloperForms = safeLazy(() => import('./pages/developer/DeveloperForms'));
const DeveloperFormBuilder = safeLazy(() => import('./pages/developer/DeveloperFormBuilder'));
const DeveloperFormSubmissions = safeLazy(() => import('./pages/developer/DeveloperFormSubmissions'));
const DeveloperMedia = safeLazy(() => import('./pages/developer/DeveloperMedia'));
const DeveloperNotices = safeLazy(() => import('./pages/developer/DeveloperNotices'));
const DeveloperTestimonials = safeLazy(() => import('./pages/developer/DeveloperTestimonials'));
const DeveloperContact = safeLazy(() => import('./pages/developer/DeveloperContact'));
const DeveloperActivityLogs = safeLazy(() => import('./pages/developer/DeveloperActivityLogs'));
const DeveloperSettings = safeLazy(() => import('./pages/developer/DeveloperSettings'));
const NotFound = safeLazy(() => import('./pages/error/NotFound'));
const ServerError = safeLazy(() => import('./pages/error/ServerError'));
const Unauthorized = safeLazy(() => import('./pages/Unauthorized'));

import { ErrorBoundary } from './components/guards/ErrorBoundary';
import { PageLoader } from './components/ui/Loaders';
import { OfflineBanner } from './components/ui/OfflineBanner';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { UpdateNotification } from './components/pwa/UpdateNotification';
import { Suspense, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
const GlobalAppEffects = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics on mount
    import('./services/AnalyticsService').then(({ AnalyticsService }) => {
      AnalyticsService.initialize();
    });
  }, []);

  useEffect(() => {
    // Track page views on route change
    import('./services/AnalyticsService').then(({ AnalyticsService }) => {
      AnalyticsService.trackPageView(location.pathname + location.search);
    });
  }, [location]);

  useEffect(() => {
    const handleOnline = () => {
      Promise.all([
        import('./services/OfflineQueue'),
        import('./repositories/operations/enquiriesRepository'),
        import('./repositories/operations/formSubmissionsRepository')
      ]).then(([{ OfflineQueue }, { enquiriesRepository }, { formSubmissionsRepository }]) => {
        OfflineQueue.syncWithServer({
          enquiries: enquiriesRepository,
          formSubmissions: formSubmissionsRepository
        });
      });
    };
    window.addEventListener('online', handleOnline);
    // Initial check just in case it came online before listener attached
    if (navigator.onLine) {
      handleOnline();
    }
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <GlobalAppEffects />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: ROUTES.PUBLIC.HOME, element: <Home /> },
          { path: ROUTES.PUBLIC.ABOUT, element: <About /> },
          { path: ROUTES.PUBLIC.COURSES, element: <Courses /> },
          { path: ROUTES.PUBLIC.COURSE_DETAILS, element: <CourseDetails /> },
          { path: ROUTES.PUBLIC.SERVICES, element: <Services /> },
          { path: ROUTES.PUBLIC.CHARITY, element: <Charity /> },
          { path: ROUTES.PUBLIC.GALLERY, element: <Gallery /> },
          { path: ROUTES.PUBLIC.CONTACT, element: <Contact /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.AUTH.LOGIN, element: <Login /> },
          { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <ForgotPassword /> },
          { path: ROUTES.AUTH.RESET_PASSWORD, element: <ResetPassword /> },
        ],
      },
      {
        path: ROUTES.OFFICE.DASHBOARD,
        element: (
          <RoleRoute allowedRoles={['OFFICE_ADMIN', 'DEVELOPER']}>
            <OfficeLayout />
          </RoleRoute>
        ),
        children: [
          { index: true, element: <OfficeDashboard /> },
          { path: ROUTES.OFFICE.APPLICATIONS, element: <AdmissionsManagement /> },
          { path: ROUTES.OFFICE.STUDENTS, element: <StudentDirectory /> },
          { path: ROUTES.OFFICE.SCHOLARSHIPS, element: <ScholarshipManagement /> },
          { path: ROUTES.OFFICE.CHARITY, element: <CharityApplications /> },
          { path: ROUTES.OFFICE.ENQUIRIES, element: <EnquiryCRM /> },
          { path: ROUTES.OFFICE.NOTIFICATIONS, element: <Notifications /> },
          { path: ROUTES.OFFICE.REPORTS, element: <Reports /> },
        ],
      },
      {
        path: ROUTES.DEVELOPER.DASHBOARD,
        element: (
          <RoleRoute allowedRoles={['DEVELOPER']}>
            <DeveloperLayout />
          </RoleRoute>
        ),
        children: [
          { index: true, element: <DeveloperDashboard /> },
          { path: ROUTES.DEVELOPER.CMS.HOMEPAGE, element: <DeveloperHomepage /> },
          { path: ROUTES.DEVELOPER.CMS.ABOUT, element: <DeveloperAbout /> },
          { path: ROUTES.DEVELOPER.CMS.COURSES, element: <DeveloperCourses /> },
          { path: ROUTES.DEVELOPER.CMS.SERVICES, element: <DeveloperServices /> },
          { path: ROUTES.DEVELOPER.CMS.CHARITY, element: <DeveloperCharity /> },
          { path: ROUTES.DEVELOPER.CMS.GALLERY, element: <DeveloperGallery /> },
          { path: ROUTES.DEVELOPER.CMS.FORMS, element: <DeveloperForms /> },
          { path: ROUTES.DEVELOPER.CMS.FORM_BUILDER, element: <DeveloperFormBuilder /> },
          { path: ROUTES.DEVELOPER.CMS.FORM_SUBMISSIONS, element: <DeveloperFormSubmissions /> },
          { path: ROUTES.DEVELOPER.CMS.MEDIA, element: <DeveloperMedia /> },
          { path: ROUTES.DEVELOPER.CMS.NOTICES, element: <DeveloperNotices /> },
          { path: ROUTES.DEVELOPER.CMS.TESTIMONIALS, element: <DeveloperTestimonials /> },
          { path: ROUTES.DEVELOPER.CMS.CONTACT, element: <DeveloperContact /> },
          { path: ROUTES.DEVELOPER.SYSTEM_LOGS, element: <DeveloperActivityLogs /> },
          { path: ROUTES.DEVELOPER.SETTINGS, element: <DeveloperSettings /> },
        ],
      },
      {
        element: <BlankLayout />,
        children: [
          { path: ROUTES.ERROR.UNAUTHORIZED, element: <Unauthorized /> },
          { path: ROUTES.ERROR.SERVER_ERROR, element: <ServerError /> },
          { path: "*", element: <NotFound /> },
        ],
      }
    ]
  }
]);


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <NotificationProvider>
            <LoadingProvider>
              <ErrorBoundary>
                <OfflineBanner />
                <UpdateNotification />
                <InstallPrompt />
                <Suspense fallback={<PageLoader />}>
                  <RouterProvider router={router} />
                </Suspense>
              </ErrorBoundary>
            </LoadingProvider>
          </NotificationProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
