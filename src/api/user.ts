import { fetchWithAuth } from "./client";
import { API_URL } from "../config";

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