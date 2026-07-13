import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthProvider";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await login(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF3E4]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-80 space-y-4 border border-[#EEE6D6]"
      >
        <h1 className="text-xl font-bold text-center text-[#1B4B3A]">
          Login Admin
        </h1>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#DDD3BC] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F]"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#DDD3BC] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1B4B3A] text-white py-2.5 rounded-full font-semibold disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;