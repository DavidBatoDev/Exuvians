'use client'

import { useState } from "react";
import loginUser from "@/lib/actions/loginUser";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.icon({
  iconUrl: "/images/custom-icon.png", // Path to your image
  iconSize: [32, 32], // Size of the icon [width, height]
  iconAnchor: [16, 32], // Anchor point [x, y] (e.g., the bottom center of the icon)
  popupAnchor: [0, -32], // Anchor point for the popup [x, y]
});

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [navbarBg, setNavbarBg] = useState("/images/navbar-bg-point1.png"); // Default navbar background
  const [selectedBarangay, setSelectedBarangay] = useState("Barangay"); // Default barangay
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      await loginUser(email, password);
      router.push("/"); // Redirect to homepage
    } catch (error) {
      alert("Failed to log in: " + error.message);
    }
  };

  const handleRegisterNavigation = () => {
    router.push("/register");
  };

  // Function to handle marker click
  const handleMarkerClick = (imagePath, barangay) => {
    setNavbarBg(imagePath); // Update navbar background
    setSelectedBarangay(barangay); // Update selected barangay
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Navbar with dynamic background */}
      <Navbar navbarBg={navbarBg} />

      <div className="flex min-h-screen">
        {/* Left Section - Interactive Map */}
        <div className="w-1/2 relative z-10">
          <MapContainer
            center={[14.718229331907937, 121.11091775061686]} // Coordinates of a starting point
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
                click: () => handleMarkerClick("/images/navbar-bg-point1.png", "Payatas"),
              }}
            >
              <Popup>Payatas</Popup>
            </Marker>

            {/* Marker 2 */}
            <Marker
              position={[14.704082769808185, 121.10932359866247]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick("/images/navbar-bg-point2.jpg", "Bagong Silangan"),
              }}
            >
              <Popup>Bagong Silangan</Popup>
            </Marker>
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow-md">
            <h4 className="font-bold mb-2">Legend</h4>
            <ul className="text-sm">
              <li>
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Payatas
              </li>
              <li>
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Bagong Silangan
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="w-3/4 max-w-md bg-white rounded-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
              Log in to {selectedBarangay} Portal
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Don’t have an account?{" "}
              <button
                onClick={handleRegisterNavigation}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
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
                <Link href="/register" className="underline">
                  Register to this barangay
                </Link>
              </p>

              <p className="text-right text-sm text-gray-600">
                <Link href="/barangay/login" className="underline">
                  Login as Barangay Officials
                </Link>
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
