import React, { useState, useEffect } from "react";
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
  const [tags, setTags] = useState([]); // selected tags
  const [availableTags, setAvailableTags] = useState([]); // API tags
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  // 🔍 Search Filter Section
  const [showFilters, setShowFilters] = useState(false);
  const [searchTag, setSearchTag] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchDate, setSearchDate] = useState(null);

  const names = ["John", "Tom", "Emily"];
  const departments = ["Accounts", "HR", "IT", "Finance"];

  // 🔹 Fetch available document tags from API
  useEffect(() => {
    const fetchTags = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await fetch(
          "https://apis.allsoft.co/api/documentManagement/documentTags",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
            body: JSON.stringify({ term: "" }),
          }
        );

        const result = await response.json();

        if (
          response.ok &&
          result.status === true &&
          Array.isArray(result.data)
        ) {
          // ✅ Correct mapping for {id, label} API response
          const formatted = result.data
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
        console.error("Tag fetch error:", err);
      }
    };

    fetchTags();
  }, []);

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

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

  // 🔹UPLOAD FILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a file before submitting!");
      return;
    }

    const token = localStorage.getItem("authToken");
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
        tags: tags.map((t) => ({ tag_name: t })),
        user_id: "nitin",
      };

      formData.append("data", JSON.stringify(dataPayload));

      const response = await fetch(
        "https://apis.allsoft.co/api/documentManagement/saveDocumentEntry",
        {
          method: "POST",
          headers: {
            token: token,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok && result.status === true) {
        alert("✅ File uploaded successfully!");

        const newDoc = {
          id: result.data?.id || Date.now(),
          filename: file.name,
          category: category || "General",
          minor: minor || "Misc",
          dateAdded: dataPayload.document_date,
          tags: tags.map((t) => ({ tag_name: t })),
          file_url: result.data?.file_url || "",
        };

        setUploadedDocs([newDoc, ...uploadedDocs]);
        setFile(null);
        setRemarks("");
        setTags([]);
      } else {
        setError(result.message || "Failed to upload document.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setError("Network error: Unable to upload file.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔎 SEARCH DOCUMENTS
  const handleSearch = async () => {
    if (!showFilters) {
      setShowFilters(true);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Session expired! Please login again.");
      navigate("/");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      major_head: searchCategory,
      minor_head: "",
      from_date: searchDate
        ? `${String(searchDate.getDate()).padStart(2, "0")}-${String(
            searchDate.getMonth() + 1
          ).padStart(2, "0")}-${searchDate.getFullYear()}`
        : "",
      to_date: "",
      tags:
        searchTag.trim() !== ""
          ? [{ tag_name: searchTag }]
          : tags.map((t) => ({ tag_name: t })),
      uploaded_by: "nitin",
      start: 0,
      length: 10,
      filterId: "",
      search: { value: "" },
    };

    try {
      const response = await fetch(
        "https://apis.allsoft.co/api/documentManagement/searchDocumentEntry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === true && Array.isArray(result.data)) {
        setUploadedDocs(result.data);
      } else {
        setUploadedDocs([]);
        setError(result.message || "No documents found.");
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError("Network error while searching documents.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTag("");
    setSearchCategory("");
    setSearchDate(null);
    setUploadedDocs([]);
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
          {/* ---Date / Category / Minor--- */}
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

          {/* ---Tags Dropdown--- */}
          {/* ---Tags Dropdown--- */}
          <div className="mb-4">
            <label className="form-label text-muted">Tags</label>
            <select
              multiple
              className="form-select"
              value={tags}
              onChange={(e) =>
                setTags(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
            >
              {availableTags.length > 0 ? (
                availableTags.map((tagObj) => (
                  <option key={tagObj.id} value={tagObj.label}>
                    {tagObj.label}
                  </option>
                ))
              ) : (
                <option disabled>Loading tags...</option>
              )}
            </select>

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

          {/* ---Remarks--- */}
          <div className="mb-4">
            <label className="form-label text-muted">Remarks</label>
            <textarea
              className="form-control"
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* ---File Upload--- */}
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
            <Link to="/search">
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

        {/* 🔍 SEARCH SECTION */}
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : showFilters ? "Run Search" : "Search"}
          </button>
        </div>

        {/* 📦 Filters */}
        {showFilters && (
          <div className="card p-3 mt-3 shadow-sm">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label text-muted">Tag</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter tag"
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted">Category</label>
                <select
                  className="form-select"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Personal">Personal</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted">Date</label>
                <DatePicker
                  selected={searchDate}
                  onChange={(d) => setSearchDate(d)}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="text-end mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* 📄 Uploaded Documents */}
        {uploadedDocs.length > 0 && (
          <div className="mt-5">
            <h4>Uploaded Documents</h4>
            <table className="table table-bordered mt-3">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Filename</th>
                  <th>Category</th>
                  <th>Minor</th>
                  <th>Date</th>
                  <th>Tags</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {uploadedDocs.map((doc, index) => (
                  <tr key={doc.id || index}>
                    <td>{index + 1}</td>
                    <td>{doc.file_name || doc.filename}</td>
                    <td>{doc.major_head || doc.category}</td>
                    <td>{doc.minor_head || doc.minor}</td>
                    <td>{doc.document_date || doc.dateAdded}</td>
                    <td>
                      {doc.tags
                        ? doc.tags.map((t) => t.tag_name).join(", ")
                        : "-"}
                    </td>
                    <td>
                      {doc.file_url ? (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
