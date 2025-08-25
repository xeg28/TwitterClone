import { Outlet, Navigate } from "react-router-dom";
import { useAuthChecked } from "../hooks/useAuthChecked";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

type PublicRouteProps = {
  redirect: string;
};

const PublicRoute: React.FC<PublicRouteProps> = ({ redirect }) => {
  const { authChecked, isLoggedIn } = useAuthChecked();
  if (!authChecked) return <LoadingScreen/>;
  return !isLoggedIn ? <Outlet /> : <Navigate to={redirect} />;
};

export default PublicRoute;