import { NavLink } from "react-router-dom"

export default function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <h2>HireHub Admin</h2>
      <ul>
        <li>
          <NavLink to="/admin">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/admin/users">User Management</NavLink>
        </li>
      </ul>
    </nav>
  )
}
