import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { BaseResponse, Candidate } from "../../../dto/Response";
import Spinner from "../../../components/Spinner";
import { editCandidate, getCandidate } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiResponse } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import { FaPencilAlt } from "react-icons/fa";

export default function CandidateDetail() {

  const { id } = useParams<{ id: string }>();
  const candidateId = Number(id);

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [editedCandidate, setEditedCandidate] = useState<Candidate | null>(null);
  const [payload, setPayload] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCandidate(candidateId)
      .then((response) => {
        const result = HandleApiResponse(response);
        setCandidate(result.data ?? null);
        setLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedCandidate) return;
    const { name, value } = e.target;
    setEditedCandidate({
      ...editedCandidate,
      [name === 'experienceLevel' ? 'candidateExperienceLevel' : name] : value
    });
    setPayload({
      ...payload,
      [name] : value
    });
  };

  const handleSubmit = () => {
    setEditLoading(true);
    editCandidate({candidateId:candidate?.candidateId, ...payload})
      .then((response) => {
        const result = HandleApiResponse(response);
        setCandidate(result.data ?? null);
        setEditedCandidate(null);
        setPayload({});
        setEditMode(false);
        setEditLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setEditLoading(false);
      });
  };

  const handleCancel = () => {
    setEditedCandidate(null); 
    setPayload({});
    setEditMode(false);
  }

  if (loading) return (
    <>
      <Spinner show={loading}/>
      <div className="cd-loading">Loading candidate detail...</div>
    </>
  );
  if (!candidate) return <div className="cd-notfound">Candidate not found</div>;
  return (
    <div className="candidate-detail">
      <Spinner show={editLoading}/>
      <div className="cd-head">
        <h2>Candidate Detail</h2>
        {!isEditMode && <button onClick={() => {setEditedCandidate(candidate); setEditMode(true);}}>
          <FaPencilAlt />
        </button>}
      </div>

      <div className="cd-detail-row">
        <label>Full Name:</label>
        {isEditMode ? (
          <input name="fullName" value={editedCandidate?.fullName ?? ''} onChange={handleChange}/>
        ) : (
          <span>{candidate.fullName}</span>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Email:</label>
        {isEditMode ? (
          <input name="email" value={editedCandidate?.email ?? ''} onChange={handleChange}/>
        ) : (
          <span>{candidate.email}</span>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Phone:</label>
        {isEditMode ? (
          <input name="phone" value={editedCandidate?.phone ?? ''} onChange={handleChange}/>
        ) : (
          <span>{candidate.phone}</span>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Joined From:</label>
        <span>{candidate.createdDate.toDateString()}</span>
      </div>

      {isEditMode && (
        <div className="cd-actions">
          <button className="btn-save" onClick={handleSubmit}>
            Save
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
