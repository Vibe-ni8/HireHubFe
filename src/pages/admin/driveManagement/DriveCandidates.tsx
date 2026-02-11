import { useEffect, useMemo, useState } from "react";
import { FaTrash, FaEye } from "react-icons/fa";
import type { BaseResponse, Candidate, DriveCandidate } from "../../../dto/Response";
import { addCandidatesToDrive, getCandidates, getDriveCandidates, removeDriveCandidates } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import Spinner from "../../../components/Spinner";
import { useNavigate } from "react-router-dom";
import CandidateSearchAdd from "../../../components/CandidateSearchAdd";

interface DriveCandidatesProps {
  driveId: number;
}

export default function DriveCandidates({ driveId }: DriveCandidatesProps) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [driveCandidates, setDriveCandidates] = useState<DriveCandidate[]>([]);
  const [candidateIdsAdded, setCandidateIdsAdded] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  

  useEffect(() => {
    setLoading(true);
    getDriveCandidates(driveId, null, null, null, null, true)
      .then((response) => {
        const result = HandleApiSuccess(response);
        setDriveCandidates(result.data ?? []);
        setLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setDriveCandidates([]);
        setLoading(false);
      });
  }, [driveId, candidateIdsAdded]);

  const filteredCandidates = useMemo(() => {
      return driveCandidates.filter((m) => {
        const matchSearch =
          m.candidateName.toLowerCase().includes(search.toLowerCase()) ||
          m.candidateEmail.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      });
    }, [search, driveCandidates]);

  useEffect(() => {
    getCandidates(null, true, 1, 100)
      .then((response) => {
        const result = HandleApiSuccess(response);
        setCandidates(result.data ?? []);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setCandidates([]);
      });
  }, []);

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
        setCandidateIdsAdded(result.data ?? []);
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
      </div>

      {/* Members list */}
      <div className="dcan-list">
        {filteredCandidates.length === 0 && <div className="dcan-empty">No candidates added</div>}

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
      </div>
    </div>
  );
}
