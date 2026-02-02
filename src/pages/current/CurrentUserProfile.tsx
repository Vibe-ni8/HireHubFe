import { useEffect, useState } from "react";
import type { BaseResponse, User } from "../../dto/Response";
import './Current.css';
import { useAuth } from "../../auth/AuthContext";
import { getUser } from "../../services/Auth.service";
import { HandleApiErrors, HandleApiResponse } from "../../helper/HelperMethods";
import type { AxiosError } from "axios";

export default function CurrentUserProfile() {

  const { getUserId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
    
  useEffect(() => {
      let userId = getUserId();
      getUser(userId!)
        .then((response) => {
          const result = HandleApiResponse(response);
          setUser(result.data ?? null);
        })
        .catch((err: AxiosError<BaseResponse>) => {
          HandleApiErrors(err);
        });
    }, []);

  if (!user) {
    return <div className="cu-profile-loading">Loading profile...</div>;
  }
  return (
    <div className="cu-profile-page">
      <div className="cu-profile-card">

        <div className="cu-profile-avatar">
          {user.fullName.charAt(0)}
        </div>

        <h2>{user.fullName}</h2>
        <p className="cu-profile-role">{user.roleName}</p>

        <div className="cu-profile-details">
          <div className="cu-detail">
            <span>Email</span>
            <p>{user.email}</p>
          </div>

          <div className="cu-detail">
            <span>Phone</span>
            <p>{user.phone}</p>
          </div>

          <div className="cu-detail">
            <span>Status</span>
            <p className={user.isActive ? "cu-active" : "cu-inactive"}>
              {user.isActive ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="cu-detail">
            <span>Joined On</span>
            <p>{user.createdDate.toLocaleDateString()}</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}