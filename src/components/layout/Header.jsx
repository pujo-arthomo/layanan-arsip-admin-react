import { useAuth } from "../../hooks/useAuth";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <span className="font-medium text-gray-700">
        Dashboard
      </span>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">
            {user.email}
          </span>
        )}

        <button
          onClick={logout}
          className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
