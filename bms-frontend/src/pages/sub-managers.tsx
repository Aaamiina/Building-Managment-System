import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar"; // Ensure this sidebar has manager links
import * as managerApi from "../api/manager.api";
import { toast } from "sonner";
import { PlusIcon, PencilIcon, TrashIcon, UserGroupIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { AdminModal } from "@/components/AdminModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export function ManageTeam() {
  const [team, setTeam] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => { loadTeam(); }, []);

  const loadTeam = async () => {
    try {
      const data = await managerApi.getSubManagers();
      setTeam(data);
    } catch (err: any) {
      toast.error("Could not load your team members");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await managerApi.updateSubManager(editingId, formData);
        toast.success("Team member updated");
      } else {
        await managerApi.createSubManager(formData);
        toast.success("Sub-manager invited successfully");
      }
      closeModal();
      loadTeam();
    } catch (err: any) {
      // DEBUG: Detailed error logging for your 500 error investigation
      console.error("Submission Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleEdit = (member: any) => {
    setEditingId(member._id);
    setFormData({ name: member.name, email: member.email, password: "" });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await managerApi.deleteSubManager(deletingId);
      toast.success("Member removed from team");
      setIsDeleteModalOpen(false);
      loadTeam();
    } catch (err) {
      toast.error("Failed to delete member");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#1E3A4C]">My Team</h1>
            <p className="text-sm text-gray-500">Manage your assigned sub-managers and assistants</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1E3A4C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-opacity-90 shadow-lg transition-all active:scale-95"
          >
            <PlusIcon className="h-5 w-5" /> Add Team Member
          </button>
        </div>

        {/* Team Grid/Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-4">Name & Contact</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {team.map((member) => (
                <tr key={member._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-800">{member.name}</div>
                    <div className="text-xs text-gray-400 lowercase">{member.email}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase bg-blue-50 px-3 py-1 rounded-full w-fit">
                      <ShieldCheckIcon className="h-3 w-3" /> Sub-Manager
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(member)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => { setDeletingId(member._id); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {team.length === 0 && (
            <div className="p-20 text-center text-gray-400 italic">No sub-managers found. Add your first team member to get started.</div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <AdminModal title={editingId ? "Edit Member" : "New Sub-Manager"} isOpen={isModalOpen} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              required 
              placeholder="Full Name" 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.name} 
              onChange={(e)=>setFormData({...formData, name:e.target.value})} 
            />
            <input 
              required 
              type="email" 
              placeholder="Email Address" 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.email} 
              onChange={(e)=>setFormData({...formData, email:e.target.value})} 
            />
            {!editingId && (
              <input 
                required 
                type="password" 
                placeholder="Temporary Password" 
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                value={formData.password} 
                onChange={(e)=>setFormData({...formData, password:e.target.value})} 
              />
            )}
            <button className="w-full bg-[#1E3A4C] text-white py-4 rounded-xl font-bold shadow-lg mt-4">
              {editingId ? "Update Member" : "Create Account"}
            </button>
          </form>
        </AdminModal>

        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={confirmDelete}
          itemName="this sub-manager"
        />
      </main>
    </div>
  );
}