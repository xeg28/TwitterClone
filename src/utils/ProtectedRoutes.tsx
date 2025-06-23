import {Outlet, Navigate } from "react-router-dom";
import { useAuthChecked } from "../hooks/useAuthChecked";

type ProtectedRouteProps = {
  redirect: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({redirect}) => {
  const {authChecked, isLoggedIn, checkAuth} = useAuthChecked();
  if(!authChecked) return (<div>loading...</div>)
  return isLoggedIn ? <Outlet/> : <Navigate to={redirect} />;
};

export default ProtectedRoute;