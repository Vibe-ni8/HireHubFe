import { Outlet } from "react-router-dom";
import './UserManagement.css';

export default function UserManagement() {
  return (
    <div className="user-management">
      <Outlet/>
    </div>
  )
}
