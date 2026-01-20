import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/admin.api";
import { toast } from "sonner";
import { 
  PlusIcon, PencilIcon, TrashIcon, MapPinIcon, 
  ShieldCheckIcon, MagnifyingGlassIcon 
} from "@heroicons/react/24/outline";
import { AdminModal } from "@/components/AdminModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export function ManageBuildings() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // DEBUG: Track loading state
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    location: "", 
    managerId: "", 
    approvalPolicy: "MANAGER_ONLY" 
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [bRes, mRes] = await Promise.all([api.getAllBuildings(), api.getAllManagers()]);
      setBuildings(bRes);
      setManagers(mRes);
    } catch (err: any) {
      console.error("DEBUG: Load Data Error:", err);
      toast.error("Failed to sync with server");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button
    
    // DEBUG: Log the data being sent
    console.log("DEBUG: Sending FormData:", formData);

    try {
      if (editingId) {
        await api.updateBuilding(editingId, formData);
        toast.success("Building updated successfully");
      } else {
        const response = await api.createBuilding(formData);
        console.log("DEBUG: Server Response:", response);
        toast.success("New building registered");
      }
      closeMainModal();
      loadData();
    } catch (err: any) {
      // CRITICAL DEBUG: This shows the 500 error details in console
      console.error("DEBUG: API Error Object:", err);
      console.error("DEBUG: Server Message:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || "Internal Server Error (500)";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeMainModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", location: "", managerId: "", approvalPolicy: "MANAGER_ONLY" });
  };

  const handleEdit = (b: any) => {
    setEditingId(b._id);
    setFormData({ 
      name: b.name, 
      location: b.location, 
      managerId: b.manager?._id || "", 
      approvalPolicy: b.approvalPolicy 
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.deleteBuilding(deletingId);
      toast.success("Building removed");
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      loadData();
    } catch (err: any) {
      console.error("DEBUG: Delete Error:", err.response?.data || err);
      toast.error("Delete failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const filteredBuildings = buildings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#1E3A4C]">Manage Buildings</h1>
            <p className="text-sm text-gray-500">Overview of properties and staff</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { setEditingId(null); setIsModalOpen(true); }}
              className="bg-[#1E3A4C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#2a4d63] transition-all shadow-lg active:scale-95"
            >
              <PlusIcon className="h-5 w-5" /> Add Building
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-4">Building / ID</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBuildings.map((b) => (
                <tr key={b._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-700">{b.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">#{b._id.slice(-6).toUpperCase()}</div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(b)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => { setDeletingId(b._id); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Modal */}
        <AdminModal title={editingId ? "Update" : "Create"} isOpen={isModalOpen} onClose={closeMainModal}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input 
              required 
              placeholder="Name"
              className="w-full p-3 rounded-xl border" 
              value={formData.name} 
              onChange={(e)=>setFormData({...formData, name:e.target.value})} 
            />
            <input 
              required 
              placeholder="Location"
              className="w-full p-3 rounded-xl border" 
              value={formData.location} 
              onChange={(e)=>setFormData({...formData, location:e.target.value})} 
            />
            <select 
              required 
              className="w-full p-3 rounded-xl border bg-white" 
              value={formData.managerId} 
              onChange={(e)=>setFormData({...formData, managerId:e.target.value})}
            >
              <option value="">Choose Manager...</option>
              {managers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
            <button 
              disabled={isSubmitting}
              className="w-full bg-[#1E3A4C] text-white py-4 rounded-xl font-bold disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : editingId ? "Update Property" : "Save Property"}
            </button>
          </form>
        </AdminModal>

        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={confirmDelete}
          itemName="this Building"
        />
      </main>
    </div>
  );
}