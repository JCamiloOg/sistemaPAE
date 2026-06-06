import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import Index from "@/features/auth/IndexPage";
import { NotFound } from "@/app/routes/NotFoundPage";
import Users from "@/features/dashboard/pages/UsersPage";
import Assistance from "@/features/dashboard/pages/AssistancePage";
import Loader from "@/shared/components/loader/Loader";
import { GlobalLoaderController } from "@/shared/components/loader/LoaderGlobalController";
import StudentsPage from "@/features/dashboard/pages/StudentsPage";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import CoursesPage from "@/features/dashboard/pages/CoursesPage";
import NotificationsPage from "@/features/dashboard/pages/NotificationsPage";

const rootRoute = createRootRoute({
    notFoundComponent: () => <NotFound />,
    component: () => (
        <>
            <Loader />
            <GlobalLoaderController />

            <Outlet />
        </>
    ),
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <Index />,
});


const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: () => <DashboardLayout />,
});

const dashboardHomeRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "/",
    component: () => <DashboardPage />
});


const usersRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "users",
    validateSearch: (search) => ({
        page: Number(search.page || 1),
    }),
    component: () => <Users />,
});

const assistanceRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "assistance",
    validateSearch: (search) => ({
        course: search.course ? Number(search.course) : undefined,
        date: search.date,
    }),
    component: () => <Assistance />,
});

const studentsRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "students",
    validateSearch: (search) => ({
        course: search.course ? Number(search.course) : undefined,
        page: search.course ? Number(search.page || 1) : undefined,
        search: search.search ? search.search : undefined,
    }),
    component: () => <StudentsPage />
});

const coursesRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "courses",
    validateSearch: (search) => ({
        page: Number(search.page || 1),
    }),
    component: () => <CoursesPage />
});


const notificationsRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: "notifications",
    validateSearch: (search) => ({
        page: Number(search.page || 1),
    }),
    component: () => <NotificationsPage />
});


const routeTree = rootRoute.addChildren([
    indexRoute,
    dashboardRoute.addChildren([dashboardHomeRoute, usersRoute, assistanceRoute, studentsRoute, coursesRoute, notificationsRoute]),
]);

export const router = createRouter({ routeTree });
