import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(role, password);
      localStorage.setItem("token", data.token);
      navigate(role === "admin" ? "/admin" : "/judge");
    } catch {
      alert("Invalid password");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h1 className="text-xl font-bold mb-4 text-center">
          Arts Fest Login
        </h1>

        <label className="block mb-1">Role</label>
        <select
          className="border p-2 w-full mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="judge">Judge</option>
        </select>

        <label className="block mb-1">Password</label>
        <input
          type="password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
