import { BrowserRouter, Route, Routes } from "react-router-dom";
import VulcanHome from "../pages/VulcanHome"
import VulcanoLogin from "../components/VulcanoLogin";
import {Page404} from "../pages/Page404"

export const MyRoutes = () => (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<VulcanHome/>}/>
        <Route path="/Login" element={<VulcanoLogin/>}/>
        <Route path="/Course" element={<CoursePages/>}/>
        <Route path="/Review" />
        <Route path="*" element={<Page404/>}/>
    </Routes>
    </BrowserRouter>
)
