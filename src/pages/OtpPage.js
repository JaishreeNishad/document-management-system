import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ The mobile number passed from previous page
  const mobileNumber = location.state?.mobile || "+916263841606";

  useEffect(() => {
    if (timer === 0) return;
    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ✅ Validate OTP API Call
  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return alert("Please enter a valid 6-digit OTP!");
    }

    setError(null);
    setIsLoading(true);

    const payload = {
      mobile_number: mobileNumber.replace("+91", "").trim(),
      otp: finalOtp.toString(),
    };

    try {
      const response = await fetch(
        "https://apis.allsoft.co/api/documentManagement/validateOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();
      console.log("Validate OTP API Response:", responseData);

      // ✅ Only navigate if OTP is valid
      if (response.ok && responseData.status === true) {
        const token = responseData.data?.token; // ✅ extract token
        localStorage.setItem("authToken", token); // ✅ store it
        alert("✅ OTP verified successfully!");
        navigate("/upload");
      } else {
        // ❌ Show error if invalid OTP or API error
        setError(responseData.message || "Invalid OTP. Please try again.");
      }
    } catch (e) {
      console.error("Network or Fetch Error:", e);
      setError(
        "Could not connect to the API server. Please check your network."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      alert("Resending OTP!");
      setTimer(59);
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
          </div>

          <h2 className="fw-bold mb-2">Verify OTP</h2>
          <p className="text-muted mb-4">
            Enter the 6-digit OTP sent to{" "}
            <span className="text-primary fw-medium">{mobileNumber}</span>
          </p>

          <div className="d-flex justify-content-between mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputsRef.current[i] = el)}
                className="form-control text-center fs-4 fw-bold"
                style={{
                  width: "50px",
                  height: "55px",
                  borderRadius: "10px",
                  borderColor: "#0d6efd",
                  boxShadow: "none",
                }}
              />
            ))}
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button
            onClick={handleVerify}
            className="btn btn-primary w-100 py-2 fw-bold"
            style={{ borderRadius: "10px" }}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify & Login"}
          </button>

          <div className="text-center mt-3" style={{ lineHeight: "1.2" }}>
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={handleResend}
              disabled={timer > 0}
            >
              Resend OTP
            </button>
            <br />
            {timer > 0 && (
              <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                ({timer}s)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
