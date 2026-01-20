import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/manager.api";
import { toast } from "sonner";
import { UserPlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AdminModal } from "@/components/AdminModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export function SubManagePeople() {
  const [people, setPeople] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", type: "TENANT" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await api.getPeople();
      setPeople(data || []);
    } catch (err) { toast.error("Error fetching data"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.updatePerson(editingId, formData);
        if (res.isPending) toast.info("Codsiga beddelka waa la diray");
      } else {
        await api.assignPerson(formData);
        toast.success("Qof cusub si toos ah ayaa loo daray");
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: "", phone: "", type: "TENANT" });
      loadData();
    } catch (err) { toast.error("Operation failed"); }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-[#1E3A4C]">People & Tenants</h1>
          <button onClick={() => {setEditingId(null); setIsModalOpen(true);}} className="bg-[#1E3A4C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg">
            <UserPlusIcon className="h-5 w-5" /> Quick Assign (Direct)
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
              <tr><th className="px-8 py-4">Full Name</th><th className="px-8 py-4">Status</th><th className="px-8 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {people.map((p) => (
                <tr key={p._id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-[#1E3A4C]">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.phone}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">
                      {p.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(p._id); setFormData(p); setIsModalOpen(true); }} className="text-blue-500 font-bold text-[10px] uppercase underline flex items-center gap-1">
                        <PencilSquareIcon className="h-4 w-4" /> Req Edit
                      </button>
                      <button onClick={() => { setDeletingId(p._id); setIsDeleteModalOpen(true); }} className="text-red-400 font-bold text-[10px] uppercase underline flex items-center gap-1">
                        <TrashIcon className="h-4 w-4" /> Req Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminModal title={editingId ? "Request Record Change" : "Assign New Person (Direct)"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="w-full p-4 rounded-xl border-2 border-gray-50 font-bold" placeholder="Full Name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
            <input className="w-full p-4 rounded-xl border-2 border-gray-50 font-bold" placeholder="Phone Number" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} required />
            <button className="w-full bg-[#1E3A4C] text-white py-4 rounded-xl font-bold uppercase tracking-widest">
              {editingId ? "Submit Change Request" : "Save Directly"}
            </button>
          </form>
        </AdminModal>

        <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={async () => {
            const res = await api.deletePerson(deletingId!);
            if (res.isPending) toast.warning("Codsiga tirtirista waa la diray");
            setIsDeleteModalOpen(false);
            loadData();
          }} itemName="this record (Manager Approval Needed)" 
        />
      </main>
    </div>
  );
}