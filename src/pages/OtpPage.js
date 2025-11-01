import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(59);
  const inputsRef = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();

  const mobileNumber = location.state?.mobile || "+91-98XXX-XX210";

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

  const handleVerify = () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      return alert("Please enter a valid 6-digit OTP!");
    }

    navigate("/search");
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
            {/* <span className="ms-2 fs-2 fw-bold">DMS</span> */}
          </div>

          <h2 className="fw-bold mb-2">Verify Otp</h2>
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

          <button
            onClick={handleVerify}
            className="btn btn-primary w-100 py-2 fw-bold"
            style={{ borderRadius: "10px" }}
          >
            Verify & Login
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
