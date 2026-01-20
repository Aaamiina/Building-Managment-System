import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/reports.api";
import { motion } from "framer-motion";
import { 
  BuildingOffice2Icon, 
  Squares2X2Icon, 
  UserGroupIcon, 
  KeyIcon,
  BriefcaseIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

export function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const data = await api.getManagerReport();
      setReport(data);
    } catch (err) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#F0F5F9]">Loading Analytics...</div>;

  const stats = [
    { title: "Total Floors", value: report?.totalFloors, icon: Squares2X2Icon, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Rooms", value: report?.totalRooms, icon: KeyIcon, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Total People", value: report?.totalPeople, icon: UserGroupIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Active Tenants", value: report?.tenants, icon: UserIcon, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Working Staff", value: report?.staff, icon: BriefcaseIcon, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Occupied Rooms", value: report?.occupiedRooms, icon: ChartBarIcon, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const occupancyRate = report?.totalRooms > 0 
    ? Math.round((report.occupiedRooms / report.totalRooms) * 100) 
    : 0;

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        >
          <div>
            <h1 className="text-3xl font-black text-[#1E3A4C] tracking-tight flex items-center gap-3">
              <BuildingOffice2Icon className="h-9 w-9 text-blue-500" />
              {report?.building} Analytics
            </h1>
            <p className="text-gray-500 font-medium mt-1">Real-time building performance and occupancy report</p>
          </div>
          
          <div className="mt-4 md:mt-0 px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 font-bold text-[#1E3A4C]">
            Today: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </motion.div>

        {/* Big Occupancy Progress Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1E3A4C] rounded-[2.5rem] p-10 mb-10 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black mb-2">{occupancyRate}% Occupancy Rate</h2>
              <p className="text-blue-200 text-lg">Your building is currently seeing high demand.</p>
            </div>
            <div className="mt-6 md:mt-0 h-32 w-32 rounded-full border-8 border-blue-400/30 flex items-center justify-center text-3xl font-black">
               {report?.occupiedRooms}/{report?.totalRooms}
            </div>
          </div>
          {/* Decorative background shape */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-500/5 transition-all"
            >
              <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-black text-[#1E3A4C]">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Simple Footer Chart Simulation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 p-8 bg-white rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center"
        >
          <div className="flex gap-4 w-full h-4 relative bg-gray-100 rounded-full overflow-hidden">
             <div 
               style={{ width: `${(report?.tenants/report?.totalPeople)*100}%` }} 
               className="bg-orange-500 h-full"
             ></div>
             <div 
               style={{ width: `${(report?.staff/report?.totalPeople)*100}%` }} 
               className="bg-purple-500 h-full"
             ></div>
          </div>
          <div className="flex gap-8 mt-4 text-[11px] font-black uppercase tracking-tighter">
            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Tenants ({report?.tenants})</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> Staff ({report?.staff})</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Helper icon
function UserIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}