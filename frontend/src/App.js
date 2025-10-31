import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ComplianceMapPage from "./pages/ComplianceMapPage";
import ReportPage from "./pages/ReportPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginRegister from "./pages/Login"; // renamed import
import styles from "./App.module.css";

// Layout wrapper
const AppLayout = ({ user, onLogin }) => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";
  const navigate = useNavigate();

  // When user logs in, redirect to home
  const handleLogin = (userData) => {
    onLogin(userData);
    navigate("/");
  };

  return (
    <div className={styles.appContainer}>
      {!hideLayout && <Header />}
      <main className={`${styles.mainContent} container`}>
        <Routes>
          {/* Redirect root path to login if not logged in */}
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/map"
            element={user ? <ComplianceMapPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/report"
            element={user ? <ReportPage /> : <Navigate to="/login" replace />}
          />
          
          {/* ✅ Super Admin Page — accessible without login */}
          <Route path="/super-admin" element={<AdminDashboard />} />

          <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppLayout user={user} onLogin={setUser} />
    </Router>
  );
}

export default App;
