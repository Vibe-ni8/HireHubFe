import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"
import type { ReactNode } from "react"


export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {

  const { isAuthenticated, getRole } = useAuth();

  if (!isAuthenticated)
    return <Navigate to="/login" replace />;

  if (roles && !roles.includes(getRole()!)) {
    return <Navigate to="/unauthorized" replace />
  }

  return (
    <>
      {children}
      <Outlet />
    </>
  );
  
}

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[] | null;
}
