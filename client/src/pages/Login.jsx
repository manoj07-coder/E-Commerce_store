import React, { useState } from "react";
import AuthForm from "../features/auth/AuthForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice.js";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (payload) => {
    setLoading(true);
    try {
      const res = await dispatch(login(payload));
      if (res?.payload?.accessToken) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <AuthForm onSubmit={handleLogin} loading={loading} />
    </div>
  );
};

export default Login;
