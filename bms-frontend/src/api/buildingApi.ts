// src/api/buildingApi.ts
import axios from "axios";

export interface Building {
  _id: string;
  name: string;
  address: string;
  description?: string;
  totalFloors: number;
  status: "active" | "inactive";
}

export interface BuildingStats {
  totalFloors: number;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}

export const getBuildings = async (): Promise<Building[]> => {
  const response = await axios.get("/api/buildings");
  return response.data;
};

export const createBuilding = async (data: {
  name: string;
  address: string;
  description?: string;
  totalFloors: number;
  managerId: string;
}) => {
  const response = await axios.post("/api/buildings", data);
  return response.data;
};

export const getBuildingStats = async (buildingId: string): Promise<BuildingStats> => {
  const response = await axios.get(`/api/buildings/${buildingId}/stats`);
  return response.data;
};
