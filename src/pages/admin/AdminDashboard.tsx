import { useEffect, useState } from "react";
import type { AdminDashboardDetails, BaseResponse } from "../../dto/Response";
import type { AxiosError } from "axios";
import { HandleApiErrors, HandleApiSuccess } from "../../helper/HelperMethods";
import { getAdminDashboardDetails } from "../../services/Auth.service";
import Spinner from "../../components/Spinner";

export default function AdminDashboard() {

  const [detail, setDetail] = useState<AdminDashboardDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
    useEffect(() => {
      setLoading(true);
      getAdminDashboardDetails()
        .then((response) => {
          const result = HandleApiSuccess(response);
          setDetail(result.data ?? null);
          setLoading(false);
        })
        .catch((err: AxiosError<BaseResponse>) => {
          HandleApiErrors(err);
          setLoading(false);
        });
    }, []);

  return (
    <div className="admin-dashboard">
      <Spinner show={loading}/>

      <label>User</label>
      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Users</h3>
          <p>{detail?.totalUsers ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Active Users</h3>
          <p>{detail?.activeUsers ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Inactive Users</h3>
          <p>{detail?.inactiveUsers ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Human Resources</h3>
          <p>{detail?.totalHrs ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Panel Members</h3>
          <p>{detail?.totalPanelMembers ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Mentors</h3>
          <p>{detail?.totalMentors ?? '-'}</p>
        </div>
      
      </div>

      <label>Candidate</label>
      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Candidates</h3>
          <p>{detail?.totalCandidates ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Candidates Hired</h3>
          <p>{detail?.totalCandidatesHired ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Candidates Rejected</h3>
          <p>{detail?.totalCandidatesRejected ?? '-'}</p>
        </div>

      </div>

      <label>Drive</label>
      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Drives</h3>
          <p>{detail?.totalDrives ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Ongoing Drives</h3>
          <p>{detail?.ongoingDrives ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Halted Drives</h3>
          <p>{detail?.haltedDrives ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Completed Drives</h3>
          <p>{detail?.completedDrives ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Canceled Drives</h3>
          <p>{detail?.cancelledDrives ?? '-'}</p>
        </div>

      </div>

      <label>Interview</label>
      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Interviews</h3>
          <p>{detail?.totalInterviews ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Interviews Scheduled</h3>
          <p>{detail?.interviewsScheduled ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Interviews Ongoing</h3>
          <p>{detail?.interviewsOnProcess ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Interviews Completed</h3>
          <p>{detail?.interviewsCompleted ?? '-'}</p>
        </div>

        <div className="card">
          <h3>Interviews Skipped</h3>
          <p>{detail?.interviewsSkipped ?? '-'}</p>
        </div>

      </div>
    </div>
  )
}
