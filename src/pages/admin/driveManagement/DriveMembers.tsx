import { useEffect, useMemo, useState } from "react";
import { FaTrash, FaEye } from "react-icons/fa";
import type { BaseResponse, DriveMember, User } from "../../../dto/Response";
import { addMemberToDrive, getDriveMembers, getUsers, removeDriveMember } from "../../../services/Auth.service";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import Spinner from "../../../components/Spinner";
import { useNavigate } from "react-router-dom";
import UserSearchAdd from "../../../components/UserSearchAdd";

interface DriveMembersProps {
  driveId: number;
  role: "HR" | "Panel" | "Mentor";
}

export default function DriveMembers({ driveId, role }: DriveMembersProps) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<DriveMember[]>([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  

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

  const filteredMembers = useMemo(() => {
      return members.filter((m) => {
        const matchSearch =
          m.userName.toLowerCase().includes(search.toLowerCase()) ||
          m.userEmail.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      });
    }, [search, members]);

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
      })
      .catch((err: AxiosError<BaseResponse>) => {
        HandleApiErrors(err);
        setLoading(false);
      });
  };

  return (
    <div className="dmem-container">
      <Spinner show={loading} />
      {/* Header */}
      <div className="dmem-header">
        <input type="text" placeholder="Search by name or email" 
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <UserSearchAdd users={users} onAdd={(user) => {addMember(user.userId);}}/>
      </div>

      {/* Members list */}
      <div className="dmem-list">
        {filteredMembers.length === 0 && <div className="dmem-empty">No members added</div>}

        {filteredMembers.map(m => (
          <div key={m.driveMemberId} className="dmem-row">
            <div>
              <strong>{m.userName}</strong>
              <div className="dmem-email">{m.userEmail}</div>
            </div>

            <div>
              <FaEye
                className="dmem-view"
                onClick={() => navigate(`/admin/user/detail/${m.userId}`)}
              />
              <FaTrash
                className="dmem-delete"
                onClick={() => removeMember(m.userId)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
