import React, { useState } from "react";

const AuthForm = ({
  onSubmit,
  submitLabel = "Submit",
  loading = false,
  showName = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = showName ? { name, email, password } : { email, password };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showName && (
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full border rounded px-3 py-2"
        />
      )}
      <input
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        className="w-full border rounded px-3 py-2"
      />
      <input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border rounded px-3 py-2"
      />
      <button className="px-4 py-2  rounded bg-primary text-white w-full">
        {loading ? "Please wait..." : submitLabel}
      </button>
    </form>
  );
};

export default AuthForm;
