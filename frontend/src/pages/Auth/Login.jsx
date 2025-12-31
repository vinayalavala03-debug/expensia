import React, { useContext, useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return setError("Invalid email address");
    }

    if (!password || password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    setError("");

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      updateUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again"
      );
    }
  };

  // ✅ Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, {
        token: credentialResponse.credential,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      updateUser(user);
      navigate("/dashboard");
    } catch {
      setError("Google login failed");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleLogin}>
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="btn-primary">LOGIN</button>

        <div className="mt-4 flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google login failed")} />
        </div>

        <p className="mt-3 text-sm">
          Don’t have an account? <Link to="/signup" className="underline">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
