import { fetchWithAuth } from "./client";
import { API_URL } from "../config";
export async function addPost(newPost = {}) {
  return fetchWithAuth(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  });
}

export async function getPosts() {
  return fetchWithAuth(`${API_URL}/posts`, {
    method: "GET",
  });
}