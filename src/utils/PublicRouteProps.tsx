import { Outlet, Navigate } from "react-router-dom";
import { useAuthChecked } from "../hooks/useAuthChecked";

type PublicRouteProps = {
  redirect: string;
};

const PublicRoute: React.FC<PublicRouteProps> = ({ redirect }) => {
  const { authChecked, isLoggedIn } = useAuthChecked();
  if (!authChecked) return <div>loading...</div>;
  return !isLoggedIn ? <Outlet /> : <Navigate to={redirect} />;
};

export default PublicRoute;