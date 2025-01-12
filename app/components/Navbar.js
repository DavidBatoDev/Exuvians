"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/config/firebase"; // Update with your Firebase config path

const navbarBg = "/images/navbar-bg-point1.png"; // Default background

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [userBarangay, setUserBarangay] = useState(null);
  const [currentNavbarBg, setCurrentNavbarBg] = useState(navbarBg);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const barangayId = userDoc.data().barangayId;

          // Fetch barangay data to get the name
          const barangayDocRef = doc(db, "barangay", barangayId);
          const barangayDoc = await getDoc(barangayDocRef);

          if (barangayDoc.exists()) {
            const barangayName = barangayDoc.data().name;

            // Set the navbar background based on barangay
            if (barangayName === "Payatas") {
              setCurrentNavbarBg("/images/navbar-bg-point1.png");
            } else if (barangayName === "Bagong Silangan") {
              setCurrentNavbarBg("/images/navbar-bg-point1.png");
            } else {
              setCurrentNavbarBg(navbarBg); // Default background
            }

            setUserBarangay(barangayName);
          }
        }
      } else {
        setUser(null);
        setUserBarangay(null);
        setCurrentNavbarBg(navbarBg); // Reset to default when no user is logged in
      }
    });

    return () => unsubscribe();
  }, [navbarBg]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUserBarangay(null);
    setCurrentNavbarBg(navbarBg); // Reset to default background on logout
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center border border-black bg-[#05184A]"
          style={{
            backgroundImage: `url(${currentNavbarBg})`, // Use the updated navbar background
          }}
        ></div>

        {/* Navbar Content */}
        <nav className="relative flex items-center justify-between px-8 py-4 text-white">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
          </div>

          {/* Center Section */}
          <div className="flex items-center space-x-6">
            <Link href="/browse-barangay" className="hover:underline">
              Browse barangay
            </Link>
            <Link href="/concerns" className="hover:underline">
              Concern
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </div>

          {/* Right Section */}
          <div className="relative flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {user.displayName?.charAt(0) || "R"}
                    </span>
                  </div>
                  <span className="text-sm">
                    Welcome, {user.displayName || "Resident"}{" "}
                    {userBarangay ? `(${userBarangay})` : ""}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
