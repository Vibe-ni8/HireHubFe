import { Outlet } from "react-router-dom"
import AdminNavbar from "./AdminNavbar"
import "./admin.css"

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
