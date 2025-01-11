"use client";

import { useState } from "react";
import loginUser from "@/lib/actions/loginUser"; // Action to log in the user
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import FloatingAlert from "../../components/FloatingAlert"; // Reusable alert component
import Navbar from "@/app/components/Navbar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Icon
const customIcon = L.icon({
  iconUrl: "/images/custom-icon.png", // Path to your image
  iconSize: [32, 32], // Size of the icon [width, height]
  iconAnchor: [16, 32], // Anchor point [x, y] (e.g., the bottom center of the icon)
  popupAnchor: [0, -32], // Anchor point for the popup [x, y]
});

export default function BarangayLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [navbarBg, setNavbarBg] = useState("/images/navbar-bg-point1.png"); // Default navbar background
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

  // Function to change navbar background
  const handleMarkerClick = (imagePath) => {
    setNavbarBg(imagePath);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Navbar with dynamic background */}
      <Navbar navbarBg={navbarBg} />

      <div className="flex min-h-screen">
        {/* Left Section - Interactive Map */}
        <div className="w-1/2 relative z-10">
          <MapContainer
            center={[14.676041, 121.0437]} // Coordinates of a starting point
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            {/* TileLayer for map styling */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Marker 1 */}
            <Marker
              position={[14.718229331907937, 121.11091775061686]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick("/images/navbar-bg-point1.png"),
              }}
            >
              <Popup>Payatas</Popup>
            </Marker>

            {/* Marker 2 */}
            <Marker
              position={[14.704082769808185, 121.10932359866247]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick("/images/navbar-bg-point2.jpg"),
              }}
            >
              <Popup>Bagong Silangan</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <CircularProgress style={{ color: "#fff" }} />
            </div>
          )}
          <FloatingAlert message={alert.message} severity={alert.severity} show={alert.show} />
          <div className="w-3/4 max-w-md bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
              Log in to Barangay Portal
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Logging in as Barangay Official of this Barangay
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-gray-300"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-gray-300"
                />
                <button
                  type="button"
                  className="absolute right-4 top-2 text-gray-600"
                >
                  Hide
                </button>
              </div>
              <div className="flex gap-2 w-full justify-between">
                <p className="text-right text-sm text-gray-600">
                  <button
                    onClick={() => router.push("/register")}
                    className="underline"
                  >
                    Register as Citizen
                  </button>
                </p>
                <p className="text-right text-sm text-gray-600">
                  <button
                    onClick={() => router.push("/login")}
                    className="underline"
                  >
                    Login as Citizen
                  </button>
                </p>
              </div>
              <button
                type="submit"
                className="w-full py-2 text-sm font-bold text-white bg-gray-400 rounded hover:bg-gray-500"
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
