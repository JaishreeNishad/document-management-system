import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PreviewModal from "../components/PreviewModal";

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

export default function SearchPage() {
  const { token } = useAuth();
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();

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
      try {
        const response = await fetch(
          "https://apis.allsoft.co/api/documentManagement/documentTags",
          {
            method: "POST",
            headers: { "Content-Type": "application/json", token },
            body: JSON.stringify({ term: "" }),
          }
        );
        const result = await response.json();
        if (result.status && Array.isArray(result.data)) {
          setAvailableTags(
            result.data.map((tag) => ({
              id: tag.id,
              label: tag.label,
            }))
          );
        }
      } catch (err) {
        console.error("Tag fetch error:", err);
      }
    };
    fetchTags();
  }, [token]);

  const handleSearch = useCallback(async () => {
    if (!token) {
      setError("Session expired! Please login again.");
      navigate("/");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formatDate = (date) =>
      date
        ? `${String(date.getDate()).padStart(2, "0")}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${date.getFullYear()}`
        : "";

    const payload = {
      major_head: category === "All" ? "" : category,
      minor_head: subCategory || "",
      from_date: fromDate ? formatDate(fromDate) : "",
      to_date: toDate ? formatDate(toDate) : "",
      tags:
        parsedTags.length > 0 ? parsedTags.map((t) => ({ tag_name: t })) : [],
      uploaded_by: "nitin",
      start: 0,
      length: 50,
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
            token,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("Search Response:", result);

      if (response.ok && result.status && Array.isArray(result.data)) {
        const formatted = result.data.map((doc) => {
          let filename = doc.file_name;
          if (!filename && doc.file_url) {
            const urlParts = doc.file_url.split("/");
            filename = urlParts[urlParts.length - 1].split("?")[0];
          }

          let formattedDate = "";
          if (doc.document_date) {
            const dateObj = new Date(doc.document_date);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = `${String(dateObj.getDate()).padStart(
                2,
                "0"
              )}/${String(dateObj.getMonth() + 1).padStart(
                2,
                "0"
              )}/${dateObj.getFullYear()}`;
            } else {
              formattedDate = doc.document_date;
            }
          }

          return {
            id: doc.document_id || doc.id,
            filename: filename || "Unknown File",
            icon: filename?.toLowerCase().endsWith(".pdf")
              ? "bi-file-earmark-pdf"
              : filename?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)
              ? "bi-file-earmark-image"
              : "bi-file-earmark",
            category: doc.major_head,
            subCategory: doc.minor_head,
            dateAdded: formattedDate,
            tags: doc.tags
              ? Array.isArray(doc.tags)
                ? doc.tags.map((t) => t.tag_name || t)
                : []
              : [],
            file_url: doc.file_url,
            type: filename?.split(".").pop()?.toLowerCase() || "unknown",
          };
        });
        setResults(formatted);
        if (formatted.length === 0) setError("No documents found.");
      } else {
        setError(result.message || "No documents found.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error while searching documents.");
    } finally {
      setIsLoading(false);
    }
  }, [token, category, subCategory, fromDate, toDate, parsedTags, navigate]);

  useEffect(() => {
    if (initialLoad) {
      handleSearch();
      setInitialLoad(false);
    }
  }, [initialLoad, handleSearch]);

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

  const handlePreview = (file) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const handleClear = () => {
    setCategory("All");
    setSubCategory("");
    setTagsInput("");
    setFromDate(null);
    setToDate(null);
    setResults([]);
    setError(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".tag-dropdown-container")) {
        setTagDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="d-flex justify-content-center pt-4 pb-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "95%", maxWidth: "1200px", borderRadius: "10px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Find Documents</h2>
          <Link to="/upload">
            <button className="btn btn-info text-white">Upload New File</button>
          </Link>
        </div>

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

          <div className="col-md-3 tag-dropdown-container">
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
                    top: "100%",
                    left: 0,
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

          <div className="col-md-3">
            <label className="form-label text-muted">From Date</label>
            <DatePicker
              selected={fromDate}
              onChange={setFromDate}
              className="form-control"
              dateFormat="dd/MM/yyyy"
              placeholderText="Select start date"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label text-muted">To Date</label>
            <DatePicker
              selected={toDate}
              onChange={setToDate}
              className="form-control"
              dateFormat="dd/MM/yyyy"
              placeholderText="Select end date"
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear
          </button>
        </div>

        <hr className="my-4" />

        <h4>Search Results ({results.length})</h4>
        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {results.length > 0 ? (
          <div className="table-responsive mt-3">
            <table className="table table-hover table-light align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Filename</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <i className={`bi ${item.icon} me-2 text-primary`}></i>
                      {item.filename}
                    </td>
                    <td>{item.category}</td>
                    <td>{item.dateAdded}</td>
                    <td>
                      {item.tags && item.tags.length > 0 ? (
                        item.tags.map((tag) => <TagChip key={tag} tag={tag} />)
                      ) : (
                        <span className="text-muted">No tags</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handlePreview(item)}
                      >
                        Preview
                      </button>
                      <a
                        href={item.file_url}
                        download
                        className="btn btn-success btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !isLoading &&
          !error && (
            <div className="alert alert-info mt-3 text-center">
              No documents found.
            </div>
          )
        )}

        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          file={previewFile}
        />
      </div>
    </div>
  );
}
