"use client";

import Link from "next/link";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ConstructionIcon from "@mui/icons-material/Construction";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import DescriptionIcon from "@mui/icons-material/Description";

export default function Dashboard() {
  const cards = [
    {
      title: "Create Announcement",
      description: "Add announcements for your barangay.",
      link: "/barangay/create-announcement",
      icon: <AnnouncementIcon fontSize="large" className="text-maroon" />,
    },
    {
      title: "Create Project",
      description: "Add or manage barangay projects.",
      link: "/barangay/create-project",
      icon: <ConstructionIcon fontSize="large" className="text-maroon" />,
    },
    {
      title: "Create E-Service",
      description: "Add e-services available to your community.",
      link: "/barangay/create-e-service",
      icon: <BuildCircleIcon fontSize="large" className="text-maroon" />,
    },
    {
      title: "Create Transparency Record",
      description: "Add transparency-related documents.",
      link: "/barangay/create-transparency",
      icon: <DescriptionIcon fontSize="large" className="text-maroon" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link key={index} href={card.link}>
            <div className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">{card.icon}</div>
              <h2 className="text-xl font-bold mb-2 text-maroon text-center">{card.title}</h2>
              <p className="text-gray-600 text-center">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
