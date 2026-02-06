import { createRouter, RouterProvider, createRoute, createRootRoute, redirect, Outlet } from '@tanstack/react-router';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import BrowseJobsPage from './pages/dashboard/BrowseJobsPage';
import MyApplicationsPage from './pages/dashboard/MyApplicationsPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import UpdatesPage from './pages/dashboard/UpdatesPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import JobDetailPage from './pages/dashboard/JobDetailPage';
import AdminLayout from './pages/admin/AdminLayout';
import VacanciesAdminPage from './pages/admin/VacanciesAdminPage';
import PostsAdminPage from './pages/admin/PostsAdminPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardLayout,
});

const browseJobsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: BrowseJobsPage,
});

const myApplicationsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/applications',
  component: MyApplicationsPage,
});

const messagesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/messages',
  component: MessagesPage,
});

const updatesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/updates',
  component: UpdatesPage,
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/profile',
  component: ProfilePage,
});

const jobDetailRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/job/$jobId',
  component: JobDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
});

const adminVacanciesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: VacanciesAdminPage,
});

const adminPostsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/posts',
  component: PostsAdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  onboardingRoute,
  dashboardRoute.addChildren([
    browseJobsRoute,
    myApplicationsRoute,
    messagesRoute,
    updatesRoute,
    profileRoute,
    jobDetailRoute,
  ]),
  adminRoute.addChildren([adminVacanciesRoute, adminPostsRoute]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
