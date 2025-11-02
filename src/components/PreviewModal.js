import React from "react";

// ✅ Define TagChip here
const TagChip = ({ tag }) => (
  <span
    className="badge rounded-pill text-bg-primary me-1"
    style={{
      backgroundColor: "#e3f2fd",
      color: "#0d6efd",
      fontSize: "0.75rem",
      fontWeight: 500,
    }}
  >
    {tag}
  </span>
);

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
          <h5 className="text-primary mb-3">Document Summary</h5>
          <p className="text-start" style={{ fontSize: "0.9rem" }}>
            This is a placeholder preview for the document. Actual PDF preview
            can be implemented using <code>react-pdf</code> or similar
            libraries.
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
        <img
          src={
            file.file_url ||
            `https://placehold.co/300x300/e0e0e0/555555?text=${file.type.toUpperCase()}`
          }
          alt="Preview"
          className="rounded"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </div>
    );

  const handleDownload = () => {
    if (file.file_url) {
      const link = document.createElement("a");
      link.href = file.file_url;
      link.download = file.filename;
      link.click();
    }
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
        className="card shadow-lg p-0"
        style={{
          width: "90%",
          maxWidth: "700px",
          borderRadius: "10px",
          overflow: "auto",
          height: "80%",
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        <div className="card-header bg-white d-flex justify-content-between align-items-center p-3">
          <h5 className="mb-0 fw-bold text-dark">{file.filename}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>

        <div className="card-body p-4">
          {/* ✅ Show document details */}
          <div className="mb-4">
            <p className="mb-1">
              <strong>Category:</strong> {file.category || "N/A"}
            </p>
            <p className="mb-1">
              <strong>Subcategory:</strong> {file.subCategory || "N/A"}
            </p>
            <p className="mb-1">
              <strong>Date Added:</strong> {file.dateAdded || "N/A"}
            </p>
            <p className="mb-1">
              <strong>Type:</strong> {file.type || "N/A"}
            </p>
            <p className="mb-1">
              <strong>Tags:</strong>{" "}
              {file.tags?.length > 0 ? (
                file.tags.map((t) => <TagChip key={t} tag={t} />)
              ) : (
                <span className="text-muted">No tags</span>
              )}
            </p>
          </div>

          {/* ✅ File content preview */}
          {previewContent}
        </div>

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
