// src/api/managerApi.ts
import axios from "axios";

export interface Manager {
  _id: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  email: string;
}

export const getManagers = async (): Promise<Manager[]> => {
  const response = await axios.get("/api/users?role=manager");
  return response.data;
};
