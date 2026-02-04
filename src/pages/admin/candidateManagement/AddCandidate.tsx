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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setCandidate({
        ...candidate,
        [name]: value.toString()
      });
    };

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
                    <label>Full Name:</label>
                    <input type="text" name="fullName" required value={candidate.fullName} onChange={handleChange} />
                </div>
                <div className="ac-input-block">
                    <label>Email:</label>
                    <input type="text" name="email" required value={candidate.email} onChange={handleChange} placeholder="you@company.com" />
                </div>
                <div className="ac-input-block">
                    <label>Phone:</label>
                    <input type="number" name="phone" required value={candidate.phone} onChange={handleChange} placeholder="+91  _ _ _ _ _ _ _ _ _ _" />
                </div>
                <div className="ac-input-block">
                    <label>Experience:</label>
                    <select name="experienceLevelName" required value={candidate.experienceLevelName} onChange={handleChange} >
                        <option value=''>Select</option>
                        <option value='Fresher'>Fresher</option>
                        <option value='Intermediate'>Intermediate</option>
                        <option value='Experienced'>Experienced</option>
                    </select>
                </div>
                <div className="ac-button-block">
                    <button type="submit">Add</button>
                </div>
            </form>
        </div>
    );
}