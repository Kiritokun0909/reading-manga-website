import React from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import AccountRoute from "./routes/AccountRoute";
import AdminRoute from "./routes/AdminRoute";
import SiteRoute from "./routes/SiteRoute";

import "./styles/App.css";
import Header from "./components/site/Header";
import Footer from "./components/site/Footer";
import HandleCode from "./utilities/HandleCode";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Header />
        <div className="content">
          <div className="column-item__sidebar-one"></div>
          <div className="column-item__main-column">
            <Routes>
              {/* public routes */}
              <Route path="/*" element={<SiteRoute />} />
              {/* account routes */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={[HandleCode.ROLE_USER, HandleCode.ROLE_ADMIN]}
                  />
                }
              >
                <Route path="/account/*" element={<AccountRoute />} />
              </Route>
              {/* admin routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={[HandleCode.ROLE_ADMIN]} />
                }
              >
                <Route path="/admin/*" element={<AdminRoute />} />
              </Route>
            </Routes>
          </div>
          <div className="column-item__sidebar-two"></div>
        </div>
        <Footer />
      </AuthProvider>
    </div>
  );
}
