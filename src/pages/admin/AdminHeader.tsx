import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useEffect, useState } from "react";
import { getUser } from "../../services/Auth.service";
import type { AxiosError } from "axios";
import type { BaseResponse, User } from "../../dto/Response";
import { HandleApiErrors, HandleApiResponse } from "../../helper/HelperMethods";
import Spinner from "../../components/Spinner";

export default function AdminHeader() {

  const { logout, getUserId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let userId = getUserId();
    setLoading(true);
    getUser(userId!)
      .then((response) => {
        const result = HandleApiResponse(response);
        setUser(result.data ?? null);
        setLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setLoading(false);
      });
  }, []);
    
  const handleLogout = () => {
      logout();
  };
  
  return (
    <div className="admin-header">
      <Spinner show={loading}/>
      <h2>👋Welcome back, {user?.fullName ?? '?'}</h2>
      <div className="admin-profile">
        <div className="profile-avatar">{user?.fullName.charAt(0) ?? '?'}</div>
        <div className="profile-dropdown">
          <div className="profile-info">
            <p className="profile-name">{user?.fullName}</p>
            <p className="profile-email">{user?.email}</p>
          </div>
          <ul>
            <li><NavLink to="my/profile">My Profile</NavLink></li>
            <li><NavLink to="#">Settings</NavLink></li>
            <li className="danger">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}