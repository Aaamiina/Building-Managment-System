import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/manager.api";
import { toast } from "sonner";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  Squares2X2Icon,
  BuildingOfficeIcon 
} from "@heroicons/react/24/outline";
import { AdminModal } from "@/components/AdminModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export function ManageFloors() {
  const [floors, setFloors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Data States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    floorNumber: "" // Matches backend destructuring { floorNumber }
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getFloors();
      setFloors(data);
    } catch (err: any) {
      toast.error("Failed to sync floor data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert string input to Number to prevent backend validation crashes
    const payload = {
      floorNumber: parseInt(formData.floorNumber, 10)
    };

    if (isNaN(payload.floorNumber)) {
      return toast.error("Please enter a valid numeric floor number");
    }

    try {
      if (editingId) {
        // PATCH /update-floor/:floorId
        await api.updateFloor(editingId, payload);
        toast.success("Floor updated successfully");
      } else {
        // POST /add-floor
        // Note: building ID is handled by backend getBuildingForUser(req.user)
        await api.addFloor(payload);
        toast.success("New floor added to building");
      }
      closeModal();
      loadData();
    } catch (err: any) {
      console.error("Floor API Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Internal Server Error (500)");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ floorNumber: "" });
  };

  const handleEdit = (f: any) => {
    setEditingId(f._id);
    setFormData({ floorNumber: f.floorNumber.toString() });
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#1E3A4C]">Floor Management</h1>
            <p className="text-sm text-gray-500">Manage levels within your assigned building</p>
          </div>
          
          <button 
            onClick={() => { setEditingId(null); setIsModalOpen(true); }}
            className="bg-[#1E3A4C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#2a4d63] transition-all shadow-lg active:scale-95"
          >
            <PlusIcon className="h-5 w-5" /> Add Floor
          </button>
        </div>

        {/* Floor List Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-4">Floor Level</th>
                <th className="px-8 py-4">Associated Building</th>
                <th className="px-8 py-4">Internal ID</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-gray-400 animate-pulse">Loading floors...</td></tr>
              ) : floors.map((f) => (
                <tr key={f._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-[#1E3A4C] font-black">
                        {f.floorNumber}
                      </div>
                      <span className="font-bold text-gray-700 uppercase text-xs tracking-tight">Level {f.floorNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <BuildingOfficeIcon className="h-4 w-4" />
                      {f.building?.name || "Assigned Building"}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-[10px] text-gray-400">#{f._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(f)}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => { setDeletingId(f._id); setIsDeleteModalOpen(true); }}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && floors.length === 0 && (
            <div className="p-20 text-center text-gray-300 italic font-medium">
              No floors registered for this building yet.
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        <AdminModal 
          title={editingId ? "Modify Floor Number" : "Register New Floor"} 
          isOpen={isModalOpen} 
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Floor Number</label>
              <input 
                type="number"
                required 
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                placeholder="e.g. 1 (Ground), 2, 3..."
                value={formData.floorNumber} 
                onChange={(e) => setFormData({ floorNumber: e.target.value })} 
              />
              <p className="mt-2 text-[10px] text-gray-400 italic">
                * Building assignment is automatically detected based on your Manager account.
              </p>
            </div>
            
            <button className="w-full bg-[#1E3A4C] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
              {editingId ? "Update Floor" : "Confirm & Save Floor"}
            </button>
          </form>
        </AdminModal>

        {/* Delete Confirmation */}
        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={async () => {
            if (deletingId) {
              await api.deleteFloor(deletingId);
              toast.success("Floor deleted");
              setIsDeleteModalOpen(false);
              loadData();
            }
          }}
          itemName="this floor and all rooms within it"
        />
      </main>
    </div>
  );
}