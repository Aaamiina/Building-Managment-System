import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Squares2X2Icon,
  BuildingOfficeIcon,
  UserPlusIcon,
  QueueListIcon,
  HomeIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon
} from "@heroicons/react/24/outline";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- ROLE BASED NAVIGATION LOGIC ---
  
  const getMenuItems = () => {
    const role = user?.role?.toLowerCase();

    // 1. SUPER ADMIN: High-level management
    if (role === "super_admin") {
      return [
        { name: "Dashboard", icon: Squares2X2Icon, path: "/dashboard" },
        { name: "Create Building", icon: BuildingOfficeIcon, path: "/create-building" },
        { name: "Create Manager", icon: UserPlusIcon, path: "/create-manager" },
        { name: "Buildings & Managers", icon: ShieldCheckIcon, path: "/build-overview" },
         { name: "Report", icon: ShieldCheckIcon, path: "/adminReport" },
       { name: "Profile", icon: ClipboardDocumentCheckIcon, path: "/profile" },

      ];
    }

    // 2. MANAGER: Full operational control + Staff management
    if (role === "manager") {
      return [
        { name: "Dashboard", icon: Squares2X2Icon, path: "/manDash" },
        { name: "Create Sub-Manager", icon: UserPlusIcon, path: "/team" }, // Only for Manager
        { name: "Floors", icon: QueueListIcon, path: "/manage-floors" },
        { name: "Rooms", icon: HomeIcon, path: "/manage-rooms" },
        { name: "Tenants/People", icon: UsersIcon, path: "/manage-people" },
        { name: "Reports", icon: ClipboardDocumentCheckIcon, path: "/report" },
        { name: "Profile", icon: ClipboardDocumentCheckIcon, path: "/profile" },
      ];
    }

    // 3. SUB-MANAGER: Operations only (No staff management)
    if (role === "sub_manager") {
      return [
        { name: "Dashboard", icon: Squares2X2Icon, path: "/manDash" },
        { name: "Floors", icon: QueueListIcon, path: "/subF" },
        { name: "Rooms", icon: HomeIcon, path: "/subR" },
        { name: "Tenants/People", icon: UsersIcon, path: "/subP" },
        { name: "Reports", icon: ClipboardDocumentCheckIcon, path: "/report" },
      ];
    }

    return []; // Default empty
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-[#1E3A4C] text-white flex flex-col h-screen sticky top-0 shrink-0">
      {/* Profile Section */}
      <div className="p-8 text-center border-b border-white/10">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 overflow-hidden border-2 border-white/20">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`} 
            alt="Profile" 
          />
        </div>
        <h2 className="text-lg font-semibold leading-tight truncate">{user?.name}</h2>
        <p className="text-[10px] text-orange-400 uppercase font-bold tracking-widest mt-1">
          {user?.role?.replace("superadmin", "Super Admin").replace("submanager", "Sub-Manager")}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 pl-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-4 rounded-l-full transition-all duration-200 ${
                isActive 
                  ? "bg-[#F0F5F9] text-[#1E3A4C] font-bold shadow-[-4px_0_10px_rgba(0,0,0,0.1)]" 
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-[#1E3A4C]" : "text-gray-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}