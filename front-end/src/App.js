import React from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import AccountRoute from "./routes/AccountRoute";
import AdminRoute from "./routes/AdminRoute";
import SiteRoute from "./routes/SiteRoute";

import "./styles/App.css";
import HandleCode from "./utilities/HandleCode";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          {/* public routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<SiteRoute />} />
          </Route>

          {/* account routes */}
          <Route
            element={<ProtectedRoute allowedRoles={[HandleCode.ROLE_USER]} />}
          >
            <Route path="/account/*" element={<AccountRoute />} />
          </Route>

          {/* admin routes */}
          <Route
            element={<ProtectedRoute allowedRoles={[HandleCode.ROLE_ADMIN]} />}
          >
            <Route path="/admin/*" element={<AdminRoute />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}
