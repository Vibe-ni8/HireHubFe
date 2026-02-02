import { Outlet } from "react-router-dom"
import AdminNavbar from "./AdminNavbar"
import "./admin.css"
import AdminHeader from "./AdminHeader"

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-content">
        <AdminHeader />
        <Outlet />
      </main>
    </div>
  )
}
