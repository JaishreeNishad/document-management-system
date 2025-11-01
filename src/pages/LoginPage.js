import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState({ name: "login", mobile: "" });
  const navigate = useNavigate();

  // ✅ Handle OTP generation
  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError(null);
    setIsLoading(true);

    const mobileNumberPayload = {
      mobile_number: mobile,
    };

    try {
      // 1. API Call: Generate OTP using native fetch
      const response = await fetch(
        "https://apis.allsoft.co/api/documentManagement/generateOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mobileNumberPayload),
        }
      );

      const responseData = await response.json();
      console.log("Generate OTP API Response:", responseData);
      navigate("/otp");
    } catch (e) {
      console.error("Network or Fetch Error:", e);
      setError(
        "Could not connect to the API server. Check your network connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits
    if (value.length <= 10) setMobile(value);
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

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button
            onClick={handleSendOtp}
            disabled={isLoading}
            className="btn btn-primary w-100 py-2 fw-bold"
            style={{ borderRadius: "10px" }}
          >
            {isLoading ? "Sending OTP..." : "Get OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
