import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { BaseResponse, User } from "../../../dto/Response";
import Spinner from "../../../components/Spinner";
import { getUser } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiResponse } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";

export default function UserDetail() {

  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUser(userId)
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

    // ⏳ Loading state
  if (loading) return (
    <>
      <Spinner show={loading}/>
      <div className="ud-loading">Loading user detail...</div>
    </>
  );

  // 🧠 Safety check
  if (!user) return <div className="ud-notfound">User not found</div>;
    
  return (
    <div className="user-detail">
      <h2>User Detail</h2>

      <div className="ud-detail-row">
        <label>Full Name:</label>
        <span>{user.fullName}</span>
      </div>

      <div className="ud-detail-row">
        <label>Email:</label>
        <span>{user.email}</span>
      </div>

      <div className="ud-detail-row">
        <label>Phone:</label>
        <span>{user.phone}</span>
      </div>

      <div className="ud-detail-row">
        <label>Role:</label>
        <span>{user.roleName}</span>
      </div>

      <div className="ud-detail-row">
        <label>Status:</label>
        <span className={user.isActive ? 'ud-active' : 'ud-inactive'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="ud-detail-row">
        <label>Created:</label>
        <span>{user.createdDate.toDateString()}</span>
      </div>

      {user.updatedDate && (
        <div className="ud-detail-row">
          <label>Updated:</label>
          <span>{new Date(user.updatedDate).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
