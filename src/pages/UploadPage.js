import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";

const TagChip = ({ tag, onDelete }) => (
  <span
    className="badge rounded-pill text-bg-primary me-2 d-flex align-items-center"
    style={{
      backgroundColor: "#0d6efd",
      color: "#fff",
      fontSize: "0.85rem",
      padding: "0.4rem 0.6rem",
      cursor: "pointer",
    }}
  >
    {tag}
    <i
      className="bi bi-x-circle-fill ms-2"
      onClick={onDelete}
      style={{ fontSize: "0.75rem", cursor: "pointer" }}
    ></i>
  </span>
);

export default function UploadPage() {
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [minor, setMinor] = useState("");
  const [tags, setTags] = useState(["invoice", "report"]);
  const [currentTag, setCurrentTag] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const names = ["John", "Tom", "Emily"];
  const departments = ["Accounts", "HR", "IT", "Finance"];

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault();
      const newTag = currentTag.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setCurrentTag("");
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const uploadedFile = e.dataTransfer.files[0];
    if (
      uploadedFile &&
      (uploadedFile.type.startsWith("image/") ||
        uploadedFile.type === "application/pdf")
    ) {
      setFile(uploadedFile);
    } else {
      console.error("Only Image and PDF files are allowed!");
    }
  };
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (
      uploadedFile &&
      (uploadedFile.type.startsWith("image/") ||
        uploadedFile.type === "application/pdf")
    ) {
      setFile(uploadedFile);
    } else {
      console.error("Only Image and PDF files are allowed!");
      setFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      console.error("Validation Error: Please upload a file!");
      return;
    }

    const formData = {
      date: date.toISOString().split("T")[0],
      major_head: category,
      minor_head: minor,
      tags: tags,
      remarks: remarks,
      file: file.name,
    };

    console.log("Submitting Document:", formData);
    console.log(
      `File (${file.name}) Uploaded Successfully! Navigating to search.`
    );

    navigate("/search");

    setDate(new Date());
    setCategory("");
    setMinor("");
    setTags([]);
    setRemarks("");
    setFile(null);
  };

  return (
    <div
      className="d-flex justify-content-center pt-4 pb-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "95%", maxWidth: "800px", borderRadius: "10px" }}
      >
        <h2 className="fw-bold mb-4" style={{ color: "#343a40" }}>
          Upload New Document
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label text-muted">Document Date</label>
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                className="form-control w-100"
                dateFormat="MM/dd/yyyy"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setMinor("");
                }}
              >
                <option value="">Select Category</option>
                <option value="Personal">Personal</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted">
                {category === "Personal" ? "Name" : "Department"}
              </label>
              <select
                className="form-select"
                value={minor}
                onChange={(e) => setMinor(e.target.value)}
                disabled={!category}
              >
                <option value="">Select</option>
                {(category === "Personal" ? names : departments).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted">Tags</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter new tags (press Enter to add)"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagAdd}
            />
            <div className="d-flex flex-wrap align-items-center my-2">
              {tags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  onDelete={() => handleTagDelete(tag)}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted">Remarks</label>
            <textarea
              className="form-control"
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-muted">
              File Upload (Image/PDF only)
            </label>
            <div
              className={`border rounded p-5 text-center ${
                isDragOver ? "border-primary bg-light" : "border-dashed"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() =>
                document.getElementById("file-upload-input").click()
              }
              style={{
                cursor: "pointer",
                borderStyle: "dashed",
                borderColor: isDragOver ? "#0d6efd" : "#adb5bd",
              }}
            >
              <i
                className="bi bi-cloud-upload"
                style={{ fontSize: "2rem", color: "#6c757d" }}
              ></i>
              <p className="mb-1 fw-medium mt-2">
                Drag & drop your file here or click to browse
              </p>
              <small className="text-muted">
                Only .pdf, .jpg, and .png allowed
              </small>
            </div>

            <input
              type="file"
              id="file-upload-input"
              className="d-none"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
            />

            {file && (
              <div className="mt-3 alert alert-success py-2 d-flex justify-content-between align-items-center">
                <span>
                  <i className="bi bi-file-earmark me-2"></i> {file.name}
                </span>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Remove"
                  onClick={() => setFile(null)}
                ></button>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Link to="/search">
              <button type="button" className="btn btn-outline-secondary me-2">
                Cancel
              </button>
            </Link>
            <button type="submit" className="btn btn-primary">
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
