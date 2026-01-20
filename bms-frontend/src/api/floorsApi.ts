// src/api/floorsApi.ts
import axios from "axios";

export interface Floor {
  _id: string;
  buildingId: string;
  floorNumber: number;
  name: string;
  totalRooms: number;
  description?: string;
  _creationTime: string;
}

export interface Building {
  _id: string;
  name: string;
}

export const getFloors = async (buildingId: string): Promise<Floor[]> => {
  const res = await axios.get(`/api/floors?buildingId=${buildingId}`);
  return res.data;
};

export const getBuildings = async (): Promise<Building[]> => {
  const res = await axios.get("/api/buildings");
  return res.data;
};

export const createFloor = async (data: {
  buildingId: string;
  floorNumber: number;
  name: string;
  totalRooms: number;
  description?: string;
}) => {
  const res = await axios.post("/api/floors", data);
  return res.data;
};

export const updateFloor = async (floorId: string, data: {
  floorNumber: number;
  name: string;
  totalRooms: number;
  description?: string;
}) => {
  const res = await axios.put(`/api/floors/${floorId}`, data);
  return res.data;
};
