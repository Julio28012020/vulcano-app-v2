import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VulcanHome from "../pages/VulcanHome";
import VulcanoLogin from "../components/VulcanoLogin";
import VulcanoRegister from "../components/VulcanoRegister";
import Review from "../pages/Review";
import { Page404 } from "../pages/Page404";
import ModuleView from "../pages/ModuleView";
import CoursePage from "../pages/CoursePage";
import UserManagement from "../pages/UserManagement";
import Dashboard from "../pages/Dashboard";
import Layout from "../pages/layout/Layout";
import DashboardHome from "../pages/layout/DashboardHome";
import ClassScheduling from "../components/ClassScheduling";
import ClassManagement from "../components/ClassManagement";
import TeacherForm from "../components/TeacherForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <VulcanHome />,
    },
    {
        path: "/Login",
        element: <VulcanoLogin />,
    },
    {
        path: "/Register",
        element: <VulcanoRegister />,
    },
    {
        path: "/layout",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <DashboardHome />,
            },
            {
                path: "Course",
                element: <CoursePage />,
            },
            {
                path: "ModuleView",
                element: <ModuleView />,
            },
            {
                path: "agendar",
                element: <ClassScheduling />,
            },
            {
                path: "clases",
                element: <ClassManagement />,
            },
            {
                path: "docentes",
                element: <TeacherForm />,
            },
            {
                path: "Review",
                element: <Review />,
            },
            {
                path: "Users",
                element: <UserManagement />,
            }
        ],
    },
    {
        path: "*",
        element: <Page404 />,
    },
]);

export const MyRoutes = () => <RouterProvider router={router} />;
