import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from './constants';
import { AuthProvider, ThemeProvider, SettingsProvider, NotificationProvider, LoadingProvider } from './contexts';
import { RoleRoute } from './components/guards/RoleRoute';

const PublicLayout = lazy(() => import('./layouts/PublicLayout').then(m => ({ default: m.PublicLayout })));
const DeveloperLayout = lazy(() => import('./layouts/DeveloperLayout').then(m => ({ default: m.DeveloperLayout })));
const OfficeLayout = lazy(() => import('./layouts/OfficeLayout').then(m => ({ default: m.OfficeLayout })));
const AuthLayout = lazy(() => import('./layouts/AuthLayout').then(m => ({ default: m.AuthLayout })));
const BlankLayout = lazy(() => import('./layouts/BlankLayout').then(m => ({ default: m.BlankLayout })));

// Lazy loaded Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const Services = lazy(() => import('./pages/Services'));
const Charity = lazy(() => import('./pages/Charity'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const OfficeDashboard = lazy(() => import('./pages/office/OfficeDashboard'));
const AdmissionsManagement = lazy(() => import('./pages/office/AdmissionsManagement'));
const StudentDirectory = lazy(() => import('./pages/office/StudentDirectory'));
const ScholarshipManagement = lazy(() => import('./pages/office/ScholarshipManagement'));
const CharityApplications = lazy(() => import('./pages/office/CharityApplications'));
const EnquiryCRM = lazy(() => import('./pages/office/EnquiryCRM'));
const Notifications = lazy(() => import('./pages/office/Notifications'));
const Reports = lazy(() => import('./pages/office/Reports'));
const DeveloperDashboard = lazy(() => import('./pages/developer/DeveloperDashboard'));
const DeveloperHomepage = lazy(() => import('./pages/developer/DeveloperHomepage'));
const DeveloperAbout = lazy(() => import('./pages/developer/DeveloperAbout'));
const DeveloperCourses = lazy(() => import('./pages/developer/DeveloperCourses'));
const DeveloperServices = lazy(() => import('./pages/developer/DeveloperServices'));
const DeveloperCharity = lazy(() => import('./pages/developer/DeveloperCharity'));
const DeveloperGallery = lazy(() => import('./pages/developer/DeveloperGallery'));
const DeveloperForms = lazy(() => import('./pages/developer/DeveloperForms'));
const DeveloperFormBuilder = lazy(() => import('./pages/developer/DeveloperFormBuilder'));
const DeveloperFormSubmissions = lazy(() => import('./pages/developer/DeveloperFormSubmissions'));
const DeveloperMedia = lazy(() => import('./pages/developer/DeveloperMedia'));
const DeveloperNotices = lazy(() => import('./pages/developer/DeveloperNotices'));
const DeveloperSettings = lazy(() => import('./pages/developer/DeveloperSettings'));
const NotFound = lazy(() => import('./pages/error/NotFound'));
const ServerError = lazy(() => import('./pages/error/ServerError'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

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
