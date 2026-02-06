import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BaseResponse, User } from "../../../dto/Response";
import Spinner from "../../../components/Spinner";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import { getUsers } from "../../../services/Auth.service";

export default function Users() {
  
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<User> | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isLatestFirstFilter, setIsLatestFirstFilter] = useState<string>("a to z");
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  useEffect(() => {
      setLoading(true);
      let isActive = statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : null;
      let role = roleFilter === 'all' ? null : roleFilter;
      let isLatestFirst = isLatestFirstFilter === 'a to z' ? null : isLatestFirstFilter === 'latest' ? true :  false;
      getUsers(role, isActive, isLatestFirst, page, pageSize)
        .then((response) => {
          const result = HandleApiSuccess(response);
          setUsers(result.data ?? null);
          setLoading(false);
        })
        .catch((err: AxiosError<BaseResponse>) => {
          HandleApiErrors(err);
          setLoading(false);
        });
    }, [statusFilter, roleFilter, isLatestFirstFilter, page]);

  const filteredUsers = useMemo(() => {
    return users === null ? [] : users.filter((u) => {
      const matchSearch =
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [search, users]);
  
  return (
    <div className="um-page">
      {/* Spinner */}
      <Spinner show={loading}/>

      {/* Header */}
      <div className="um-header">
        <h2>Users</h2>
        <button className="um-add-btn" onClick={() => navigate("/admin/user/add")} >
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div className="um-filters">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
          <option value="Panel">Panel</option>
          <option value="Mentor">Mentor</option>
        </select>

        <select value={isLatestFirstFilter} onChange={(e) => setIsLatestFirstFilter(e.target.value)}>
          <option value="a to z">A to Z</option>
          <option value="latest">Latest First </option>
          <option value="oldest">Oldest First </option>
        </select>
      </div>

      {/* Table */}
      <div className="um-table-wrapper um-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="um-empty">
                  Loading Data...
                </td>
              </tr>
            ) : users === null ? (
              <tr>
                <td colSpan={4} className="um-empty">
                  No user record found
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="um-empty">
                  No users found on current batch
                </td>
              </tr>
            ) : 
              <>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.userId}
                    onClick={() => navigate(`/admin/user/detail/${user.userId}`)}
                  >
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.roleName}</td>
                    <td>
                      <span className={user.isActive ? "um-active" : "um-inactive"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </>
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="um-pagination">
        <button onClick={() => setPage(p => p-1)} disabled={page === 1}>
          {'<'}
        </button>
        <span>{page}</span>
        <button onClick={() => setPage(p => p+1)} disabled={users === null || users?.length < pageSize}>
          {'>'}
        </button>
      </div>
    </div>
  );
}
