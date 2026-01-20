import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});



// Use these exact names for exports
export const getAllManagers = () => axios.get(`${API_URL}/managers`, getAuthHeaders()).then(r => r.data);
export const createManager = (data: any) => axios.post(`${API_URL}/create-manager`, data, getAuthHeaders()).then(r => r.data);
export const updateManager = (id: string, data: any) => axios.put(`${API_URL}/manager/${id}`, data, getAuthHeaders()).then(r => r.data);
export const deleteManager = (id: string) => axios.delete(`${API_URL}/manager/${id}`, getAuthHeaders()).then(r => r.data);

// --- BUILDING APIS ---
export const getAllBuildings = () => axios.get(`${API_URL}/buildings`, getAuthHeaders()).then(r => r.data);
export const createBuilding = (data: any) => axios.post(`${API_URL}/create-building`, data, getAuthHeaders()).then(r => r.data);
export const updateBuilding = (id: string, data: any) => axios.put(`${API_URL}/building/${id}`, data, getAuthHeaders()).then(r => r.data);
export const deleteBuilding = (id: string) => axios.delete(`${API_URL}/building/${id}`, getAuthHeaders()).then(r => r.data);