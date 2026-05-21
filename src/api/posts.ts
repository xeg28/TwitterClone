import { fetchWithAuth } from "./client";
import { API_URL } from "../config";


export async function getPost(id:number | string) {
  return fetchWithAuth(`${API_URL}/posts/${id}`, {
    method: "GET", 
   headers: { "Content-Type": "application/json" }
  });
}

export async function addPost(newPost = {}) {
  return fetchWithAuth(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  });
}

export async function deletePost(id: string | number) {
  return fetchWithAuth(`${API_URL}/posts/${id}`, {
    method: "DELETE"
  })
}

export async function getPosts() {
  return fetchWithAuth(`${API_URL}/posts`, {
    method: "GET",
  });
}

export async function getUserPosts(username: string) {
  return fetchWithAuth(`${API_URL}/posts/user/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
}

export async function likePost(id: number | string) {
  return fetchWithAuth(`${API_URL}/posts/like/${id}`, {
    method: "POST",
  });
}

export async function unlikePost(id: number | string) {
  return fetchWithAuth(`${API_URL}/posts/like/${id}`, {
    method: "DELETE",
  });
}

export async function getUserLikedPost(username: string) {
  return fetchWithAuth(`${API_URL}/posts/likes/user/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
}


export async function getUserPostWithReplies(username: string) {
  return fetchWithAuth(`${API_URL}/posts/user/with_replies/${username}`, {
    method: "GET", 
    headers: { "Content-Type": "application/json" }
  })
}

export async function viewPost(postId: number) {
  return fetchWithAuth(`${API_URL}/posts/view/${postId}`, {
    method: "POST", 
  });
} 

export async function getPostReplies(postId: number) {
  return fetchWithAuth(`${API_URL}/posts/replies/${postId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
}
