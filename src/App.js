import React from "react";

import { useAuth } from "./context/AuthContext.js";
import Navbar from "./components/Layout/Navbar";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
// import UploadPage from "./pages/UploadPage";
import SearchPage from "./pages/SearchPage";
import AdminUserForm from "./components/Auth/AdminUserForm";
import { Navigate, Route, Routes } from "react-router-dom";
import UploadPage from "./pages/UploadPage.js";

function App() {
  const { token } = useAuth();

  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route
          path="/upload"
          // element={token ? <UploadPage /> : <Navigate to="/" />}
          element={<UploadPage />}
        />
        <Route
          path="/search"
          // element={token ? <SearchPage /> : <Navigate to="/" />}
          element={<SearchPage />}
        />
        <Route
          path="/admin"
          // element={token ? <AdminUserForm /> : <Navigate to="/" />}
          element={<AdminUserForm />}
        />
      </Routes>
    </>
  );
}

export default App;
