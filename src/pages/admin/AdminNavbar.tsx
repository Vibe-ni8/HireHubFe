import { NavLink } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext";

export default function AdminNavbar() {

  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  }

  return (
    <nav className="admin-navbar">
      <h2>HireHub</h2>
      <ul>
        <li>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/admin/user/management">User</NavLink>
        </li>
        <li>
          <NavLink to="/admin/candidate">Candidate</NavLink>
        </li>
        <li>
          <NavLink to="/admin/drive">Drive</NavLink>
        </li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}
