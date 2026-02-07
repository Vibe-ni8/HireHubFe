import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import './index.css'
import './App.css'
import Home from "./pages/Home"
import Login from "./pages/Login"
import ProtectedRoute from "./auth/ProtectedRoute"
import UserManagement from "./pages/admin/userManagement/UserManagement"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import { ToastContainer } from "react-toastify"
import CurrentUserProfile from "./pages/current/CurrentUserProfile"
import Users from "./pages/admin/userManagement/Users"
import UserDetail from "./pages/admin/userManagement/UserDetail"
import AddUser from "./pages/admin/userManagement/AddUser"
import Candidates from "./pages/admin/candidateManagement/Candidates"
import CandidateDetail from "./pages/admin/candidateManagement/CandidateDetail"
import AddCandidate from "./pages/admin/candidateManagement/AddCandidate"
import CandidateManagement from "./pages/admin/candidateManagement/CandidateManagement"
import DriveManagement from "./pages/admin/driveManagement/driveManagement"
import Drives from "./pages/admin/driveManagement/Drives"

export default function App() {
  return (
      <>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
              
          {/* Admin */}
          <Route element={<ProtectedRoute roles={["Admin"]} children={undefined} />}>
            <Route path="/admin" element={<AdminLayout />}>

              <Route path="" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />

              <Route path="my" element={<Outlet/>} >
                <Route path="" element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<CurrentUserProfile />} />
              </Route>

              <Route path="user" element={<UserManagement />} >
                <Route path="" element={<Navigate to="management" replace />} />
                <Route path="management" element={<Users/>} />
                <Route path="detail/:id" element={<UserDetail/>} />
                <Route path="add" element={<AddUser/>} />
              </Route>

              <Route path="candidate" element={<CandidateManagement />} >
                <Route path="" element={<Navigate to="management" replace />} />
                <Route path="management" element={<Candidates/>} />
                <Route path="detail/:id" element={<CandidateDetail/>} />
                <Route path="add" element={<AddCandidate/>} />
              </Route>

              <Route path="drive" element={<DriveManagement />} >
                <Route path="" element={<Navigate to="management" replace />} />
                <Route path="management" element={<Drives/>} />
              </Route>
              
            </Route>
          </Route>

          {/* HR */}
          {/* <Route element={<ProtectedRoute roles={["HR"]} children={undefined} />}>
            <Route path="/hr" element={<HRLayout />}>
              <Route index element={<HRDashboard />} />
              <Route path="drives" element={<DriveList />} />
              <Route path="drives/create" element={<CreateDrive />} />
              <Route path="drives/:id" element={<DriveDetails />} />
            </Route>
          </Route> */}

        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
          newestOnTop closeOnClick pauseOnHover theme="colored"
        />
      </>
  );
}
