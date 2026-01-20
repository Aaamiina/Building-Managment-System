import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/manager.api";
import { toast } from "sonner";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AdminModal } from "@/components/AdminModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export function SubManageRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ roomNumber: "", type: "SINGLE", floorId: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [r, f] = await Promise.all([api.getRooms(), api.getFloors()]);
      setRooms(r || []);
      setFloors(f || []);
    } catch (err) { toast.error("Error loading building data"); }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        const res = await api.updateRoom(editingRoom._id, formData);
        if (res.isPending) toast.info("Codsiga beddelka qolka waa la diray");
      } else {
        await api.addRoom(formData);
        toast.success("Qolka si toos ah ayaa loo daray");
      }
      setIsModalOpen(false);
      setEditingRoom(null);
      setFormData({ roomNumber: "", type: "SINGLE", floorId: "" });
      loadData();
    } catch (err) { toast.error("Action failed"); }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-[#1E3A4C]">Unit Inventory</h1>
          <button onClick={() => {setEditingRoom(null); setIsModalOpen(true);}} className="bg-[#1E3A4C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg">
            <PlusIcon className="h-5 w-5" /> Add Room Direct
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div key={room._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="p-4 bg-gray-50 text-[#1E3A4C] rounded-2xl font-black text-xl">{room.roomNumber}</div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingRoom(room); setFormData({roomNumber: room.roomNumber, type: room.type, floorId: room.floor?._id}); setIsModalOpen(true); }} 
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><PencilSquareIcon className="h-4 w-4" /></button>
                  <button onClick={() => { setDeletingId(room._id); setIsDeleteModalOpen(true); }} 
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><TrashIcon className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level {room.floor?.floorNumber || 'N/A'}</p>
                <p className="text-sm font-bold text-[#1E3A4C]">{room.type}</p>
                <div className={`text-[10px] font-bold inline-block px-2 py-0.5 rounded ${room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {room.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        <AdminModal title={editingRoom ? "Request Room Edit" : "Create New Room (Direct)"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleAction} className="space-y-4">
            <input className="w-full p-4 rounded-xl border-2 border-gray-50 font-bold" placeholder="Room Number (e.g. 101)" value={formData.roomNumber} onChange={(e)=>setFormData({...formData, roomNumber: e.target.value})} required />
            <select className="w-full p-4 rounded-xl border-2 border-gray-50 font-bold" value={formData.floorId} onChange={(e)=>setFormData({...formData, floorId: e.target.value})} required>
              <option value="">Select Building Level</option>
              {floors.map(f => <option key={f._id} value={f._id}>Floor {f.floorNumber}</option>)}
            </select>
            <select className="w-full p-4 rounded-xl border-2 border-gray-50 font-bold" value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})}>
              <option value="SINGLE">Single Room</option>
              <option value="DOUBLE">Double Room</option>
              <option value="STUDIO">Studio Apartment</option>
            </select>
            <button className="w-full bg-[#1E3A4C] text-white py-4 rounded-xl font-bold uppercase tracking-widest">
              {editingRoom ? "Send Request to Manager" : "Create Room Directly"}
            </button>
          </form>
        </AdminModal>

        <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={async () => {
            const res = await api.deleteRoom(deletingId!);
            if (res.isPending) toast.warning("Codsiga tirtirista waa loo diray Manager-ka");
            setIsDeleteModalOpen(false);
            loadData();
          }} itemName="this room unit (Pending Approval)" 
        />
      </main>
    </div>
  );
}