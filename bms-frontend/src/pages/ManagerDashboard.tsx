import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import * as api from "../api/reports.api"; // Ensure this matches your API file name
import { motion } from "framer-motion";
import { 
  HomeIcon, 
  UserGroupIcon, 
  ArrowUpRightIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  BuildingOfficeIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function ManagerDashboard() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Get Manager Name from localStorage (stored during login)
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const managerName = userData.name || "Manager";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getManagerReport();
      setReport(data);
    } catch (err: any) {
      toast.error("Failed to sync dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-[#1E3A4C] tracking-widest uppercase text-sm">Initializing Command Center...</p>
      </div>
    );
  }

  // Calculate percentage safely
  const occupancyRate = report?.totalRooms > 0 
    ? Math.round((report.occupiedRooms / report.totalRooms) * 100) 
    : 0;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* --- HEADER SECTION --- */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">Operational Live Feed</span>
            </div>
            <h1 className="text-4xl font-black text-[#1E3A4C] tracking-tight">
              Hello, {managerName} <span className="inline-block animate-bounce-subtle">👋</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Currently overseeing <span className="text-[#1E3A4C] font-bold">{report?.building || "Assigned Building"}</span>
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-3"
          >
            <Link to="/reports" className="bg-white border border-gray-200 text-[#1E3A4C] px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
               Analytics
            </Link>
            <Link to="/manage-people" className="bg-[#1E3A4C] text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-blue-900/20 transition-all flex items-center gap-2">
               Assign Person <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          </motion.div>
        </header>

        {/* --- BENTO GRID --- */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Main Hero Card: Occupancy Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="col-span-12 lg:col-span-8 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="relative z-10">
               <div className="flex items-center gap-2 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                  <BuildingOfficeIcon className="h-4 w-4" /> Building Health
               </div>
               <div className="flex items-baseline gap-3 mt-6">
                  <span className="text-8xl font-black text-[#1E3A4C] tracking-tighter">
                    {report?.occupiedRooms}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-300">/ {report?.totalRooms}</span>
                    <span className="text-xs font-black text-gray-400 uppercase">Occupied Units</span>
                  </div>
               </div>
               
               <div className="mt-10 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl text-xs font-black">
                     <CheckBadgeIcon className="h-4 w-4" /> {occupancyRate}% Efficiency
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2.5 rounded-2xl text-xs font-black">
                     <HomeIcon className="h-4 w-4" /> {report?.totalRooms - report?.occupiedRooms} Available Units
                  </div>
               </div>
            </div>
            {/* Elegant Background Decoration */}
            <BoltIcon className="absolute -right-16 -bottom-16 h-80 w-80 text-gray-50/80 -rotate-12 group-hover:text-blue-50 transition-colors duration-700" />
          </motion.div>

          {/* Side Card: Staff Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-4 bg-[#1E3A4C] rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
               <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                  <UserGroupIcon className="h-8 w-8 text-white" />
               </div>
               <span className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Active Staff</span>
            </div>
            <div>
               <h3 className="text-6xl font-black mb-2">{report?.staff}</h3>
               <p className="text-blue-200 font-medium text-sm leading-relaxed">
                 Professional staff members currently assigned to manage operations.
               </p>
            </div>
          </motion.div>

          {/* Metric 1: Tenants */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:border-blue-200 transition-colors"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Tenants</p>
            <h4 className="text-4xl font-black text-[#1E3A4C] mt-2">{report?.tenants}</h4>
            <div className="flex items-center gap-2 mt-4 text-xs font-bold text-blue-600">
                <BriefcaseIcon className="h-4 w-4" /> High Retention
            </div>
          </motion.div>

          {/* Metric 2: Floors */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Floor Capacity</p>
            <h4 className="text-4xl font-black text-[#1E3A4C] mt-2">{report?.totalFloors}</h4>
            <p className="text-xs text-gray-400 mt-2 font-medium italic">Active building levels</p>
          </motion.div>

          {/* Real-time Status / Activity Feed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="col-span-12 lg:col-span-6 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-[#1E3A4C] flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                    Management Alerts
                </h3>
                <span className="text-[10px] font-black text-blue-600 uppercase">Live Feed</span>
            </div>
            
            <div className="space-y-4">
               <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] border border-transparent hover:border-orange-100 transition-all">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">New occupancy registered</p>
                    <p className="text-[10px] text-gray-400 font-medium">Building system updated successfully</p>
                  </div>
                  <span className="text-[10px] text-gray-400 ml-auto font-black uppercase">Recent</span>
               </div>

               <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] border border-transparent hover:border-blue-100 transition-all">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Monthly reports generated</p>
                    <p className="text-[10px] text-gray-400 font-medium">Check analytics for deep dive</p>
                  </div>
                  <span className="text-[10px] text-gray-400 ml-auto font-black uppercase">Today</span>
               </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}