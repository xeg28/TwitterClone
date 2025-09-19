import { API_URL } from "../config";
export async function fetchWithAuth(url: string, options = {}) {
  let response = await fetch(url, {
    ...options,
    credentials: "include", // send cookies
  });

  if (response.status === 401) {
    // try refresh
    const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      // retry original request
      response = await fetch(url, {
        ...options,
        credentials: "include",
      });
    }
  }

  return response;
}