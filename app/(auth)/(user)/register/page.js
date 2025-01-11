"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import registerUser from "@/lib/actions/registerUser";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import FloatingAlert from "../../../components/FloatingAlert";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    street: "",
    barangay: "",
    city: "",
    birthdate: "",
    role: "citizen",
  });
  const [barangays, setBarangays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: "", show: false });
  const router = useRouter();

  // Fetch barangays from Firestore
  useEffect(() => {
    const fetchBarangays = async () => {
      try {
        const barangayCollection = collection(db, "barangay");
        const barangaySnapshot = await getDocs(barangayCollection);
        const barangayList = barangaySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBarangays(barangayList);
      } catch (error) {
        console.error("Error fetching barangays:", error);
      }
    };

    fetchBarangays();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "", severity: "", show: false });
    try {
      const { email, password, fullName, phoneNumber, street, barangay, city, birthdate } = formData;

      await registerUser({
        email,
        password,
        fullName,
        phoneNumber,
        address: { street, barangay, city },
        birthdate: new Date(birthdate),
        role: "citizen",
        barangayId: barangay, // Use selected barangay ID
      });

      setAlert({ message: "Registration successful! Redirecting to login...", severity: "success", show: true });
      setTimeout(() => {
        router.push("/login");
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
        <h1 className="text-2xl font-bold text-center text-maroon mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-maroon"
          />
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
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-maroon"
          />
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={formData.street}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-maroon"
          />
          <select
            name="barangay"
            value={formData.barangay}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-maroon"
          >
            <option value="">Select Barangay</option>
            {barangays.map((barangay) => (
              <option key={barangay.id} value={barangay.id}>
                {barangay.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-maroon"
          />
          <input
            type="date"
            name="birthdate"
            placeholder="Birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-maroon"
          />
          <button
            type="submit"
            className="w-full bg-maroon text-white font-semibold py-2 rounded hover:bg-lightMaroon transition"
            disabled={loading}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
