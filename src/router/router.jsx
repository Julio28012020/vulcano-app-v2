import { BrowserRouter, Route, Routes } from "react-router-dom";
import VulcanHome from "../pages/VulcanHome"
import VulcanoLogin from "../components/VulcanoLogin";
import VulcanoRegister from "../components/VulcanoRegister";
import Review from "../pages/Review";
import { Page404 } from "../pages/Page404"
import ModuleView from "../pages/ModuleView"
import CoursePage from "../pages/CoursePage"
// Importamos el Layout al que redirigimos después del login exitoso
import Layout from "../pages/layout/Layout";
import DashboardHome from "../pages/layout/DashboardHome";
import ClassScheduling from "../components/ClassScheduling";

export const MyRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<VulcanHome />} />
            <Route path="/Login" element={<VulcanoLogin />} />
            <Route path="/Register" element={<VulcanoRegister />} />
            <Route path="/Course" element={<CoursePage />} />
            <Route path="/ModuleView" element={<ModuleView />} />
            <Route path="/Review" element={<Review />} />
            {/* Ruta principal con barra lateral */}
            <Route path="/layout" element={<Layout />}>
                {/* Lo que se carga por defecto en /layout */}
                <Route index element={<DashboardHome />} />
                {/* Lo que se carga en /layout/agendar */}
                <Route path="agendar" element={<ClassScheduling />} />
            </Route>
            <Route path="*" element={<Page404 />} />
        </Routes>
    </BrowserRouter>
)
