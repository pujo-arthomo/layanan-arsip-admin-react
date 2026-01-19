import { NavLink } from "react-router-dom";
import Header from "./Header";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Brand */}
        <div className="p-4 font-bold text-lg border-b border-slate-700">
          Diskarpus Admin
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-slate-700"
                  : "hover:bg-slate-700"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/pemohon"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-slate-700"
                  : "hover:bg-slate-700"
              }`
            }
          >
            Pemohon Arsip
          </NavLink>

          <NavLink
            to="/arsip"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive
                  ? "bg-slate-700"
                  : "hover:bg-slate-700"
              }`
            }
          >
            Koleksi Arsip
          </NavLink>
        </nav>
      </aside>

      {/* ================= Main Area ================= */}
      <div className="flex-1 flex flex-col">
        {/* Header (user info + logout) */}
        <Header />

        {/* Content */}
        <main className="flex-1 bg-gray-100 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
