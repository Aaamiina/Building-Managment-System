import axios from 'axios';

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  buildingId?: string;
  managerId?: string;
  role: string;
  isActive: boolean;
}

export interface User {
  _id: string;
  email?: string;
  profile?: UserProfile;
}

export interface Building {
  _id: string;
  name: string;
}

export const api = {
  getCurrentUser: async (): Promise<User> => {
    const res = await axios.get<User>('/api/users/me');
    return res.data;
  },

  getUsers: async (role?: string): Promise<User[]> => {
    const res = await axios.get<User[]>('/api/users', { params: role ? { role } : {} });
    return res.data;
  },

  createUserProfile: async (data: Partial<UserProfile> & { userId: string }) => {
    const res = await axios.post<UserProfile>('/api/users/profile', data);
    return res.data;
  },

  updateUserProfile: async (profileId: string, data: Partial<UserProfile>) => {
    const res = await axios.put<UserProfile>(`/api/users/profile/${profileId}`, data);
    return res.data;
  },

  getBuildings: async (): Promise<Building[]> => {
    const res = await axios.get<Building[]>('/api/buildings');
    return res.data;
  },
};
