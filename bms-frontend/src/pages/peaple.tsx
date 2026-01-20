import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/manager.api";
import { toast } from "sonner";
import { UserPlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AdminModal } from "@/components/AdminModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export function ManagePeople() {
  const [people, setPeople] = useState<any[]>([]);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", type: "TENANT", roomId: "" });

  useEffect(() => { 
    loadData(); 
    loadAvailableRooms();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getPeople();
      setPeople(data);
    } catch (err) { toast.error("Failed to load people"); }
  };

  const loadAvailableRooms = async () => {
    try {
      // Halkan waxaa loo dirayaa `true` si dropdown-ka uu u muujiyo qolalka banaan oo qura
      const rooms = await api.getRooms(true); 
      setAvailableRooms(rooms);
    } catch (err) { console.error("Error loading vacant rooms"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type !== "STAFF" && !formData.roomId) return toast.error("Please select a room");

    try {
      editingId ? await api.updatePerson(editingId, formData) : await api.assignPerson(formData);
      toast.success("Assignment saved");
      setIsModalOpen(false);
      loadData();
      loadAvailableRooms(); // Refresh dropdown
    } catch (err: any) { toast.error("Error saving data"); }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-[#1E3A4C]">People Assignments</h1>
          <button onClick={() => { setEditingId(null); setFormData({name:"", phone:"", type:"TENANT", roomId:""}); setIsModalOpen(true); }} className="bg-[#1E3A4C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2">
            <UserPlusIcon className="h-5 w-5" /> Add Person
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black border-b">
              <tr>
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4">Room</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {people.map((p) => (
                <tr key={p._id} className="hover:bg-blue-50/30">
                  <td className="px-8 py-5">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.phone}</div>
                  </td>
                  <td className="px-8 py-5 text-[10px] font-black">{p.type}</td>
                  <td className="px-8 py-5 text-sm">{p.room ? `Room ${p.room.roomNumber}` : "No Room"}</td>
                  <td className="px-8 py-5 flex justify-center gap-3">
                    <button onClick={() => { setEditingId(p._id); setFormData({name:p.name, phone:p.phone, type:p.type, roomId:p.room?._id}); setIsModalOpen(true); }} className="text-blue-500"><PencilIcon className="h-5 w-5" /></button>
                    <button onClick={() => { setDeletingId(p._id); setIsDeleteModalOpen(true); }} className="text-red-500"><TrashIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminModal title={editingId ? "Edit Person" : "New Person"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Name" className="w-full p-3 border rounded-xl" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />
            <input placeholder="Phone" className="w-full p-3 border rounded-xl" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} />
            <select className="w-full p-3 border rounded-xl" value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})}>
              <option value="TENANT">Tenant</option>
              <option value="STAFF">Staff (No room required)</option>
            </select>
            
            {formData.type !== "STAFF" && (
              <select className="w-full p-3 border rounded-xl" value={formData.roomId} onChange={(e)=>setFormData({...formData, roomId: e.target.value})}>
                <option value="">Select Available Room</option>
                {availableRooms.map(r => <option key={r._id} value={r._id}>Room {r.roomNumber}</option>)}
              </select>
            )}
            <button className="w-full bg-[#1E3A4C] text-white py-4 rounded-xl font-bold">Confirm</button>
          </form>
        </AdminModal>

        <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={async () => { await api.deletePerson(deletingId!); setIsDeleteModalOpen(false); loadData(); loadAvailableRooms(); }} itemName="person" />
      </main>
    </div>
  );
}