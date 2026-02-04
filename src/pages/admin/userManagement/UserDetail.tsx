import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { BaseResponse, User } from "../../../dto/Response";
import Spinner from "../../../components/Spinner";
import { editUser, getUser } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiResponse } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import { FaPencilAlt } from "react-icons/fa";

export default function UserDetail() {

  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const [user, setUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [payload, setPayload] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value, type, checked } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: type === 'checkbox' ? checked : value
    });
    setPayload({
      ...payload,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    editUser({userId:user?.userId, ...payload})
      .then((response) => {
        const result = HandleApiResponse(response);
        setUser(result.data ?? null);
        setEditedUser(null);
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
    setEditedUser(null); 
    setPayload({});
    setEditMode(false);
  }

  if (loading) return (
    <>
      <Spinner show={loading}/>
      <div className="ud-loading">Loading user detail...</div>
    </>
  );
  if (!user) return <div className="ud-notfound">User not found</div>;
  return (
    <form className="user-detail" onSubmit={handleSubmit}>
      <Spinner show={editLoading}/>
      <div className="ud-head">
        <h2>User Detail</h2>
        {!isEditMode && <button onClick={() => {setEditedUser(user); setEditMode(true);}}>
          <FaPencilAlt />
        </button>}
      </div>

      <div className="ud-detail-row">
        <label>Full Name:</label>
        {isEditMode ? (
          <input name="fullName" required value={editedUser?.fullName ?? ''} onChange={handleChange}/>
        ) : (
          <span>{user.fullName}</span>
        )}
      </div>

      <div className="ud-detail-row">
        <label>Email:</label>
        {isEditMode ? (
          <input name="email" required value={editedUser?.email ?? ''} onChange={handleChange}/>
        ) : (
          <span>{user.email}</span>
        )}
      </div>

      <div className="ud-detail-row">
        <label>Phone:</label>
        {isEditMode ? (
          <input name="phone" required value={editedUser?.phone ?? ''} onChange={handleChange}/>
        ) : (
          <span>{user.phone}</span>
        )}
      </div>

      <div className="ud-detail-row">
        <label>Role:</label>
        <span>{user.roleName}</span>
      </div>

      <div className="ud-detail-row">
        <label>Status:</label>
        {isEditMode ? (
          <input type="checkbox" name="isActive" checked={editedUser?.isActive ?? false} 
            onChange={handleChange} className="ud-checkbox"/>
        ) : (
          <span className={user.isActive ? 'ud-active' : 'ud-inactive'}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        )}
      </div>

      <div className="ud-detail-row">
        <label>Joined From:</label>
        <span>{user.createdDate.toDateString()}</span>
      </div>

      {isEditMode && (
        <div className="ud-actions">
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
