"use client";

import { useState } from "react";
import loginUser from "@/lib/actions/loginUser"; // Action to log in the user
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import FloatingAlert from "../../components/FloatingAlert"; // Reusable alert component

export default function BarangayLoginPage() {
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

      // Log in the user using Firebase
      const user = await loginUser(email, password);

      // Check if the user has the "barangay_admin" role
      if (user.role !== "barangay_admin") {
        throw new Error("Access denied. This login is for Barangay Officials only.");
      }

      // Show success alert and redirect to Barangay Dashboard
      setAlert({ message: "Login successful! Redirecting to Barangay Dashboard...", severity: "success", show: true });
      setTimeout(() => {
        router.push("/barangay/dashboard"); // Redirect to dashboard
      }, 2000);
    } catch (error) {
      setAlert({ message: error.message, severity: "error", show: true });
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold text-center text-maroon mb-6">Barangay Official Login</h1>
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

        {/* admin page */}
        <div className="text-center mt-4">
          <p className="text-sm">
            <span>Not a Barangay Official? </span>
            <a
              onClick={() => router.push("/login")}
              className="text-maroon font-semibold hover:underline cursor-pointer"
            >
              Login as Citizen
            </a>
          </p>
        </div>

        {/* register as admin */}
        <div className="text-center mt-4">
          <p className="text-sm">
            <span>Don't have an account yet? </span>
            <a
              onClick={() => router.push("/barangay/register")}
              className="text-maroon font-semibold hover:underline cursor-pointer"
            >
              Register as Barangay Official
            </a>
          </p>
          </div>
      </div>
    </div>
  );
}
