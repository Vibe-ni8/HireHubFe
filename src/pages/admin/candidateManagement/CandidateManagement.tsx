import { Outlet } from "react-router-dom";
import './CandidateManagement.css';

export default function CandidateManagement() {
  return (
    <div className="candidate-management">
      <Outlet/>
    </div>
  )
}