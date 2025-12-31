import React, { useContext, useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      return setError("Please fill all the fields");
    }

    if (!validateEmail(email)) {
      return setError("Please enter a valid email");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    setError("");

    try {
      let profileImageUrl = "";

      if (profilePic) {
        const uploadRes = await uploadImage(profilePic);
        profileImageUrl = uploadRes.imageUrl || "";
      }

      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
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

  // ✅ Google Signup
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
      setError("Google signup failed");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSignup}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="btn-primary">SIGN UP</button>

        <div className="mt-4 flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google signup failed")} />
        </div>

        <p className="mt-3 text-sm">
          Already have an account? <Link to="/login" className="underline">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
