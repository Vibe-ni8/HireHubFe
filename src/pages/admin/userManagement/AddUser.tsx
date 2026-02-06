import { useState } from "react";
import Spinner from "../../../components/Spinner";
import type { AddUserRequest } from "../../../dto/Request";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import type { BaseResponse } from "../../../dto/Response";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../../services/Auth.service";

export default function AddUser() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<AddUserRequest>({
        fullName: '', email: '', phone: '', roleName: 'Hr', password: 'Welcome@123'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setUser({
        ...user,
        [name]: value.toString()
      });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        addUser(user)
          .then((response) => {
            let result = HandleApiSuccess(response);
            setLoading(false);
            navigate(`/admin/user/detail/${result.data?.userId}`);
          })
          .catch((err: AxiosError<BaseResponse>) => {
            HandleApiErrors(err);
            setLoading(false);
          });
      };
    
    return (
        <div className="um-page">
            {/* Spinner */}
            <Spinner show={loading}/>

            {/* Header */}
            <div className="um-header">
                <h2>Add User</h2>
            </div>

            {/* Add User Section */}
            <form className="add-user-section" onSubmit={handleSubmit}>
                <div className="au-input-block">
                    <label>Full Name*:</label>
                    <input type="text" name="fullName" required value={user.fullName} onChange={handleChange} />
                </div>
                <div className="au-input-block">
                    <label>Email*:</label>
                    <input type="text" name="email" required value={user.email} onChange={handleChange} placeholder="you@company.com" />
                </div>
                <div className="au-input-block">
                    <label>Phone*:</label>
                    <input type="number" name="phone" required value={user.phone} onChange={handleChange} placeholder="+91  _ _ _ _ _ _ _ _ _ _" />
                </div>
                <div className="au-input-block">
                    <label>Role*:</label>
                    <select name="roleName" required value={user.roleName} onChange={handleChange} >
                        <option value={''}>Select</option>
                        <option value={'HR'}>HR</option>
                        <option value={'Panel'}>Panel</option>
                        <option value={'Mentor'}>Mentor</option>
                        <option value={'Admin'}>Admin</option>
                    </select>
                </div>
                <div className="au-input-block">
                    <label>Password*:</label>
                    <input type="password" name="password" required value={user.password} onChange={handleChange} />
                </div>
                <div className="au-button-block">
                    <button type="submit">Add</button>
                </div>
            </form>
        </div>
    );
}