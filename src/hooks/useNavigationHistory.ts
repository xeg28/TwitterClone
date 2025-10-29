import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pushVisited } from "../utils/NavigationHistory";

export const useNavigationHistory = () => {
  const location = useLocation();
  useEffect(() => {
    const url = location.pathname + location.search;
    pushVisited(url);
  }, [location]);
};