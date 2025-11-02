import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  return (
    <div
      className="d-flex justify-content-center pt-3 pb-3 px-3"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow-sm p-3 d-flex flex-row align-items-center justify-content-between"
        style={{
          width: "95%",
          maxWidth: "1200px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          border: "none",
        }}
      >
        <div className="d-flex align-items-center">
          <i
            className="bi bi-shield-fill-check text-primary me-2"
            style={{ fontSize: "1.5rem" }}
          ></i>

          <span className="fw-bold fs-5 text-dark">DMS</span>
        </div>

        <div className="d-flex align-items-center">
          <i
            className="bi bi-person-circle text-muted"
            style={{ fontSize: "1.8rem", marginRight: "10px" }}
          ></i>

          <button
            onClick={handleLogout}
            className="btn btn-outline-secondary btn-sm fw-medium"
            style={{ minWidth: "80px", borderRadius: "5px" }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
