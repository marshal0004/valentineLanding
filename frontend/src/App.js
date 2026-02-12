import React from "react";
import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import PasswordGate from "@/pages/PasswordGate";
import Experience from "@/pages/Experience";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import SectionEditor from "@/pages/admin/SectionEditor";
import Settings from "@/pages/admin/Settings";
import QRCodePage from "@/pages/admin/QRCodePage";

function App() {
  return (
    <div className="App" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(26, 10, 16, 0.9)',
            border: '1px solid rgba(255, 45, 85, 0.3)',
            color: '#f4e0e0',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PasswordGate />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="section/:id" element={<SectionEditor />} />
            <Route path="settings" element={<Settings />} />
            <Route path="qr" element={<QRCodePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
