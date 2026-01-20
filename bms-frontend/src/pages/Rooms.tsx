import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/manager.api";
import { toast } from "sonner";
import { PlusIcon, PencilIcon, TrashIcon, KeyIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AdminModal } from "@/components/AdminModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export function ManageRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ roomNumber: "", type: "OFFICE", floorId: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Halkan waxaan u gudbinaynaa `false` si aan u helno dhammaan qolalka
      const [rRes, fRes] = await Promise.all([api.getRooms(false), api.getFloors()]);
      setRooms(Array.isArray(rRes) ? rRes : []);
      setFloors(Array.isArray(fRes) ? fRes : []);
    } catch (err) {
      toast.error("Failed to load room data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      editingId ? await api.updateRoom(editingId, formData) : await api.addRoom(formData);
      toast.success(editingId ? "Room updated" : "Room added");
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving room");
    }
  };

  const filteredRooms = rooms.filter(r => 
    r.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.floor?.building?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("tenants", loadData)
  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-[#1E3A4C]">Room Inventory</h1>
          <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="bg-[#1E3A4C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2">
            <PlusIcon className="h-5 w-5" /> Add Room
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black border-b">
              <tr>
                <th className="px-8 py-4">Room</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Location</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-10 text-center">Loading...</td></tr>
              ) : filteredRooms.map((r) => (
                <tr key={r._id} className="hover:bg-blue-50/40">
                  <td className="px-8 py-5 font-black text-[#1E3A4C]">{r.roomNumber}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${r.isOccupied ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {r.isOccupied ? "Occupied" : "Available"}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm">Level {r.floor?.floorNumber} ({r.floor?.building?.name})</td>
                  <td className="px-8 py-5 flex justify-center gap-2">
                    <button onClick={() => { setEditingId(r._id); setFormData({roomNumber: r.roomNumber, type: r.type, floorId: r.floor?._id}); setIsModalOpen(true); }} className="text-blue-500"><PencilIcon className="h-5 w-5" /></button>
                    <button onClick={() => { setDeletingId(r._id); setIsDeleteModalOpen(true); }} className="text-red-500"><TrashIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminModal title={editingId ? "Edit Room" : "Add Room"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Room Number" className="w-full p-3 border rounded-xl" value={formData.roomNumber} onChange={(e)=>setFormData({...formData, roomNumber: e.target.value})} />
            <select className="w-full p-3 border rounded-xl" value={formData.floorId} onChange={(e)=>setFormData({...formData, floorId: e.target.value})}>
              <option value="">Select Floor</option>
              {floors.map(f => <option key={f._id} value={f._id}>Level {f.floorNumber} - {f.building?.name}</option>)}
            </select>
            <button className="w-full bg-[#1E3A4C] text-white py-4 rounded-xl font-bold">Save Room</button>
          </form>
        </AdminModal>

        <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={async () => { await api.deleteRoom(deletingId!); setIsDeleteModalOpen(false); loadData(); }} itemName="room" />
      </main>
    </div>
  );
}