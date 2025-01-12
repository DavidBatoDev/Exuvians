"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import registerUser from "@/lib/actions/registerUser";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Navbar from "@/app/components/Navbar";

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
  const [navbarBg, setNavbarBg] = useState("/images/navbar-bg-default.png"); // Default navbar background
  const [selectedBarangay, setSelectedBarangay] = useState("Barangay"); // Default barangay
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
        barangayId: barangay,
      });

      alert("Registration successful! Redirecting to login...");
      router.push("/login");
    } catch (error) {
      alert("Error registering user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Navbar with dynamic background */}
      <Navbar navbarBg={navbarBg} />

      <div className="flex min-h-screen">
        {/* Left Section - Info Banner */}
        <div className="w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-500">
          <div className="text-center text-white space-y-4 px-8">
            <h1 className="text-4xl font-bold">Register to Access Barangay Services</h1>
            <p className="text-lg">
              Become a part of your local barangay and access exclusive resources and services.
            </p>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="w-3/4 max-w-md bg-white rounded-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
              Register for {selectedBarangay}
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Enter your details to create an account.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-gray-300"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-gray-300"
                  />
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-gray-300"
                  />
                  <select
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-gray-300"
                  >
                    <option value="">Select Barangay</option>
                    {barangays.map((barangay) => (
                      <option key={barangay.id} value={barangay.id}>
                        {barangay.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-gray-300"
                  />
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-400 rounded hover:bg-gray-500 text-white font-semibold py-2 transition"
                  disabled={loading}
                >
                  Register
                </button>
              </form>

            {/* login button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => router.push("/login")}
                className="text-sm text-gray-600 hover:underline"
              >
                Already have an account? Login here
              </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
