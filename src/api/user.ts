import { fetchWithAuth } from "./client";
import { API_URL } from "../config";
import { User } from "../types/User";

export async function fetchUser(username: string) {
  return fetchWithAuth(`${API_URL}/users/${username}`, {
    method: "GET",
  });
}

export async function fetchUserPosts(username: string) {
  return fetchWithAuth(`${API_URL}/posts/${username}`, {
    method: "GET",
  });
}

export async function updateUser(user: User) {
   return fetchWithAuth(`${API_URL}/users/${user.id}`, {
    method: "PUT",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });
}

export async function updateProfileImage(data: FormData) {
  return fetchWithAuth(`${API_URL}/upload/image/profile`,{
    method:"POST",
    body:data
  });
}

export async function updateBannerImage(data: FormData) {
  return fetchWithAuth(`${API_URL}/upload/image/banner`,{
    method:"POST",
    body:data
  });
}
