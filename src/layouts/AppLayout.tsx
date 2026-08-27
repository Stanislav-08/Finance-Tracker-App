import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Outlet />
      </div>
    </div>
  );
}
