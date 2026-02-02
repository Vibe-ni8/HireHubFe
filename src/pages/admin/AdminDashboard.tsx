import { useEffect, useState } from "react";
import type { AdminDashboardDetails, BaseResponse } from "../../dto/Response";
import type { AxiosError } from "axios";
import { HandleApiErrors, HandleApiResponse } from "../../helper/HelperMethods";
import { getAdminDashboardDetails } from "../../services/Auth.service";

export default function AdminDashboard() {

  const [detail, setDetail] = useState<AdminDashboardDetails | null>(null);
  
    useEffect(() => {
      getAdminDashboardDetails()
        .then((response) => {
          const result = HandleApiResponse(response);
          setDetail(result.data ?? null)
        })
        .catch((err: AxiosError<BaseResponse>) => {
          HandleApiErrors(err);
        });
    }, []);

  return (
    <>
      {/* {!detail && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )} */}

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Users</h3>
          <p>{detail?.totalUsers}</p>
        </div>

        <div className="card">
          <h3>Active Users</h3>
          <p>set</p>
        </div>
        <div className="card">
          <h3>Inactive Users</h3>
          <p>set</p>
        </div>

        <div className="card">
          <h3>Candidates</h3>
          <p>{detail?.totalCandidates}</p>
        </div>

        <div className="card">
          <h3>Panel Members</h3>
          <p>{detail?.totalPanelMembers}</p>
        </div>

        <div className="card">
          <h3>Mentors</h3>
          <p>{detail?.totalMentors}</p>
        </div>

        <div className="card">
          <h3>Human Resources</h3>
          <p>{detail?.totalHrs}</p>
        </div>

        <div className="card">
          <h3>Total Interviews</h3>
          <p>{detail?.totalInterviews}</p>
        </div>

        <div className="card">
          <h3>Interviews Scheduled</h3>
          <p>{detail?.interviewsScheduled}</p>
        </div>

        <div className="card">
          <h3>Interviews Ongoing</h3>
          <p>{detail?.interviewsOnProcess}</p>
        </div>

        <div className="card">
          <h3>Interviews Completed</h3>
          <p>{detail?.interviewsCompleted}</p>
        </div>

        <div className="card">
          <h3>Interviews Skipped</h3>
          <p>{detail?.interviewsSkipped}</p>
        </div>

        <div className="card">
          <h3>Candidates Hired</h3>
          <p>{detail?.totalCandidatesHired}</p>
        </div>

        <div className="card">
          <h3>Candidates Rejected</h3>
          <p>{detail?.totalCandidatesRejected}</p>
        </div>

      </div>
    </>
  )
}
