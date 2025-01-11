"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="relative">
      {/* Background Image with Blur */}
      <div
        // className="absolute inset-0 bg-cover bg-center blur-md border border-black-900"
        className="absolute inset-0 bg-cover bg-center border border-black"
        style={{
          backgroundImage: "url('/images/navbar-bg.png')",
        }}
      ></div>

      {/* Navbar Content */}
      <nav className="relative flex items-center justify-between px-8 py-4 text-white">
        {/* Left Section - Logo or Icons */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
        </div>

        {/* Center Section - Links */}
        <div className="flex items-center space-x-6">
          <Link href="/announcements" className="hover:underline">
            Announcements
          </Link>
          <Link href="/concerns" className="hover:underline">
            Concern
          </Link>
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <Link href="/register" className="hover:underline">
            Register
          </Link>
        </div>

        {/* Right Section - Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 text-black rounded-full focus:outline-none focus:ring-2 focus:ring-white"
          />
          <div className="absolute top-2.5 right-4 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17.5 10.5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </nav>
    </div>
  );
}
