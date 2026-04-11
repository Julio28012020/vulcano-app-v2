import { BrowserRouter, Route, Routes } from "react-router-dom";
import VulcanHome from "../pages/VulcanHome"
import VulcanoLogin from "../components/VulcanoLogin";
import Review from "../pages/Review";
import { Page404 } from "../pages/Page404"

export const MyRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<VulcanHome/>}/>
            <Route path="/Login" element={<VulcanoLogin/>}/>
            <Route path="/Review" element={<Review/>}/>
            <Route path="*" element={<Page404/>}/>
        </Routes>
    </BrowserRouter>
)
