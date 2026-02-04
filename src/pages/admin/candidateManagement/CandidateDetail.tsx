import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
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
  const [newTech, setNewTech] = useState('');

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

  const enterEditMode = () => {
    setEditedCandidate(candidate); 
    setPayload({ candidateId: candidate?.candidateId });
    setEditMode(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const removeTech = (index: number) => {
    if (!editedCandidate) return;
    let updatedTechStack = editedCandidate.techStack.filter((_, idx) => idx !== index);
    setEditedCandidate({ ...editedCandidate, techStack: updatedTechStack });
    setPayload({ ...payload, techStack: updatedTechStack });
  }

  const addTech = () => {
    if (!editedCandidate) return;
    if (!newTech.trim() || editedCandidate.techStack.includes(newTech.trim())) {
      setNewTech('');
      return;
    }
    let updatedTechStack = [ ...editedCandidate.techStack, newTech.trim() ];
    setEditedCandidate({ ...editedCandidate, techStack: updatedTechStack });
    setPayload({ ...payload, techStack: updatedTechStack });
    setNewTech('');
  }

  const addTechInsteadSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { 
      e.preventDefault(); 
      addTech();   
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    editCandidate(payload)
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
    <form className="candidate-detail" onSubmit={handleSubmit}>
      <Spinner show={editLoading}/>
      <div className="cd-head">
        <h2>Candidate Detail</h2>
        {!isEditMode && <button onClick={enterEditMode}>
          <FaPencilAlt />
        </button>}
      </div>

      <div className="cd-detail-row">
        <label>Full Name:</label>
        {isEditMode ? (
          <input name="fullName" required value={editedCandidate?.fullName ?? ''} onChange={handleChange}/>
        ) : (
          <span>{candidate.fullName}</span>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Email:</label>
        {isEditMode ? (
          <input name="email" required value={editedCandidate?.email ?? ''} onChange={handleChange}/>
        ) : (
          <span>{candidate.email}</span>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Phone:</label>
        {isEditMode ? (
          <input name="phone" required value={editedCandidate?.phone ?? ''} onChange={handleChange}/>
        ) : (
          <span>{candidate.phone}</span>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Address:</label>
        {isEditMode ? (
          <input name="address" value={editedCandidate?.address ?? ''} onChange={handleChange}/>
        ) : (
          <span>{candidate.address}</span>
        )}
      </div>

      <div className="cd-detail-row">
        <label>College:</label>
        {isEditMode ? (
          <input name="college" value={editedCandidate?.college ?? ''} onChange={handleChange}/>
        ) : (
          <span>{candidate.college}</span>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Previous Company:</label>
        {isEditMode ? (
          <input name="previousCompany" value={editedCandidate?.previousCompany ?? ''} 
          onChange={handleChange}/>
        ) : (
          <span>{candidate.previousCompany}</span>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Experience:</label>
        {isEditMode ? (
          <select name="experienceLevel" required value={editedCandidate?.candidateExperienceLevel ?? ''} 
          onChange={handleChange} >
            <option value='Fresher'>Fresher</option>
            <option value='Intermediate'>Intermediate</option>
            <option value='Experienced'>Experienced</option>
          </select>
        ) : (
          <span>{candidate.candidateExperienceLevel}</span>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Tech Stack:</label>
        {!isEditMode ? (
          <div className="cd-tags">
            {candidate.techStack.map((tech, i) => (
              <span key={i} className="cd-tag">
                {tech}
              </span>
            ))}
          </div>
        ) : (
          <div>
            <div className="cd-tags">
              {editedCandidate?.techStack.map((tech, i) => (
                <span key={i} className="cd-tag">
                  {tech}
                  <button type="button" className="cd-remove" onClick={() => removeTech(i)} > 
                    × 
                  </button>
                </span>
              ))}
            </div>
            <div className="cd-add">
              <input type="text" placeholder="Add tech" value={newTech} 
                onChange={e => setNewTech(e.target.value)} 
                onKeyDown={addTechInsteadSubmit} 
              />
              <button type="button" onClick={addTech}> Add </button>
            </div>
          </div>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Resume url:</label>
        {isEditMode ? (
          <input name="resumeUrl" value={editedCandidate?.resumeUrl ?? ''} 
          onChange={handleChange}/>
        ) : (
          <NavLink to={`${candidate.resumeUrl}`} target="_blank" rel="noopener noreferrer">
            view resume
          </NavLink>
        )}
      </div>

      <div className="cd-detail-row">
        <label>LinkedIn url:</label>
        {isEditMode ? (
          <input name="linkedInUrl" value={editedCandidate?.linkedInUrl ?? ''} 
          onChange={handleChange}/>
        ) : (
          <NavLink to={`${candidate.linkedInUrl}`} target="_blank" rel="noopener noreferrer">
            open LinkedIn
          </NavLink>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Github url:</label>
        {isEditMode ? (
          <input name="gitHubUrl" value={editedCandidate?.gitHubUrl ?? ''} 
          onChange={handleChange}/>
        ) : (
          <NavLink to={`${candidate.gitHubUrl}`} target="_blank" rel="noopener noreferrer">
            open Github
          </NavLink>
        )}
      </div>

      <div className="cd-detail-row">
        <label>Joined From:</label>
        <span>{candidate.createdDate.toDateString()}</span>
      </div>

      {isEditMode && (
        <div className="cd-actions">
          <button type="submit" className="btn-save">
            Save
          </button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}
