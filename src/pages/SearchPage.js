import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import PreviewModal from "../components/PreviewModal";

const MOCK_SEARCH_RESULTS = [
  {
    id: 1,
    filename: "Q3-Report.pdf",
    icon: "bi-file-earmark-pdf",
    category: "Professional",
    subCategory: "HR",
    dateAdded: "2025-10-20",
    tags: ["invoice", "report"],
    type: "pdf",
  },
  {
    id: 2,
    filename: "John_ID.jpg",
    icon: "bi-file-earmark-person",
    category: "Personal",
    subCategory: "John",
    dateAdded: "2025-10-18",
    tags: ["invoice", "report", "ID"],
    type: "image",
  },
  {
    id: 3,
    filename: "Q3-Photo.jpg",
    icon: "bi-file-earmark-image",
    category: "Professional",
    subCategory: "IT",
    dateAdded: "2025-10-15",
    tags: ["report"],
    type: "image",
  },
  {
    id: 4,
    filename: "TeamPhoto.jpg",
    icon: "bi-file-earmark-image",
    category: "Professional",
    subCategory: "HR",
    dateAdded: "2025-10-10",
    tags: ["invoice", "report"],
    type: "image",
  },
];

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
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("Q3-2023");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [results, setResults] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSearch = useCallback(() => {
    console.log("Searching with filters:", {
      category,
      subCategory,
      tagsInput,
      fromDate,
      toDate,
    });
    setResults(MOCK_SEARCH_RESULTS);
  }, [category, subCategory, tagsInput, fromDate, toDate]);

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
            <input
              type="text"
              className="form-control"
              placeholder="Enter tags separated by comma"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />

            <div className="mt-1">
              {tagsInput &&
                tagsInput
                  .split(",")
                  .map((tag) => <TagChip key={tag.trim()} tag={tag.trim()} />)}
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
            >
              Search
            </button>
            <button
              className="btn btn-outline-secondary w-100 py-2"
              onClick={handleClear}
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
                      {item.tags.map((tag) => (
                        <TagChip key={tag} tag={tag} />
                      ))}
                    </td>
                    <td>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info text-center">
            No documents found. Please adjust your search criteria.
          </div>
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
