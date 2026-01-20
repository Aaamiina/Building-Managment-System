import axios from "axios";

const API_URL = "http://localhost:5000/api/manager";

// --- AUTH HELPER ---
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// --- PROFILE & AUTH ---
export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/auth/me`, getAuthHeaders());
  return response.data;
};

export const updatePassword = async (passwords: any) => {
  return await axios.put(`${API_URL}/auth/update-password`, passwords, getAuthHeaders());
};

// --- SUB-MANAGER MANAGEMENT ---
export const getSubManagers = () => 
  axios.get(`${API_URL}/sub-managers`, getAuthHeaders()).then(res => res.data);

export const createSubManager = (data: any) => 
  axios.post(`${API_URL}/create-sub-manager`, data, getAuthHeaders()).then(res => res.data);

export const updateSubManager = (id: string, data: any) => 
  axios.patch(`${API_URL}/Update-sub-managers/${id}`, data, getAuthHeaders()).then(res => res.data);

export const deleteSubManager = (id: string) => 
  axios.delete(`${API_URL}/delete-sub-managers/${id}`, getAuthHeaders()).then(res => res.data);

// --- FLOOR OPERATIONS ---
export const getFloors = () => 
  axios.get(`${API_URL}/floors`, getAuthHeaders()).then(res => res.data);

export const addFloor = (data: any) => 
  axios.post(`${API_URL}/add-floor`, data, getAuthHeaders()).then(res => res.data);

export const updateFloor = (id: string, data: any) => 
  axios.patch(`${API_URL}/update-floor/${id}`, data, getAuthHeaders()).then(res => res.data);

export const deleteFloor = (id: string) => 
  axios.delete(`${API_URL}/delete-floor/${id}`, getAuthHeaders()).then(res => res.data);

// --- ROOM OPERATIONS ---
export const getRooms = async (availableOnly: boolean = false) => {
  const response = await axios.get(`${API_URL}/rooms`, {
    params: { availableOnly },
    ...getAuthHeaders() 
  });
  return response.data;
};

export const addRoom = (data: any) => 
  axios.post(`${API_URL}/add-room`, data, getAuthHeaders()).then(res => res.data);

export const updateRoom = (id: string, data: any) => 
  axios.patch(`${API_URL}/update-room/${id}`, data, getAuthHeaders()).then(res => res.data);

export const deleteRoom = (id: string) => 
  axios.delete(`${API_URL}/delete-room/${id}`, getAuthHeaders()).then(res => res.data);

// --- PERSON OPERATIONS ---
export const getPeople = () => 
  axios.get(`${API_URL}/people`, getAuthHeaders()).then(res => res.data);

export const assignPerson = (data: any) => 
  axios.post(`${API_URL}/assign-person`, data, getAuthHeaders()).then(res => res.data);

export const updatePerson = (id: string, data: any) => 
  axios.patch(`${API_URL}/update-person/${id}`, data, getAuthHeaders()).then(res => res.data);

export const deletePerson = (id: string) => 
  axios.delete(`${API_URL}/delete-person/${id}`, getAuthHeaders()).then(res => res.data);

// --- APPROVAL OPERATIONS ---
export const getPendingRequests = () => 
  axios.get(`${API_URL}/approvals/pending`, getAuthHeaders()).then(res => res.data);

export const reviewRequest = (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => 
  axios.patch(`${API_URL}/approvals/${id}`, { status, reason }, getAuthHeaders()).then(res => res.data);