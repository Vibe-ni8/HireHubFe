import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BaseResponse, Drive } from "../../../dto/Response";
import Spinner from "../../../components/Spinner";
import { HandleApiErrors, HandleApiSuccess } from "../../../helper/HelperMethods";
import type { AxiosError } from "axios";
import { getDrives } from "../../../services/Auth.service";

export default function Drives() {
  
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [drives, setDrives] = useState<Array<Drive> | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [includePastDrivesFilter, setIncludePastDrivesFilter] = useState<boolean>(true);
  const [isLatestFirstFilter, setIsLatestFirstFilter] = useState<string>("a to z");
  const [page, setPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const pageSize = 10;

  useEffect(() => {
      setLoading(true);
      let driveStatus = statusFilter === 'all' ? null : statusFilter;
      let isLatestFirst = isLatestFirstFilter === 'a to z' ? null : isLatestFirstFilter === 'latest' ? true :  false;
      getDrives(driveStatus, null, null, isLatestFirst, includePastDrivesFilter, page, pageSize, startDate, endDate)
        .then((response) => {
          const result = HandleApiSuccess(response);
          setDrives(result.data ?? null);
          setLoading(false);
        })
        .catch((err: AxiosError<BaseResponse>) => {
          HandleApiErrors(err);
          setLoading(false);
        });
    }, [statusFilter, includePastDrivesFilter, isLatestFirstFilter, page, startDate, endDate]);

  const filteredUsers = useMemo(() => {
    return drives === null ? [] : drives.filter((d) => {
      const matchSearch =
        d.driveName.toLowerCase().includes(search.toLowerCase())
      return matchSearch;
    });
  }, [search, drives]);
  
  return (
    <div className="dm-page">
      {/* Spinner */}
      <Spinner show={loading}/>

      {/* Header */}
      <div className="dm-header">
        <h2>Drives</h2>
        <button className="dm-add-btn" onClick={() => navigate("/admin/drive/add")} >
          + Add Drive
        </button>
      </div>

      {/* Filters */}
      <div className="dm-filters">
        <input
          type="text"
          placeholder="Search by drive name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <label>Include Past Drives</label>
          <input
            type="checkbox"
            checked={includePastDrivesFilter}
            onChange={(e) => setIncludePastDrivesFilter(e.target.checked)}
          />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="InProposal">InProposal</option>
          <option value="Started">Started</option>
          <option value="Halted">Halted</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select value={isLatestFirstFilter} onChange={(e) => setIsLatestFirstFilter(e.target.value)}>
          <option value="a to z">A to Z</option>
          <option value="latest">Latest First </option>
          <option value="oldest">Oldest First </option>
        </select>

        <div>
          <label>Start Date:</label>
          <input type="date" value={startDate?.toISOString().split("T")[0] ?? ""} 
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>

        <div>
          <label>End Date:</label>
          <input type="date" value={endDate?.toISOString().split("T")[0] ?? ""} 
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="dm-table-wrapper dm-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Creator</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="dm-empty">
                  Loading Data...
                </td>
              </tr>
            ) : drives === null ? (
              <tr>
                <td colSpan={4} className="dm-empty">
                  No drive record found
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="dm-empty">
                  No drives found on current batch
                </td>
              </tr>
            ) : 
              <>
                {filteredUsers.map((drive) => (
                  <tr
                    key={drive.driveId}
                    onClick={() => navigate(`/admin/drive/detail/${drive.driveId}`)}
                  >
                    <td>{drive.driveName}</td>
                    <td>{drive.driveDate.toDateString()}</td>
                    <td>
                      <span className={`dm-${drive.driveStatus}`}>
                        {drive.driveStatus}
                      </span>
                    </td>
                    <td>{drive.creatorName}</td>
                  </tr>
                ))}
              </>
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="dm-pagination">
        <button onClick={() => setPage(p => p-1)} disabled={page === 1}>
          {'<'}
        </button>
        <span>{page}</span>
        <button onClick={() => setPage(p => p+1)} disabled={drives === null || drives?.length < pageSize}>
          {'>'}
        </button>
      </div>
    </div>
  );
}
