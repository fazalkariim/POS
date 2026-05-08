import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ name: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", form);

      login(data);

      if (data.role === "admin") {
        navigate("/admin/menu");
      } else {
        navigate("/cashier/menu");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 w-80 rounded"
      >

        <h2 className="text-xl font-bold mb-4">Login</h2>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="bg-red-100 text-red-600 p-2 mb-2 text-sm">
            {error}
          </p>
        )}

        <input
          className="border p-2 w-full mb-2"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="bg-black text-white w-full py-2"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

    </div>
  );
};

export default Login;