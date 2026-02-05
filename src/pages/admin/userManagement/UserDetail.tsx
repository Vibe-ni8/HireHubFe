import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { BaseResponse, User } from "../../../dto/Response";
import Spinner from "../../../components/Spinner";
import { editUser, getDriveMembers, getUser } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiResponse } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from "react-toastify";

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

  const enterEditMode = () => {
    setEditedUser(user); 
    setPayload({ userId: user?.userId });
    setEditMode(true);
  }

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

  const postDateToServer = () => {
    editUser(payload)
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
  }

  const confirmMessage = 'This user is part of one or more upcoming drives. Inactivating will affect those drives. Continue?';
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    let haveUpcomingDrive: boolean = false;
    if (payload.isActive === false)
    {
      getDriveMembers(null, userId, null, null, null, false, 1, 1)
        .then((response) => {
          haveUpcomingDrive = response.data.data!.length > 0;
          const proceed = haveUpcomingDrive ? window.confirm(confirmMessage) : true;
          if (proceed)
            postDateToServer();
          else {
            setEditLoading(false);
          }
        })
        .catch(() => {
          toast.error('Unable to proceed now. Try again later');
          setEditLoading(false);
        });
    }
    else
      postDateToServer();
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
        {!isEditMode && <button onClick={enterEditMode}>
          <FaPencilAlt />
        </button>}
      </div>

      <div className="ud-detail-row">
        <label>Full Name{isEditMode ? '*' : ''}:</label>
        {isEditMode ? (
          <input name="fullName" required value={editedUser?.fullName ?? ''} onChange={handleChange}/>
        ) : (
          <span>{user.fullName}</span>
        )}
      </div>

      <div className="ud-detail-row">
        <label>Email{isEditMode ? '*' : ''}:</label>
        {isEditMode ? (
          <input name="email" required value={editedUser?.email ?? ''} onChange={handleChange}/>
        ) : (
          <span>{user.email}</span>
        )}
      </div>

      <div className="ud-detail-row">
        <label>Phone{isEditMode ? '*' : ''}:</label>
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
