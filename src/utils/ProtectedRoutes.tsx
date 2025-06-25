import {Outlet, Navigate } from "react-router-dom";
import { useAuthChecked } from "../hooks/useAuthChecked";

type ProtectedRouteProps = {
  redirect: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({redirect}) => {
  const {authChecked, isLoggedIn, isVerified, email} = useAuthChecked();
  if (!authChecked) return <div>loading...</div>;

  if (!isLoggedIn) {
    return <Navigate to={redirect} />;
  }

  if (!isVerified) {
    return <Navigate to="/verify-email" state={{email}}/>;
  }

  return <Outlet />;
};

export default ProtectedRoute;