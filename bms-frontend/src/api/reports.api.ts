import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get Token from local storage
const getHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getManagerReport = async () => {
  const response = await axios.get(`${API_URL}/reports/manager`, getHeader());
  return response.data;
};