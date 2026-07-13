import { useAuth } from "../auth/AuthProvider";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-[#EEE6D6] flex items-center justify-between px-6">
      <span className="font-semibold text-[#1B4B3A]">Dashboard</span>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-[#5C6B63]">{user.email}</span>
        )}

        <button
          onClick={logout}
          className="text-sm px-3 py-1.5 border border-[#1B4B3A] text-[#1B4B3A] rounded-full hover:bg-[#1B4B3A] hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;