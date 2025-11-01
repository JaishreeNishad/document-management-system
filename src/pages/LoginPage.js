import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    navigate("/otp", { state: { mobile: `+91 ${mobile}` } });
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobile(value);
    }
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
              className="bi bi-shield-check text-primary"
              style={{ fontSize: "2.5rem" }}
            ></i>
            {/* <span className="ms-2 fs-2 fw-bold bg-red-200">DMS</span> */}
          </div>

          <h2 className="fw-bold mb-2">Login</h2>
          <p className="text-muted mb-4">
            Please enter your mobile number to receive an OTP
          </p>

          <div className="text-start mb-4">
            <label htmlFor="mobile" className="form-label text-muted ms-1">
              Mobile Number
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0">+91</span>
              <input
                type="tel"
                id="mobile"
                className="form-control"
                placeholder="98765 43210"
                value={mobile}
                onChange={handleMobileChange}
                maxLength={10}
                style={{ padding: "0.75rem 1rem", borderLeft: "none" }}
              />
            </div>
          </div>

          <button
            onClick={handleSendOtp}
            className="btn btn-primary w-100 py-2 fw-bold"
            style={{ borderRadius: "10px" }}
          >
            Get OTP
          </button>
        </div>
      </div>
    </div>
  );
}
