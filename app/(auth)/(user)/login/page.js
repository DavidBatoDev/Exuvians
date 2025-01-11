"use client";

import { useState } from "react";
import loginUser from "@/lib/actions/loginUser";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import FloatingAlert from "../../../components/FloatingAlert";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: "", show: false });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "", severity: "", show: false });
    try {
      const { email, password } = formData;
      await loginUser(email, password);

      setAlert({ message: "Login successful! Redirecting to homepage...", severity: "success", show: true });
      setTimeout(() => {
        router.push("/"); // Redirect to homepage
      }, 2000); // Redirect after success
    } catch (error) {
      setAlert({ message: error.message, severity: "error", show: true });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNavigation = () => {
    router.push("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightMaroon">
      {loading && (
        <div className="loading-overlay">
          <CircularProgress style={{ color: "#fff" }} />
        </div>
      )}
      <FloatingAlert message={alert.message} severity={alert.severity} show={alert.show} />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-maroon mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-maroon"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-maroon"
          />
          <button
            type="submit"
            className="w-full bg-maroon text-white font-semibold py-2 rounded hover:bg-lightMaroon transition"
            disabled={loading}
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm">
            Don't have an account yet?{" "}
            <button
              onClick={handleRegisterNavigation}
              className="text-maroon font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
