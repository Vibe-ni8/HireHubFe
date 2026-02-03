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

  const [user, setUser] = useState<User | null>(dummyUsers[userId-1]);
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

  const handleSubmit = () => {
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
    <div className="user-detail">
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
          <input name="fullName" value={editedUser?.fullName ?? ''} onChange={handleChange}/>
        ) : (
          <span>{user.fullName}</span>
        )}
      </div>

      <div className="ud-detail-row">
        <label>Email:</label>
        {isEditMode ? (
          <input name="email" value={editedUser?.email ?? ''} onChange={handleChange}/>
        ) : (
          <span>{user.email}</span>
        )}
      </div>

      <div className="ud-detail-row">
        <label>Phone:</label>
        {isEditMode ? (
          <input name="phone" value={editedUser?.phone ?? ''} onChange={handleChange}/>
        ) : (
          <span>{user.phone}</span>
        )}
      </div>

      <div className="ud-detail-row">
        <label>Role:</label>
        <span>{user.roleName}</span>
      </div>

      <div className="ud-detail-row ud-checkbox">
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

const dummyUsers: User[] = [
  {
    userId: 1,
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9876543210',
    isActive: true,
    roleId: 1,
    roleName: 'Admin',
    createdDate: new Date('2024-01-10T10:30:00'),
    updatedDate: new Date('2024-06-15T14:45:00')
  },
  {
    userId: 2,
    fullName: 'Anita Verma',
    email: 'anita.verma@example.com',
    phone: '9123456789',
    isActive: true,
    roleId: 2,
    roleName: 'Manager',
    createdDate: new Date('2024-02-05T09:15:00'),
    updatedDate: null
  },
  {
    userId: 3,
    fullName: 'Suresh Kumar',
    email: 'suresh.kumar@example.com',
    phone: '9988776655',
    isActive: false,
    roleId: 3,
    roleName: 'Staff',
    createdDate: new Date('2023-11-20T16:00:00'),
    updatedDate: new Date('2024-03-01T11:20:00')
  },
  {
    userId: 4,
    fullName: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '9090909090',
    isActive: true,
    roleId: 2,
    roleName: 'Manager',
    createdDate: new Date('2024-04-18T08:50:00'),
    updatedDate: null
  }
];