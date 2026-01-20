import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Card, CardContent } from "../components/Card";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { DashboardStats, getDashboardStats } from "../api/dashboardApi";
import { MagnifyingGlassIcon, BellIcon, MoonIcon } from "@heroicons/react/24/outline";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | undefined>();

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <div className="h-screen w-full flex items-center justify-center bg-[#F0F5F9]"><LoadingSpinner /></div>;

  return (
    <div className="flex min-h-screen bg-[#F0F5F9]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="relative w-80">
            <MagnifyingGlassIcon className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
            <input 
              className="w-full pl-12 pr-4 py-2.5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-blue-400 outline-none" 
              placeholder="Search assets..." 
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-gray-200 p-1 rounded-full items-center">
              <div className="bg-white rounded-full p-1.5 shadow-sm"><div className="w-3 h-3 bg-blue-500 rounded-full" /></div>
              <MoonIcon className="h-5 w-5 mx-2 text-gray-500" />
            </div>
            <BellIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Buildings", value: stats.totalBuildings, color: "text-blue-600" },
            { label: "Total Rooms", value: stats.totalRooms, color: "text-green-600" },
            { label: "Occupancy", value: `${stats.occupancyRate}%`, color: "text-indigo-600" },
            { label: "Revenue", value: `$${stats.monthlyRevenue.toLocaleString()}`, color: "text-emerald-600" },
          ].map((item) => (
            <Card key={item.label} className="border-none shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                <p className={`text-2xl font-black mt-1 ${item.color}`}>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real Table from Image Design */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#1E3A4C]">Maintenance History</h3>
            <div className="flex gap-6 text-sm">
              <span className="text-orange-500 font-bold border-b-2 border-orange-500 pb-1 cursor-pointer">All Orders</span>
              <span className="text-gray-400 font-medium cursor-pointer">Pending</span>
              <span className="text-gray-400 font-medium cursor-pointer">Completed</span>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-4 text-center">S No</th>
                <th className="px-8 py-4">Request ID</th>
                <th className="px-8 py-4">Task Name</th>
                <th className="px-8 py-4">Priority</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentRequests.map((req, i) => (
                <tr key={req._id} className="hover:bg-blue-50/40 transition-colors cursor-default">
                  <td className="px-8 py-5 text-center text-gray-400 text-sm">{i + 1}</td>
                  <td className="px-8 py-5 font-bold text-gray-700">{req._id.slice(-6).toUpperCase()}</td>
                  <td className="px-8 py-5 text-gray-600 font-medium">{req.title}</td>
                  <td className="px-8 py-5 text-gray-500 text-sm">{req.priority}</td>
                  <td className="px-8 py-5">
                    <span className={`font-bold text-sm ${
                      req.status === 'completed' ? 'text-green-500' : 
                      req.status === 'pending' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="p-6 flex justify-center gap-2">
            <button className="w-8 h-8 rounded-full bg-[#1E3A4C] text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100">2</button>
            <button className="w-8 h-8 rounded-full text-gray-400 text-xs font-bold hover:bg-gray-100">3</button>
          </div>
        </div>
      </main>
    </div>
  );
}



