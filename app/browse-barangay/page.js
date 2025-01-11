'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Navbar from '@/app/components/Navbar';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import Link from 'next/link';

// Icons for markers
const defaultIcon = L.icon({
  iconUrl: '/images/custom-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const highlightedIcon = L.icon({
  iconUrl: '/images/highlighted-icon.png', // Provide a highlighted icon
  iconSize: [40, 40], // Slightly larger size for the highlight
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Barangay data
const barangays = [
  {
    id: 1,
    name: 'Payatas',
    coordinates: [14.718229331907937, 121.11091775061686],
    description: 'A bustling barangay in Quezon City.',
    website: '/barangay/sZzMpdqxS8viDAn7nrfd', // Example barangay website
  },
  {
    id: 2,
    name: 'Bagong Silangan',
    coordinates: [14.704082769808185, 121.10932359866247],
    description: 'A progressive barangay with ongoing projects.',
    website: '/barangay/LnbXpjlCb1Zj4jwb0wkS', // Example barangay website
  },
];

// Component to handle map panning
function FlyToMarker({ position }) {
  const map = useMap();
  map.flyTo(position, 14); // Adjust zoom level if needed
  return null;
}

export default function BrowseBarangay() {
  const [selectedBarangay, setSelectedBarangay] = useState(barangays[0]);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <Navbar navbarBg="/images/navbar-bg-point1.png" />
      <div className="flex min-h-screen">
        {/* Left Section - Barangay List */}
        <div className="w-1/3 bg-white shadow-md overflow-y-auto">
          <h2 className="text-xl font-bold p-4 border-b border-gray-200">
            Barangays List
          </h2>
          <ul className="divide-y divide-gray-200">
            {barangays.map((barangay) => (
              <li
                key={barangay.id}
                onClick={() => setSelectedBarangay(barangay)}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${
                  selectedBarangay.id === barangay.id ? 'bg-gray-200' : ''
                }`}
              >
                <h3 className="font-semibold text-gray-800">{barangay.name}</h3>
                <p className="text-gray-600 text-sm">{barangay.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - Map */}
        <div className="w-2/3 relative z-10">
          <MapContainer
            center={selectedBarangay.coordinates}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Fly to selected marker */}
            <FlyToMarker position={selectedBarangay.coordinates} />

            {barangays.map((barangay) => (
              <Marker
                key={barangay.id}
                position={barangay.coordinates}
                icon={
                  selectedBarangay.id === barangay.id
                    ? highlightedIcon
                    : defaultIcon
                }
              >
                <Popup>
                  <h3 className="font-bold">{barangay.name}</h3>
                  <p>{barangay.description}</p>
                  <Link
                    href={barangay.website}
                    className="mt-2 px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Go to Barangay Website
                  </Link>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
