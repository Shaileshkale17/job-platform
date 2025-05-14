import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "../store";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && currentUser) {
      setCurrentUser(null);
    }
  }, [currentUser, setCurrentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
