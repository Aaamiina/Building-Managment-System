// src/api/api.ts
import axios from 'axios';

export interface Room {
  _id: string;
  buildingId: string;
  floorId: string;
  roomNumber: string;
  name: string;
  type: 'office' | 'apartment' | 'commercial' | 'storage';
  area: number;
  rent: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface Building {
  _id: string;
  name: string;
}

export interface Tenant {
  _id: string;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

export const api = {
  getRooms: async (floorId?: string): Promise<Room[]> => {
    const res = await axios.get<Room[]>('/api/rooms', {
      params: floorId ? { floorId } : {},
    });
    return res.data;
  },

  getBuildings: async (): Promise<Building[]> => {
    const res = await axios.get<Building[]>('/api/buildings');
    return res.data;
  },

  getTenants: async (): Promise<Tenant[]> => {
    const res = await axios.get<Tenant[]>('/api/users', {
      params: { role: 'tenant' },
    });
    return res.data;
  },

  createRoom: async (data: Partial<Room>) => {
    const res = await axios.post('/api/rooms', data);
    return res.data;
  },

  updateRoom: async (roomId: string, data: Partial<Room>) => {
    const res = await axios.put(`/api/rooms/${roomId}`, data);
    return res.data;
  },

  assignTenant: async (roomId: string, tenantId: string) => {
    const res = await axios.post(`/api/rooms/${roomId}/assign`, { tenantId });
    return res.data;
  },

  removeTenant: async (roomId: string) => {
    const res = await axios.post(`/api/rooms/${roomId}/remove`);
    return res.data;
  },
};
