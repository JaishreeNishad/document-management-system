import React, { useState } from "react";

export default function AdminUserForm() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`User Created:\n${form.username}`);
  };

  return (
    <div className="container mt-5">
      <h4>Create New User</h4>
      <form onSubmit={handleSubmit} className="w-50">
        <input
          className="form-control my-2"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="form-control my-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-primary mt-2">Create</button>
      </form>
    </div>
  );
}
