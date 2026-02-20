import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export function setApiAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}

function unwrap(response) {
  return response?.data?.data ?? [];
}

export async function getContent(collection, params = {}) {
  const response = await apiClient.get(`/content/${collection}`, { params });
  return { data: unwrap(response), meta: response.data };
}

export async function createContent(collection, payload) {
  const response = await apiClient.post(`/admin/${collection}`, payload);
  return response.data.data;
}

export async function updateContent(collection, id, payload) {
  const response = await apiClient.put(`/admin/${collection}/${id}`, payload);
  return response.data.data;
}

export async function patchContent(collection, id, payload) {
  const response = await apiClient.patch(`/admin/${collection}/${id}`, payload);
  return response.data.data;
}

export async function deleteContent(collection, id) {
  const response = await apiClient.delete(`/admin/${collection}/${id}`);
  return response.data;
}

export async function getLiveNews(params = {}) {
  const response = await apiClient.get("/live/news", { params });
  return { data: unwrap(response), meta: response.data };
}

export async function getLiveEvents(params = {}) {
  const response = await apiClient.get("/live/events", { params });
  return { data: unwrap(response), meta: response.data };
}

export async function getLiveDealers(params = {}) {
  const response = await apiClient.get("/live/dealers", { params });
  return { data: unwrap(response), meta: response.data };
}

export async function getDashboardSummary() {
  const response = await apiClient.get("/dashboard/summary");
  return response.data.data;
}

export async function getPricingCities() {
  const response = await apiClient.get("/pricing/cities");
  return { data: unwrap(response), meta: response.data };
}

export async function getOnRoadQuote(payload) {
  const response = await apiClient.post("/pricing/on-road", payload);
  return response.data.data;
}

export async function getOwnershipQuote(payload) {
  const response = await apiClient.post("/pricing/ownership", payload);
  return response.data.data;
}

export async function loginUser(payload) {
  const response = await apiClient.post("/auth/login", payload);
  return response.data.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me");
  return response.data.data;
}

export async function logoutUser() {
  const response = await apiClient.post("/auth/logout");
  return response.data;
}

export async function getUserCloudState() {
  const response = await apiClient.get("/user/state");
  return response.data.data;
}

export async function updateUserCloudState(payload) {
  const response = await apiClient.put("/user/state", payload);
  return response.data.data;
}

export async function mergeUserCloudState(payload) {
  const response = await apiClient.post("/user/state/merge", payload);
  return response.data.data;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
