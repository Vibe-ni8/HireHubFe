import { useState } from "react";
import Spinner from "../../../components/Spinner";
import type { AddCandidateRequest } from "../../../dto/Request";
import { HandleApiErrors, HandleApiResponse } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import type { BaseResponse } from "../../../dto/Response";
import { useNavigate } from "react-router-dom";
import { addCandidate } from "../../../services/Auth.service";

export default function AddCandidate() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [candidate, setCandidate] = useState<AddCandidateRequest>({
        fullName: '', email: '', phone: '', address: null, college: null,
        previousCompany: null, experienceLevelName: '', techStack: [],
        resumeUrl: null, linkedInUrl: null, gitHubUrl: null
    });
    const [newTech, setNewTech] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setCandidate({
        ...candidate,
        [name]: value.toString()
      });
    };

    const removeTech = (index: number) => {
      let updatedTechStack = candidate.techStack.filter((_, idx) => idx !== index);
      setCandidate({ ...candidate, techStack: updatedTechStack });
    }

    const addTech = () => {
        if (!newTech.trim() || candidate.techStack.includes(newTech.trim())) {
          setNewTech('');
          return;
        }
        let updatedTechStack = [ ...candidate.techStack, newTech.trim() ];
        setCandidate({ ...candidate, techStack: updatedTechStack });
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
        setLoading(true);
        addCandidate(candidate)
          .then((response) => {
            let result = HandleApiResponse(response);
            setLoading(false);
            navigate(`/admin/candidate/detail/${result.data?.candidateId}`);
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
                <h2>Add Candidate</h2>
            </div>

            {/* Add User Section */}
            <form className="add-candidate-section" onSubmit={handleSubmit}>
                <div className="ac-input-block">
                    <label>Full Name*:</label>
                    <input type="text" name="fullName" required value={candidate.fullName} onChange={handleChange} />
                </div>
                <div className="ac-input-block">
                    <label>Email*:</label>
                    <input type="text" name="email" required value={candidate.email} onChange={handleChange} placeholder="you@company.com" />
                </div>
                <div className="ac-input-block">
                    <label>Phone*:</label>
                    <input type="number" name="phone" required value={candidate.phone} onChange={handleChange} placeholder="+91  _ _ _ _ _ _ _ _ _ _" />
                </div>
                <div className="ac-input-block">
                    <label>Address:</label>
                    <input type="text" name="address" value={candidate.address ?? ''} onChange={handleChange} />
                </div>
                <div className="ac-input-block">
                    <label>College:</label>
                    <input type="text" name="college" value={candidate.college ?? ''} onChange={handleChange} />
                </div>
                <div className="ac-input-block">
                    <label>Previous Company:</label>
                    <input type="text" name="previousCompany" value={candidate.previousCompany ?? ''} onChange={handleChange} />
                </div>
                <div className="ac-input-block">
                    <label>Experience*:</label>
                    <select name="experienceLevelName" required value={candidate.experienceLevelName} onChange={handleChange} >
                        <option value=''>Select</option>
                        <option value='Fresher'>Fresher</option>
                        <option value='Intermediate'>Intermediate</option>
                        <option value='Experienced'>Experienced</option>
                    </select>
                </div>
                <div className="ac-input-block">
                    <label>TeckStack:</label>
                    <div className="ac-teckstack">
                        <div className="cd-tags">
                            {candidate?.techStack.map((tech, i) => (
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
                </div>
                <div className="ac-input-block">
                    <label>Resume url:</label>
                    <input type="text" name="resumeUrl" value={candidate.resumeUrl ?? ''} onChange={handleChange} />
                </div>
                <div className="ac-input-block">
                    <label>LinkedIn url:</label>
                    <input type="text" name="linkedInUrl" value={candidate.linkedInUrl ?? ''} onChange={handleChange} />
                </div>
                <div className="ac-input-block">
                    <label>GitHub url:</label>
                    <input type="text" name="gitHubUrl" value={candidate.gitHubUrl ?? ''} onChange={handleChange} />
                </div>
                <div className="ac-button-block">
                    <button type="submit">Add</button>
                </div>
            </form>
        </div>
    );
}