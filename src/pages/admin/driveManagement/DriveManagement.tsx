import { Outlet } from "react-router-dom";
import './DriveManagement.css';

export default function DriveManagement() {
  return (
    <div className="drive-management">
      <Outlet/>
    </div>
  )
}
