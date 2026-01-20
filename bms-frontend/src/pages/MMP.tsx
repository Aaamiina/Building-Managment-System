import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/admin.api";
import { toast } from "sonner";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AdminModal } from "../components/AdminModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal"; // Import the new modal

export function ManageManagers() {
  const [managers, setManagers] = useState<any[]>([]);
  
  // Modal Visibility States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Data States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      const data = await api.getAllManagers();
      setManagers(data);
    } catch (err) {
      toast.error("Failed to load managers");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateManager(editingId, formData);
        toast.success("Manager updated successfully");
      } else {
        await api.createManager(formData);
        toast.success("Manager created successfully");
      }
      closeModal();
      loadManagers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleEdit = (m: any) => {
    setEditingId(m._id);
    setFormData({ name: m.name, email: m.email, password: "" });
    setIsModalOpen(true);
  };

  // Trigger the custom delete modal
  const openDeleteModal = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.deleteManager(deletingId);
      toast.success("Manager deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      loadManagers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-[#1E3A4C]">Manage Managers</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1E3A4C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            <PlusIcon className="h-5 w-5" /> Add New Manager
          </button>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Email</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {managers.map((m) => (
                <tr key={m._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-gray-700">{m.name}</td>
                  <td className="px-8 py-5 text-gray-500">{m.email}</td>
                  <td className="px-8 py-5">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center flex justify-center gap-3">
                    <button onClick={() => handleEdit(m)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => openDeleteModal(m._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Update Modal */}
        <AdminModal 
          title={editingId ? "Update Manager" : "Create Manager"} 
          isOpen={isModalOpen} 
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
              <input 
                required 
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.name} 
                onChange={(e)=>setFormData({...formData, name:e.target.value})} 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
              <input 
                type="email" 
                required 
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.email} 
                onChange={(e)=>setFormData({...formData, email:e.target.value})} 
              />
            </div>
            {!editingId && (
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                <input 
                  type="password" 
                  required 
                  className="w-full mt-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                  value={formData.password} 
                  onChange={(e)=>setFormData({...formData, password:e.target.value})} 
                />
              </div>
            )}
            <button className="w-full bg-[#1E3A4C] text-white py-4 rounded-xl font-bold mt-4 shadow-lg active:scale-95 transition-all">
              {editingId ? "Update Changes" : "Save Manager Account"}
            </button>
          </form>
        </AdminModal>

        {/* Custom Delete Confirmation Modal */}
        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={confirmDelete}
          itemName="this manager"
        />
      </main>
    </div>
  );
}