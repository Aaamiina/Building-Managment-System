import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/manager.api";
import { toast } from "sonner";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AdminModal } from "@/components/AdminModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export function SubManageFloors() {
  const [floors, setFloors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ floorNumber: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await api.getFloors();
      setFloors(data || []);
    } catch (err) { toast.error("Error loading floors"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { floorNumber: parseInt(formData.floorNumber) };
      if (editingId) {
        const res = await api.updateFloor(editingId, payload);
        if (res.isPending) toast.info("Codsiga beddelka waa la diray");
      } else {
        await api.addFloor(payload);
        toast.success("Dabaq si toos ah ayaa loo daray");
      }
      closeModal();
      loadData();
    } catch (err) { toast.error("Hawlgalku ma guulaysan"); }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ floorNumber: "" });
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-[#1E3A4C]">Floor Management</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#1E3A4C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg">
            <PlusIcon className="h-5 w-5" /> Add Floor Direct
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y divide-gray-50">
              {floors.map((f) => (
                <tr key={f._id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#1E3A4C] text-white rounded-lg font-black">{f.floorNumber}</div>
                      <span className="font-bold text-[#1E3A4C]">Level {f.floorNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(f._id); setFormData({floorNumber: f.floorNumber}); setIsModalOpen(true); }} 
                        className="text-blue-500 font-bold text-xs uppercase underline flex items-center gap-1">
                        <PencilSquareIcon className="h-4 w-4" /> Request Edit
                      </button>
                      <button onClick={() => { setDeletingId(f._id); setIsDeleteModalOpen(true); }} 
                        className="text-red-400 font-bold text-xs uppercase underline flex items-center gap-1">
                        <TrashIcon className="h-4 w-4" /> Request Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminModal title={editingId ? "Request Update" : "Add Floor (Direct)"} isOpen={isModalOpen} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="number" className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-[#1E3A4C] outline-none font-bold" 
              placeholder="Floor Number" value={formData.floorNumber} onChange={(e)=>setFormData({floorNumber: e.target.value})} required />
            <button className="w-full bg-[#1E3A4C] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-transform active:scale-95">
              {editingId ? "Submit Request to Manager" : "Save Floor Directly"}
            </button>
          </form>
        </AdminModal>

        <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={async () => {
            const res = await api.deleteFloor(deletingId!);
            if (res.isPending) toast.warning("Codsiga tirtirista waa la diray");
            setIsDeleteModalOpen(false);
            loadData();
          }} itemName={`Floor Level ${floors.find(f => f._id === deletingId)?.floorNumber} (Approval Required)`} 
        />
      </main>
    </div>
  );
}