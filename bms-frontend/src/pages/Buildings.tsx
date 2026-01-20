import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/admin.api";
import { toast } from "sonner";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MapPinIcon, 
  UserCircleIcon,
  ShieldCheckIcon 
} from "@heroicons/react/24/outline";
import { AdminModal } from "@/components/AdminModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export function ManageBuildings() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Full form fields
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
    } catch (err) {
      toast.error("Failed to fetch data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateBuilding(editingId, formData);
        toast.success("Building updated");
      } else {
        await api.createBuilding(formData);
        toast.success("Building created");
      }
      closeModal();
      loadData();
    } catch (err: any) { 
        toast.error(err.response?.data?.message || "Error saving building"); 
    }
  };

  const closeModal = () => {
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

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#1E3A4C]">Building Directory</h1>
            <p className="text-sm text-gray-500">Manage all properties and assigned personnel</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1E3A4C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            <PlusIcon className="h-5 w-5" /> Add New Building
          </button>
        </div>

        {/* Updated Table with all fields */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-bold border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-[#1E3A4C]">Building Details</th>
                <th className="px-8 py-4">Location</th>
                <th className="px-8 py-4">Assigned Manager</th>
                <th className="px-8 py-4">Policy</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {buildings.map((b) => (
                <tr key={b._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-800">{b.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-medium">ID: {b._id.slice(-6)}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPinIcon className="h-4 w-4 text-gray-300" />
                      {b.location}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {b.manager?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-700">{b.manager?.name || "Unassigned"}</div>
                        <div className="text-[10px] text-gray-400">{b.manager?.email || "No email"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      b.approvalPolicy === 'MANAGER_ONLY' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <ShieldCheckIcon className="h-3 w-3" />
                      {b.approvalPolicy.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center flex justify-center gap-3">
                    <button onClick={() => handleEdit(b)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => { setDeletingId(b._id); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CRUD Modal */}
        <AdminModal title={editingId ? "Update Property" : "Add Property"} isOpen={isModalOpen} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Building Name</label>
              <input required className="w-full mt-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Location Address</label>
              <input required className="w-full mt-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" value={formData.location} onChange={(e)=>setFormData({...formData, location:e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Manager</label>
                <select required className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white" value={formData.managerId} onChange={(e)=>setFormData({...formData, managerId:e.target.value})}>
                  <option value="">Select...</option>
                  {managers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Policy</label>
                <select className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white" value={formData.approvalPolicy} onChange={(e)=>setFormData({...formData, approvalPolicy:e.target.value})}>
                  <option value="MANAGER_ONLY">Manager Only</option>
                  <option value="MANAGER_AND_SUB">Manager & Sub</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-[#1E3A4C] text-white py-4 rounded-xl font-bold mt-4 shadow-lg active:scale-95 transition-all">
              {editingId ? "Update Property" : "Save Property"}
            </button>
          </form>
        </AdminModal>

        {/* Delete Modal */}
        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={async () => {
            if (deletingId) {
                await api.deleteBuilding(deletingId);
                toast.success("Property removed");
                setIsDeleteModalOpen(false);
                loadData();
            }
          }}
          itemName="this Building"
        />
      </main>
    </div>
  );
}