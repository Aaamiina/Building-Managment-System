import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import {Login} from "@/pages/Login";
import {Dashboard} from "@/pages/Dashboard";
// import {Buildings} from "@/pages/Buildings";

import {Users} from "@/pages/Users";
import {Maintenance} from "@/pages/Maintenance";
import { ManageBuildings } from "@/pages/BMP";
import { ManageManagers } from "@/pages/MMP";
import { BuildingsDirectory } from "@/pages/BuildingsDirectory";
import { ManageTeam } from "@/pages/sub-managers";
import { ManageFloors } from "@/pages/Floors";
import { ManageRooms } from "@/pages/Rooms";
import { ManagePeople } from "@/pages/peaple";
import { ReportsPage } from "@/pages/Reports";
import { ManagerDashboard } from "@/pages/ManagerDashboard";
import { ProfilePage } from "@/pages/Profile";
import { AdminReports } from "@/pages/AdminReports";
import { SubManagePeople } from "@/pages/SubManagePeople";
import { SubManageFloors } from "@/pages/SubFloorManager";
import { SubManageRooms } from "@/pages/SubManageRooms";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


         <Route
        path="/create-building"
        element={
          <ProtectedRoute>
            <ManageBuildings/>
          </ProtectedRoute>
        }
      />


         <Route
        path="/create-manager"
        element={
          <ProtectedRoute>
            <ManageManagers />
          </ProtectedRoute>
        }
      />


     <Route
        path="/build-overview"
        element={
          <ProtectedRoute>
            <BuildingsDirectory />
          </ProtectedRoute>
        }
      />

       <Route
        path="/team"
        element={
          <ProtectedRoute>
            <ManageTeam />
          </ProtectedRoute>
        }
      />


          <Route
        path="/manage-floors"
        element={
          <ProtectedRoute>
            <ManageFloors />
          </ProtectedRoute>
        }
      />



          <Route
        path="/manage-rooms"
        element={
          <ProtectedRoute>
            <ManageRooms />
          </ProtectedRoute>
        }
      />


          <Route
        path="/manage-people"
        element={
          <ProtectedRoute>
            <ManagePeople />
          </ProtectedRoute>
        }
      />


         <Route
        path="/report"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />



         <Route
        path="/manDash"
        element={
          <ProtectedRoute>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />


           <Route
        path="/adminReport"
        element={
          <ProtectedRoute>
            <AdminReports />
          </ProtectedRoute>
        }
      />


          <Route
        path="/subP"
        element={
          <ProtectedRoute>
            <SubManagePeople />
          </ProtectedRoute>
        }
      />


          <Route
        path="/subF"
        element={
          <ProtectedRoute>
            <SubManageFloors />
          </ProtectedRoute>
        }
      />

          <Route
        path="/subR"
        element={
          <ProtectedRoute>
            <SubManageRooms />
          </ProtectedRoute>
        }
      />
      {/* <Route path="/buildings" element={<ProtectedRoute><Buildings /></ProtectedRoute>} /> */}
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  );
}
