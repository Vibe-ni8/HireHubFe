import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { BaseResponse, Candidate } from "../../../dto/Response";
import Spinner from "../../../components/Spinner";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import { candidateBulkUpload, getCandidateBulkUploadTemplate, getCandidates } from "../../../services/Auth.service";

export default function Candidates() {
  
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const [candidates, setCandidates] = useState<Array<Candidate> | null>(null);
  const [search, setSearch] = useState("");
  const [isLatestFirstFilter, setIsLatestFirstFilter] = useState<string>("a to z");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [bulkUploadResult, setBulkUploadResult] = useState<Array<number>>([]);

  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileDownloadLink, setFileDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    getCandidateBulkUploadTemplate()
      .then(res => {
        setFileDownloadLink(window.URL.createObjectURL(res));
      })
      .catch(() => {
        setFileDownloadLink(null);
      })
  },[]);
  useEffect(() => {
      setLoading(true);
      let isLatestFirst = isLatestFirstFilter === 'a to z' ? null : isLatestFirstFilter === 'latest' ? true :  false;
      let experienceLevel = experienceLevelFilter === 'all' ? null : experienceLevelFilter;
      getCandidates(experienceLevel, isLatestFirst, page, pageSize)
        .then((response) => {
          const result = HandleApiSuccess(response);
          setCandidates(result.data ?? null);
          setLoading(false);
        })
        .catch((err: AxiosError<BaseResponse>) => {
          HandleApiErrors(err);
          setLoading(false);
        });
    }, [isLatestFirstFilter, experienceLevelFilter, page, bulkUploadResult]);

  const filteredUsers = useMemo(() => {
    return candidates === null ? [] : candidates.filter((u) => {
      const matchSearch =
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [search, candidates]);

  const handleShowUpload = () => {
    if (showUpload) {
      setFile(null);
    }
    setShowUpload(prev => !prev);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setLoading(true);
    candidateBulkUpload(file)
      .then((response) => {
        var result = HandleApiSuccess(response);
        setBulkUploadResult(result.data!)
        setIsLatestFirstFilter('latest');
        setExperienceLevelFilter('all');
        setPage(1);
        setLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setLoading(false);
      });
  };

  return (
    <div className="cm-page">
      {/* Spinner */}
      <Spinner show={loading}/>

      {/* Header */}
      <div className="cm-header">
        <h2>Candidates</h2>
        <div className="cm-button-block">
          <button className="cm-btn cm-bulk-upload-btn" onClick={handleShowUpload} >
            Bulk Upload
          </button>
          <button className="cm-btn cm-add-btn" onClick={() => navigate("/admin/candidate/add")} >
            + Add Candidate
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="cm-bulk-upload-wrapper">
      {showUpload && (    
        <div className="cm-bulk-upload-panel">
          {/* Download template */}
          {fileDownloadLink && 
            <Link to={ fileDownloadLink } download className="cm-template-link">
              Download Template
            </Link>
          }

          {/* File select */}
          <label className="cm-file-btn">
            Choose File
            <input type="file" accept=".csv,.xlsx" hidden onChange={handleFileChange}/>
          </label>

          {/* Show selected file */}
          {file && (<div className="cm-file-name">{file.name}</div>)}

          {/* Upload */}
          <button className="cm-upload-btn" disabled={!file} onClick={handleUpload}>
            Upload
          </button>
        </div>
      )}
      </div>

      {/* Filters */}
      <div className="cm-filters">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={isLatestFirstFilter} onChange={(e) => setIsLatestFirstFilter(e.target.value)}>
          <option value="a to z">A to Z</option>
          <option value="latest">Latest First </option>
          <option value="oldest">Oldest First </option>
        </select>

        <select value={experienceLevelFilter} onChange={(e) => setExperienceLevelFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="Fresher">Fresher</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Experienced">Experienced</option>
        </select>
      </div>

      {/* Table */}
      <div className="cm-table-wrapper cm-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Experience</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="cm-empty">
                  Loading Data...
                </td>
              </tr>
            ) : candidates === null ? (
              <tr>
                <td colSpan={4} className="cm-empty">
                  No candidate record found
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="cm-empty">
                  No candidates found on current batch
                </td>
              </tr>
            ) : 
              <>
                {filteredUsers.map((candidate) => (
                  <tr
                    key={candidate.candidateId}
                    onClick={() => navigate(`/admin/candidate/detail/${candidate.candidateId}`)}
                  >
                    <td>{candidate.fullName}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone}</td>
                    <td>{candidate.candidateExperienceLevel}</td>
                  </tr>
                ))}
              </>
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="cm-pagination">
        <button onClick={() => setPage(p => p-1)} disabled={page === 1}>
          {'<'}
        </button>
        <span>{page}</span>
        <button onClick={() => setPage(p => p+1)} 
        disabled={candidates === null || candidates?.length < pageSize}>
          {'>'}
        </button>
      </div>
    </div>
  );
}
