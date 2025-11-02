import React, { useState } from "react";

export default function AdminUserForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      alert(`User Created:\nUsername: ${form.username}`);
      setForm({ username: "", password: "" });
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (error) setError(null);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "20px",
          border: "none",
        }}
      >
        <div className="card-body text-center">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <i
              className="bi bi-person-plus-fill text-primary"
              style={{ fontSize: "2.5rem" }}
            ></i>
          </div>

          <h2 className="fw-bold mb-2">Create New User</h2>
          <p className="text-muted mb-4">
            Enter username and password for new user
          </p>

          <form onSubmit={handleSubmit}>
            <div className="text-start mb-3">
              <label htmlFor="username" className="form-label text-muted ms-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                style={{ padding: "0.75rem 1rem" }}
              />
            </div>

            <div className="text-start mb-4">
              <label htmlFor="password" className="form-label text-muted ms-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                style={{ padding: "0.75rem 1rem" }}
              />
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-100 py-2 fw-bold"
              style={{ borderRadius: "10px" }}
            >
              {isLoading ? "Creating User..." : "Create User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
