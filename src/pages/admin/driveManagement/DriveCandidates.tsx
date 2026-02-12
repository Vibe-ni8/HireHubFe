import { useEffect, useMemo, useRef, useState } from "react";
import { FaTrash, FaEye, FaUpload } from "react-icons/fa";
import type { BaseResponse, Candidate, DriveCandidate } from "../../../dto/Response";
import { addCandidatesToDrive, driveCandidateBulkUpload, getCandidates, getDriveCandidateBulkUploadTemplate, getDriveCandidates, removeDriveCandidates } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import Spinner from "../../../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import CandidateSearchAdd from "../../../components/CandidateSearchAdd";

interface DriveCandidatesProps {
  driveId: number;
}

export default function DriveCandidates({ driveId }: DriveCandidatesProps) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [driveCandidates, setDriveCandidates] = useState<DriveCandidate[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 100;
  const listRef = useRef<HTMLDivElement>(null);

  const [addedCandidateIds, setAddedCandidateIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileDownloadLink, setFileDownloadLink] = useState<string | null>(null);

  const fetchRounds = async (pageNumber: number) => {
    if (paginationLoading) return;
    setPaginationLoading(true);
    getDriveCandidates(driveId, null, null, null, true, true, pageNumber, PAGE_SIZE)
      .then((response) => {
        const result = HandleApiSuccess(response);
        if (result.data!.length < PAGE_SIZE) {
          setHasMore(false);
        }
        setDriveCandidates(prev => [...prev, ...result.data!]);
        setPage(pageNumber);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
      })
      .finally(() => {
        setPaginationLoading(false);
      });
  }

  useEffect(() => {
    setDriveCandidates([]);
    fetchRounds(1);
  }, [driveId, addedCandidateIds]);

  const filteredCandidates = useMemo(() => {
      return driveCandidates.filter((m) => {
        const matchSearch =
          m.candidateName.toLowerCase().includes(search.toLowerCase()) ||
          m.candidateEmail.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      });
    }, [search, driveCandidates]);

  useEffect(() => {
    const today = new Date();
    const sevenDaysBefore = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    getCandidates(null, null, null, null, sevenDaysBefore)
      .then((response) => {
        const result = HandleApiSuccess(response);
        setCandidates(result.data ?? []);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setCandidates([]);
      });
  }, []);

  useEffect(() => {
    getDriveCandidateBulkUploadTemplate()
      .then(res => {
        setFileDownloadLink(window.URL.createObjectURL(res));
      })
      .catch(() => {
        setFileDownloadLink(null);
      })
    },[]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [page, paginationLoading, hasMore]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || paginationLoading || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      const nextPage = page + 1;
      fetchRounds(nextPage);
    }
  };

  const removeCandidate = (candidateId: number) => {
    if (!window.confirm("Are you sure you want to remove this candidate?")) 
        return;
    setLoading(true);
    removeDriveCandidates({driveId:driveId, candidateIds:[candidateId]})
      .then((response) => {
        const result = HandleApiSuccess(response);
        setDriveCandidates(prev => prev.filter(e => !result.data?.includes(e.driverCandidateId)));
        setLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setLoading(false);
      });
  };

  const addCandidate = (candidateId: number) => {
    setLoading(true);
    addCandidatesToDrive({driveId:driveId, candidateIds:[candidateId]})
      .then((response) => {
        const result = HandleApiSuccess(response);
        setAddedCandidateIds(result.data ?? []);
        setLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setLoading(false);
      });
  };

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
    driveCandidateBulkUpload(driveId, file)
      .then((response) => {
        var result = HandleApiSuccess(response);
        setAddedCandidateIds(result.data!)
        setLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setLoading(false);
      });
  };

  return (
    <div className="dcan-container">
      <Spinner show={loading} />
      {/* Header */}
      <div className="dcan-header">
        <input type="text" placeholder="Search by name or email" 
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <CandidateSearchAdd
          candidates={candidates}
          onAdd={(candidate) => {
            if (window.confirm(`Add ${candidate.fullName} to this drive?`)) {
              addCandidate(candidate.candidateId);
            }
          }}
        />
        <button className="dcan-btn-bulk-upload" onClick={handleShowUpload} >
          Bulk <FaUpload/>
        </button>
      </div>

      {/* Upload Section */}
      <div className="dcan-bulk-upload-wrapper">
      {showUpload && (    
        <div className="dcan-bulk-upload-panel">
          {/* Download template */}
          {fileDownloadLink && 
            <Link to={ fileDownloadLink } download className="dcan-template-link">
              Download Template
            </Link>
          }

          {/* File select */}
          <label className="dcan-file-btn">
            Choose File
            <input type="file" accept=".csv,.xlsx" hidden onChange={handleFileChange}/>
          </label>

          {/* Show selected file */}
          {file && (<div className="dcan-file-name">{file.name}</div>)}

          {/* Upload */}
          <button className="dcan-upload-btn" disabled={!file} onClick={handleUpload}>
            Upload
          </button>
        </div>
      )}
      </div>

      {/* Members list */}
      <div ref={listRef} className="dcan-list">
        {filteredCandidates.length === 0 && 
          <div className="dcan-empty">No matched candidates found on current loaded items</div>
        }

        {filteredCandidates.map(dc => (
          <div key={dc.driverCandidateId} className="dcan-row">
            <div>
              <strong>{dc.candidateName}</strong>
              <div className="dcan-email">{dc.candidateEmail}</div>
            </div>

            <div>
              <FaEye
                className="dcan-view"
                onClick={() => navigate(`/admin/candidate/detail/${dc.candidateId}`)}
              />
              <FaTrash
                className="dcan-delete"
                onClick={() => removeCandidate(dc.candidateId)}
              />
            </div>
          </div>
        ))}

        {paginationLoading && <div className="dcan-loading">Loading...</div>}
        {!hasMore && <div className="dcan-end">No more records</div>}
      </div>
    </div>
  );
}
