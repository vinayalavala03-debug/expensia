import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserProvider from "./context/UserContext";
import Calculator from "./components/Layouts/Calculator";

// Lazy imports
const Signup = lazy(() => import("./pages/Auth/Signup"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Income = lazy(() => import("./pages/Dashboard/Income"));
const Expense = lazy(() => import("./pages/Dashboard/Expense"));
const Trip = lazy(() => import("./pages/Dashboard/Trip"));
const TripDetails = lazy(() => import("./pages/Dashboard/TripDetails"));

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Home />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/dashboard/trips" element={<Trip />} />
            <Route path="/dashboard/trips/:id" element={<TripDetails />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </Suspense>
      </Router>

      <Toaster toastOptions={{ style: { fontSize: "13px" } }} />
    </UserProvider>
  );
};

export default App;

// Root route logic
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};
