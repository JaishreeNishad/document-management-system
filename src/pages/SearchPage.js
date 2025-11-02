import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import PreviewModal from "../components/PreviewModal";
import { useNavigate } from "react-router-dom";

const TagChip = ({ tag }) => (
  <span
    className="badge rounded-pill text-bg-primary me-1"
    style={{
      backgroundColor: "#e3f2fd !important",
      color: "#0d6efd !important",
      fontSize: "0.75rem",
      fontWeight: 500,
    }}
  >
    {tag}
  </span>
);

export default function SearchPage() {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [results, setResults] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  // Add useNavigate for navigation

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);
  // Use navigate for redirection
  const navigate = useNavigate();

  // Helper to parse tags input using useMemo
  const parsedTags = React.useMemo(() => {
    return tagsInput
      ? tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];
  }, [tagsInput]);

  // Search handler
  const handleSearch = useCallback(async () => {
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

    // Format dates
    const formatDate = (date) =>
      date
        ? `${String(date.getDate()).padStart(2, "0")}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${date.getFullYear()}`
        : "";

    const payload = {
      major_head: category,
      minor_head: subCategory || "",
      from_date: "",
      to_date: toDate ? formatDate(toDate) : "",
      tags:
        parsedTags.length > 0 ? parsedTags.map((t) => ({ tag_name: t })) : [],
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
        const formattedResults = result.data.map((doc) => ({
          id: doc.id,
          filename: doc.file_name,
          icon: doc.file_name?.toLowerCase().endsWith(".pdf")
            ? "bi-file-earmark-pdf"
            : doc.file_name?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)
            ? "bi-file-earmark-image"
            : "bi-file-earmark",
          category: doc.major_head,
          subCategory: doc.minor_head,
          dateAdded: doc.document_date,
          tags: doc.tags ? doc.tags.map((t) => t.tag_name) : [],
          type: doc.file_name?.split(".").pop()?.toLowerCase() || "unknown",
          file_url: doc.file_url,
        }));
        setResults(formattedResults);
        if (formattedResults.length === 0) {
          setError("No documents found matching your criteria.");
        }
      } else {
        setResults([]);
        setError(result.message || "No documents found.");
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError("Network error while searching documents.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    showFilters,
    category,
    subCategory,
    fromDate,
    toDate,
    parsedTags,
    navigate,
  ]);

  // Fetch available tags
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

  // Initial load effect
  useEffect(() => {
    if (initialLoad) {
      handleSearch();
      setInitialLoad(false);
    }
  }, [handleSearch, initialLoad]);

  const handleClear = () => {
    setCategory("All");
    setSubCategory("");
    setTagsInput("");
    setFromDate(null);
    setToDate(null);
    setResults([]);
    setError(null);
    setShowFilters(false);
  };

  const handlePreview = (item) => {
    setPreviewFile(item);
    setIsPreviewOpen(true);
  };

  const handleDownload = (name) => {
    alert(`Downloading ${name}`);
  };

  const handleDownloadAll = () => {
    alert("Downloading all files as ZIP...");
  };

  const subCategoryOptions =
    category === "Personal"
      ? ["John", "Tom", "Emily"]
      : category === "Professional"
      ? ["HR", "IT", "Finance", "Accounts"]
      : ["All"];

  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState("");

  const toggleTag = (label) => {
    const current = parsedTags;
    let next;
    if (current.includes(label)) next = current.filter((t) => t !== label);
    else next = [...current, label];
    setTagsInput(next.join(", "));
  };

  const selectAllTags = () => {
    const all = availableTags.map((t) => t.label);
    setTagsInput(all.join(", "));
  };

  const clearTags = () => setTagsInput("");

  return (
    <div
      className="d-flex justify-content-center pt-4 pb-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "95%", maxWidth: "1200px", borderRadius: "10px" }}
      >
        <h2 className="fw-bold mb-4" style={{ color: "#343a40" }}>
          Find Documents
        </h2>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label text-muted">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label text-muted">Sub-Category</label>
            <select
              className="form-select"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={category === "All"}
            >
              <option value="">Select Sub-Category</option>
              {subCategoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label text-muted">Tags</label>

            {/* Multiselect dropdown */}
            <div className="position-relative">
              <button
                type="button"
                className="form-control text-start d-flex justify-content-between align-items-center"
                onClick={() => setTagDropdownOpen((s) => !s)}
                style={{
                  minHeight: "42px",
                  maxHeight: "42px",
                  padding: "6px 12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    alignItems: "center",
                    flex: "1 1 auto",
                  }}
                >
                  {parsedTags.length === 0 ? (
                    <span className="text-muted">Select tags...</span>
                  ) : (
                    parsedTags.map((tag) => (
                      <span
                        key={tag}
                        style={{ display: "inline-block", marginRight: 6 }}
                      >
                        <TagChip tag={tag} />
                      </span>
                    ))
                  )}
                </div>
                <i
                  className={`bi ${
                    tagDropdownOpen ? "bi-caret-up-fill" : "bi-caret-down-fill"
                  }`}
                  style={{ flex: "0 0 auto", marginLeft: 8 }}
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
                  <div className="mb-2">
                    <input
                      className="form-control form-control-sm"
                      placeholder="Search tags..."
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                    />
                  </div>

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

                  <div>
                    {availableTags.length > 0 ? (
                      availableTags
                        .filter((t) =>
                          t.label
                            .toLowerCase()
                            .includes(tagFilter.toLowerCase())
                        )
                        .map((tagObj) => (
                          <label
                            key={tagObj.id}
                            className="form-check d-flex align-items-center w-100 mb-1"
                            style={{ cursor: "pointer" }}
                          >
                            <input
                              className="form-check-input me-2"
                              type="checkbox"
                              checked={parsedTags.includes(tagObj.label)}
                              onChange={() => toggleTag(tagObj.label)}
                            />
                            <span className="form-check-label">
                              {tagObj.label}
                            </span>
                          </label>
                        ))
                    ) : (
                      <div className="text-muted">Loading tags...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-3">
            <label className="form-label text-muted">From Date</label>
            <DatePicker
              selected={fromDate}
              onChange={setFromDate}
              className="form-control w-100"
              placeholderText="Select start date"
              dateFormat="MM/dd/yyyy"
            />
          </div>
          {/* To Date */}
          <div className="col-md-3">
            <label className="form-label text-muted">To Date</label>
            <DatePicker
              selected={toDate}
              onChange={setToDate}
              className="form-control w-100"
              placeholderText="Select end date"
              dateFormat="MM/dd/yyyy"
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-primary w-100 py-2 me-2"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
            <button
              className="btn btn-outline-secondary w-100 py-2"
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear
            </button>
          </div>

          <div className="col-md-4 d-flex justify-content-end align-items-end">
            <Link to="/upload">
              <button
                className="btn btn-info py-2 me-2 text-white"
                style={{ minWidth: "140px" }}
              >
                Upload New File
              </button>
            </Link>
            <button
              className="btn btn-secondary py-2"
              onClick={handleDownloadAll}
              style={{ minWidth: "180px" }}
            >
              Download All as ZIP
            </button>
          </div>
        </div>

        <hr className="my-5" />

        <h3 className="fw-bold mb-4" style={{ color: "#343a40" }}>
          Search Results ({results.length})
        </h3>

        {error && (
          <div className="alert alert-danger mt-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {results.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover table-light align-middle">
              <thead className="bg-light">
                <tr>
                  <th scope="col">Filename</th>
                  <th scope="col">Category</th>
                  <th scope="col">Date Added</th>
                  <th scope="col">Tags</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <i className={`bi ${item.icon} me-2 text-primary`}></i>
                      <span className="fw-medium">{item.filename}</span>
                    </td>
                    <td>{item.category}</td>
                    <td>{item.dateAdded}</td>
                    <td>
                      {item.tags &&
                        item.tags.map((tag) => <TagChip key={tag} tag={tag} />)}
                    </td>
                    <td>
                      {item.file_url ? (
                        <>
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm me-2"
                          >
                            Preview
                          </a>
                          <a
                            href={item.file_url}
                            download
                            className="btn btn-success btn-sm"
                          >
                            Download
                          </a>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => handlePreview(item)}
                          >
                            Preview
                          </button>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleDownload(item.filename)}
                          >
                            Download
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !error && !isLoading ? (
          <div className="alert alert-info text-center">
            No documents found. Please adjust your search criteria.
          </div>
        ) : null}

        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          file={previewFile}
        />
      </div>
    </div>
  );
}
