import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import StudentModuleView from "../pages/StudentModuleView";

export const MyRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<VulcanHome />} />
            <Route path="/Login" element={<VulcanoLogin />} />
            <Route path="/Register" element={<VulcanoRegister />} />
            <Route path="/Course" element={<CoursePage />} />
            <Route path="/ModuleView" element={<ModuleView />} />
            <Route path="/StudentModules" element={<StudentModuleView />} />
            <Route path="/StudentModules/:moduleId" element={<StudentModuleView />} />
            <Route path="/Review" element={<Review />} />
            <Route path="/Users" element={<UserManagement />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/layout" element={<Layout />}>
                <Route index element={<DashboardHome />} />
                <Route path="agendar" element={<ClassScheduling />} />
            </Route>
            <Route path="*" element={<Page404 />} />
        </Routes>
    </BrowserRouter>
);