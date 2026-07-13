import { NavLink } from "react-router-dom";
import Header from "./Header";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#FBF3E4]">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-[#1B4B3A] text-[#FBF3E4] flex flex-col">
        {/* Brand */}
        <div className="p-4 font-bold text-lg border-b border-white/10">
          Diskarpus Admin
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-3 py-2 rounded font-medium ${
                isActive ? "bg-[#8BC53F] text-[#1B4B3A]" : "hover:bg-white/10"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/pemohon"
            className={({ isActive }) =>
              `block px-3 py-2 rounded font-medium ${
                isActive ? "bg-[#8BC53F] text-[#1B4B3A]" : "hover:bg-white/10"
              }`
            }
          >
            Pemohon Arsip
          </NavLink>

          <NavLink
            to="/arsip"
            className={({ isActive }) =>
              `block px-3 py-2 rounded font-medium ${
                isActive ? "bg-[#8BC53F] text-[#1B4B3A]" : "hover:bg-white/10"
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
        <main className="flex-1 bg-[#FBF3E4] p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;