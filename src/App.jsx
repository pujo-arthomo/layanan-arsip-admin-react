import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./app/login/LoginPage";
import DashboardPage from "./app/dashboard/DashboardPage";
import PemohonPage from "./app/pemohon/PemohonPage";
import ArsipPage from "./app/arsip/ArsipPage";
import RequireAuth from "./components/auth/RequireAuth";
import { AuthProvider } from "./components/auth/AuthProvider";

import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root ke dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </RequireAuth>
            }
          />

          <Route
            path="/pemohon"
            element={
              <RequireAuth>
                <DashboardLayout>
                  <PemohonPage />
                </DashboardLayout>
              </RequireAuth>
            }
          />

          <Route
            path="/arsip"
            element={
              <RequireAuth>
                <DashboardLayout>
                  <ArsipPage />
                </DashboardLayout>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;