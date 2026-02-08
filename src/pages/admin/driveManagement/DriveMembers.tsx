import { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import type { BaseResponse, DriveMember, User } from "../../../dto/Response";
import { addMemberToDrive, getDriveMembers, getUsers, removeDriveMember } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import Spinner from "../../../components/Spinner";

interface DriveMembersProps {
  driveId: number;
  role: "HR" | "Panel" | "Mentor";
}

export default function DriveMembers({ driveId, role }: DriveMembersProps) {

  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<DriveMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDriveMembers(driveId, null, role, null, null, true)
      .then((response) => {
        const result = HandleApiSuccess(response);
        setMembers(result.data ?? []);
        setLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setMembers([]);
        setLoading(false);
      });
  }, [driveId, role]);

  useEffect(() => {
    getUsers(role, true)
      .then((response) => {
        const result = HandleApiSuccess(response);
        setUsers(result.data ?? []);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setUsers([]);
      });
  }, [role]);

  const removeMember = (userId: number) => {
    if (!window.confirm("Are you sure you want to remove this member?")) 
        return;
    setLoading(true);
    removeDriveMember({driveId:driveId, memberId:userId})
      .then((response) => {
        const result = HandleApiSuccess(response);
        setMembers(prev => prev.filter(e => e.driveMemberId!=result.data?.driveMemberId));
        setLoading(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setLoading(false);
      });
  };

  const addMember = (userId: number) => {
    setLoading(true);
    addMemberToDrive({driveId:driveId, memberId:userId, memberRole:role})
      .then((response) => {
        const result = HandleApiSuccess(response);
        setMembers(prev => [...prev, result.data!]);
        setLoading(false);
        setShowList(false);
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setLoading(false);
        setShowList(false);
      });
  };

  return (
    <div className="dmem-container">
      <Spinner show={loading} />
      {/* Header */}
      <div className="dmem-header">
        <input placeholder="Search by name"/>
        <button className="dmem-add-btn" onClick={() => setShowList(p => !p)}>
          <FaPlus /> Add {role}
        </button>
      </div>

      {/* Add panel */}
      {showList && (
        <div className="dmem-add-panel">
          {users.map(u => (
            <div key={u.userId} className="dmem-user-row">
              <span>{u.fullName} ({u.email})</span>
              <button onClick={() => addMember(u.userId)}><FaPlus /></button>
            </div>
          ))}
        </div>
      )}

      {/* Members list */}
      <div className="dmem-list">
        {members.length === 0 && <div className="dmem-empty">No members added</div>}

        {members.map(m => (
          <div key={m.driveMemberId} className="dmem-row">
            <div>
              <strong>{m.userName}</strong>
              <div className="dmem-email">{m.userEmail}</div>
            </div>

            <FaTrash
              className="dmem-delete"
              onClick={() => removeMember(m.userId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
