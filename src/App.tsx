import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeInitializer } from "@/components/layout/theme-initializer";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

import LoginPage from "@/pages/login/login-page";
import DashboardPage from "@/pages/dashboard/dashboard-page";
import ServicesPage from "@/pages/services/services-page";
import GalleryPage from "@/pages/gallery/gallery-page";
import BlogPage from "@/pages/blog/blog-page";
import TestimonialsPage from "@/pages/testimonials/testimonials-page";
import FaqsPage from "@/pages/faqs/faqs-page";
import MessagesPage from "@/pages/messages/messages-page";
import SettingsPage from "@/pages/settings/settings-page";
import NotFoundPage from "@/pages/not-found-page";
import ServiceBuilderPage from "./pages/services/service-builder-page";

export default function App() {
  return (
    <ThemeInitializer>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/new" element={<ServiceBuilderPage />} />
                <Route
                  path="/services/edit/:id"
                  element={<ServiceBuilderPage />}
                />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/faqs" element={<FaqsPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
      </TooltipProvider>
    </ThemeInitializer>
  );
}
