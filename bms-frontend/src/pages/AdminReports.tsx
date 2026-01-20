import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { api, AdminReport } from "../api/report.api";
import { motion } from "framer-motion";
import { 
  ChartPieIcon, 
  BuildingOffice2Icon, 
  UserGroupIcon, 
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

export function AdminReports() {
  // Initialize with a default structure to prevent 'undefined' crashes
  const [data, setData] = useState<AdminReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      const result = await api.getAdminReport();
      setData(result);
    } catch (err) {
      toast.error("Cloud sync failed. Showing local cache if available.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="flex h-screen bg-[#F0F5F9]">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-black text-[#1E3A4C] tracking-[0.3em] uppercase text-[10px]">Auditing Portfolio...</p>
        </div>
      </div>
    );
  }

  // 2. ERROR/EMPTY STATE GUARD
  if (!data) {
    return (
      <div className="flex h-screen bg-[#F0F5F9]">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <ExclamationCircleIcon className="h-12 w-12 text-red-400 mb-2" />
          <p className="text-gray-500 font-bold">No data available from the server.</p>
          <button onClick={fetchReport} className="mt-4 text-blue-600 font-bold text-sm underline">Try Again</button>
        </div>
      </div>
    );
  }

  // 3. SAFE DATA PROCESSING
  // We use optional chaining and nullish coalescing to prevent .filter() errors
  const buildings = data?.buildings ?? [];
  
  const filteredBuildings = buildings.filter(b => 
    (b?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b?.managerName ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: "Portfolio Buildings", value: data?.summary?.totalBuildings ?? 0, icon: BuildingOffice2Icon, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Managers", value: data?.summary?.totalManagers ?? 0, icon: UserGroupIcon, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Units", value: data?.summary?.totalRooms ?? 0, icon: ChartPieIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Global Occupants", value: data?.summary?.totalOccupants ?? 0, icon: ArrowTrendingUpIcon, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* --- HEADER --- */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">Live Global Intelligence</span>
            </div>
            <h1 className="text-4xl font-black text-[#1E3A4C] tracking-tight">Executive Report</h1>
          </motion.div>

          <button 
            onClick={fetchReport}
            className="group flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-2xl font-bold text-[#1E3A4C] hover:shadow-lg transition-all"
          >
            <ArrowPathIcon className="h-4 w-4 group-active:rotate-180 transition-transform duration-500" /> 
            Sync Data
          </button>
        </header>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden"
            >
              <div className={`${s.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 relative z-10`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">{s.label}</p>
              <h2 className="text-4xl font-black text-[#1E3A4C] mt-2 z-10 relative tracking-tighter">{s.value}</h2>
              <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
                 <s.icon className="h-32 w-32" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- PERFORMANCE TABLE --- */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-black text-[#1E3A4C]">Management Portfolio Breakdown</h3>
            
            <div className="relative w-full md:w-96">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Find a building or manager..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-[1.2rem] text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                <tr>
                  <th className="px-10 py-6">Asset Name</th>
                  <th className="px-10 py-6">Management</th>
                  <th className="px-10 py-6">Live Occupancy</th>
                  <th className="px-10 py-6 text-right">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBuildings.length > 0 ? filteredBuildings.map((b) => (
                  <tr key={b?._id} className="group hover:bg-blue-50/40 transition-all">
                    <td className="px-10 py-7">
                      <div className="font-black text-[#1E3A4C] text-lg">{b?.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-widest">Building Unit</div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#1E3A4C] text-white rounded-xl flex items-center justify-center text-xs font-black shadow-lg shadow-blue-900/10">
                          {b?.managerName?.charAt(0) || "U"}
                        </div>
                        <div>
                           <div className="font-bold text-gray-700">{b?.managerName}</div>
                           <div className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">Assigned Manager</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-[#1E3A4C]">{b?.occupantCount}</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Tenants</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        b?.occupantCount > 0 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {b?.occupantCount > 0 ? 'Active' : 'Empty'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 text-center">
                      <div className="max-w-xs mx-auto">
                        <MagnifyingGlassIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No matching records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}