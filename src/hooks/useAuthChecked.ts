import { useEffect, useState, useCallback, useRef} from "react";

const apiURL = process.env.REACT_APP_API_URL;

export function useAuthChecked() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email , setEmail] = useState<string>('');
  const didRun = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${apiURL}/api/auth/validate-token`, { credentials: "include" });
      const result = await res.json();
      if (result.status === 200) {
        setIsVerified(result.isVerified);
        setEmail(result.email);
        setIsLoggedIn(true);
      } else if (result.status === 401) {
        const response = await fetch(`${apiURL}/api/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include'
        });
        const refreshResult = await response.json();
        if (refreshResult.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
  if (didRun.current) return;
    didRun.current = true;
    checkAuth();
  }, [checkAuth]);

  return { authChecked, isLoggedIn, isVerified, email};
}