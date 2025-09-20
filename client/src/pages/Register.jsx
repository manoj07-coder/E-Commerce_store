import React, { useState } from "react";
import AuthForm from "../features/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../features/auth/authSlice.js";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (payload) => {
    setLoading(true);
    try {
      const res = await dispatch(register(payload));
      console.log(res);

      if (res) {
        navigate("/login");
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
      <AuthForm
        onSubmit={handleRegister}
        submitLabel="Create account"
        showName
        loading={loading}
      />
    </div>
  );
};

export default Register;
