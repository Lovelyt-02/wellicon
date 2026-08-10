import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import "@/App.css";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";

import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import Products from "@/pages/public/Products";
import ProductDetail from "@/pages/public/ProductDetail";
import Contact from "@/pages/public/Contact";
import TermsConditions from "@/pages/public/TermsConditions";
import PrivacyPolicy from "@/pages/public/PrivacyPolicy";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminInquiries from "@/pages/admin/AdminInquiries";
import AdminSettings from "@/pages/admin/AdminSettings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider >
  );
}

export default App;
