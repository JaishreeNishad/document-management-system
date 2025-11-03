import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const TagChip = ({ tag }) => (
  <span
    className="badge rounded-pill me-1"
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

export default function UploadPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [minor, setMinor] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState("");

  const parsedTags = React.useMemo(() => {
    return tagsInput
      ? tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];
  }, [tagsInput]);

  useEffect(() => {
    const fetchTags = async () => {
      if (!token) return;
      console.log("Fetching tags with token:", token);

      try {
        const response = await axios.post(
          "https://apis.allsoft.co/api/documentManagement/documentTags",
          { term: "" },
          {
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        if (
          response.data.status === true &&
          Array.isArray(response.data.data)
        ) {
          const formatted = response.data.data
            .filter((tag) => tag.label && tag.label.trim() !== "")
            .map((tag) => ({
              id: tag.id,
              label: tag.label,
            }));
          setAvailableTags(formatted);
        } else {
          setAvailableTags([]);
        }
      } catch (err) {
        console.error("❌ Tag fetch error:", err);
      }
    };

    fetchTags();
  }, [token]);

  const toggleTag = (label) => {
    const current = parsedTags;
    const next = current.includes(label)
      ? current.filter((t) => t !== label)
      : [...current, label];
    setTagsInput(next.join(", "));
  };

  const selectAllTags = () => {
    setTagsInput(availableTags.map((t) => t.label).join(", "));
  };

  const clearTags = () => setTagsInput("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (
      uploadedFile &&
      (uploadedFile.type.startsWith("image/") ||
        uploadedFile.type === "application/pdf")
    ) {
      setFile(uploadedFile);
      setError(null);
    } else {
      setError("Only Image and PDF files are allowed!");
      setFile(null);
    }
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
      setError(null);
    } else {
      setError("Only Image and PDF files are allowed!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a file before submitting!");
      return;
    }

    if (!token) {
      setError("Session expired! Please login again.");
      navigate("/");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const dataPayload = {
        major_head: category || "General",
        minor_head: minor || "Misc",
        document_date: date
          ? `${String(date.getDate()).padStart(2, "0")}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}-${date.getFullYear()}`
          : "",
        document_remarks: remarks,
        tags:
          parsedTags.length > 0 ? parsedTags.map((t) => ({ tag_name: t })) : [],
        user_id: "nitin",
      };

      formData.append("data", JSON.stringify(dataPayload));

      const response = await axios.post(
        "https://apis.allsoft.co/api/documentManagement/saveDocumentEntry",
        formData,
        {
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Upload Response:", response.data);

      if (response.data.status === true) {
        alert("✅ File uploaded successfully!");
        navigate("/search");

        const newDoc = {
          id: response.data.data?.id || Date.now(),
          filename: file.name,
          category: category || "General",
          minor: minor || "Misc",
          dateAdded: dataPayload.document_date,
          tags: parsedTags.map((t) => ({ tag_name: t })),
          file_url: response.data.data?.file_url || "",
        };

        setUploadedDocs([newDoc, ...uploadedDocs]);
        setFile(null);
        setRemarks("");
        setTagsInput("");
      } else {
        setError(response.data.message || "Failed to upload document.");
      }
    } catch (err) {
      console.error("❌ Upload Error:", err);

      if (err.response) {
        setError(
          err.response.data?.message || "Upload failed. Please try again."
        );
      } else if (err.request) {
        setError("No response from server. Check your internet connection.");
      } else {
        setError("An unexpected error occurred during upload.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center pt-4 pb-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "95%", maxWidth: "1200px", borderRadius: "10px" }}
      >
        <div className="flex d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-4" style={{ color: "#343a40" }}>
            Upload New Document
          </h2>
          <Link to="/search">
            <button
              className="btn btn-info py-2 me-2 text-white"
              style={{ minWidth: "140px" }}
            >
              Search
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
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
                {category === "Personal"
                  ? ["John", "Tom", "Emily"].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  : ["Accounts", "HR", "IT", "Finance"].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted">Document Date</label>
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                className="form-control w-100"
                dateFormat="MM/dd/yyyy"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted">Tags</label>
            <div className="position-relative">
              <button
                type="button"
                className="form-control text-start d-flex justify-content-between align-items-center"
                onClick={() => setTagDropdownOpen((s) => !s)}
                style={{ minHeight: "38px" }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    flex: "1 1 auto",
                  }}
                >
                  {parsedTags.length === 0 ? (
                    <span className="text-muted">Select tags...</span>
                  ) : (
                    parsedTags.map((tag) => <TagChip key={tag} tag={tag} />)
                  )}
                </div>
                <i
                  className={`bi ${
                    tagDropdownOpen ? "bi-caret-up-fill" : "bi-caret-down-fill"
                  }`}
                ></i>
              </button>

              {tagDropdownOpen && (
                <div
                  className="card position-absolute mt-1 p-2"
                  style={{
                    zIndex: 2000,
                    width: "100%",
                    maxHeight: "220px",
                    overflow: "auto",
                  }}
                >
                  <input
                    className="form-control form-control-sm mb-2"
                    placeholder="Search tags..."
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                  />
                  <div className="d-flex justify-content-between mb-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0"
                      onClick={selectAllTags}
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0"
                      onClick={clearTags}
                    >
                      Clear
                    </button>
                  </div>
                  {availableTags
                    .filter((t) =>
                      t.label.toLowerCase().includes(tagFilter.toLowerCase())
                    )
                    .map((tag) => (
                      <label
                        key={tag.id}
                        className="form-check d-flex align-items-center mb-1"
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={parsedTags.includes(tag.label)}
                          onChange={() => toggleTag(tag.label)}
                        />
                        <span>{tag.label}</span>
                      </label>
                    ))}
                </div>
              )}
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

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex justify-content-end mt-4">
            <Link to="/upload">
              <button type="button" className="btn btn-outline-secondary me-2">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
