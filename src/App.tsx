import { Route, Routes } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminAboutPage from "./pages/admin/AdminAboutPage";
import AdminAppointmentPage from "./pages/admin/AdminAppointmentPage";
import AdminContactPage from "./pages/admin/AdminContactPage";
import AdminDoctorPage from "./pages/admin/AdminDoctorPage";
import AdminFooterPage from "./pages/admin/AdminFooterPage";
import AdminGalleryPage from "./pages/admin/AdminGalleryPage";
import AdminHeaderPage from "./pages/admin/AdminHeaderPage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminTestimonialsPage from "./pages/admin/AdminTestimonialsPage";
import AdminTopBarPage from "./pages/admin/AdminTopBarPage";
import DoctorPage from "./pages/DoctorPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import ServicePage from "./pages/ServicePage";
import RequireAdmin from "./components/admin/RequireAdmin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/home" element={<AdminHomePage />} />
        <Route path="/admin/header" element={<AdminHeaderPage />} />
        <Route path="/admin/above-header" element={<AdminTopBarPage />} />
        <Route path="/admin/about" element={<AdminAboutPage />} />
        <Route path="/admin/doctor" element={<AdminDoctorPage />} />
        <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
        <Route path="/admin/appointment" element={<AdminAppointmentPage />} />
        <Route path="/admin/contact" element={<AdminContactPage />} />
        <Route path="/admin/services" element={<AdminServicesPage />} />
        <Route path="/admin/gallery" element={<AdminGalleryPage />} />
        <Route path="/admin/footer" element={<AdminFooterPage />} />
      </Route>
      <Route path="/doctor" element={<DoctorPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/service/:slug" element={<ServicePage />} />
    </Routes>
  );
}
