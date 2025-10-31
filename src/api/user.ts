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