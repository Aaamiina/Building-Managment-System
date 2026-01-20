import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const loginRequest = async (data: any) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
