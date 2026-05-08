import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    password: "",
    role: "cashier",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/auth/register", form);

    alert("User Created");
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form className="bg-white p-6 w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Register User</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>

        <button className="bg-black text-white w-full py-2">
          Create User
        </button>
      </form>
    </div>
  );
};

export default Register;