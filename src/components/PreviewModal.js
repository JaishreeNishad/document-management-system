import React from "react";

export default function PreviewModal({ isOpen, onClose, file }) {
  if (!isOpen || !file) return null;

  const previewContent =
    file.type === "pdf" ? (
      <div
        className="text-center p-4 bg-light rounded"
        style={{ height: "350px", overflowY: "auto" }}
      >
        <i
          className="bi bi-file-earmark-pdf text-danger"
          style={{ fontSize: "3rem" }}
        ></i>
        <p className="mt-2 text-muted">Mock PDF Preview Area</p>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <h5 className="text-primary mb-3">Annual Sales Report Summary</h5>
          <div className="d-flex justify-content-around mb-3">
            <div className="w-50 me-2 border p-2 rounded">
              <i className="bi bi-circle-fill text-info me-2"></i>
              <small>Data Chart 1 (Circle)</small>
            </div>
            <div className="w-50 border p-2 rounded">
              <i className="bi bi-graph-up text-success me-2"></i>
              <small>Data Chart 2 (Line)</small>
            </div>
          </div>
          <p className="text-start" style={{ fontSize: "0.9rem" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam. (This is placeholder content.)
          </p>
        </div>
      </div>
    ) : (
      <div
        className="text-center p-4 bg-light rounded"
        style={{
          height: "350px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className="bi bi-image text-secondary"
          style={{ fontSize: "3rem" }}
        ></i>
        <p className="ms-3 text-muted">Mock Image Preview Area</p>
        <img
          src={`https://placehold.co/300x300/e0e0e0/555555?text=${file.type.toUpperCase()}`}
          alt="Placeholder"
          className="rounded"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </div>
    );

  const handleDownload = () => {
    console.log(`Downloading ${file.filename}...`);

    onClose();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      onClick={onClose}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        className="card shadow-2xl p-0"
        style={{ width: "90%", maxWidth: "650px", borderRadius: "10px" }}
      >
        <div className="card-header bg-white d-flex justify-content-between align-items-center p-3">
          <h5 className="mb-0 fw-bold text-dark">{file.filename}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>

        <div className="card-body p-4">{previewContent}</div>

        <div className="card-footer bg-light d-flex justify-content-end p-3">
          <button className="btn btn-primary me-2" onClick={handleDownload}>
            <i className="bi bi-download me-2"></i>Download File
          </button>
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
