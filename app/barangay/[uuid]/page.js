'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { firebaseApp } from '@/lib/config/firebase';

const db = getFirestore(firebaseApp);

export default function BarangayPage() {
  const { uuid } = useParams(); // Get barangay UUID from URL
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [barangayName, setBarangayName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBarangayDetails = async () => {
      try {
        // Fetch barangay details
        const barangayRef = collection(db, 'barangay');
        const barangayQuery = query(barangayRef, where('__name__', '==', uuid));
        const barangaySnapshot = await getDocs(barangayQuery);

        if (!barangaySnapshot.empty) {
          const barangayData = barangaySnapshot.docs[0].data();
          setBarangayName(barangayData.name);

          // Fetch the latest announcement
          const announcementsRef = collection(db, 'BarangayAnnouncements');
          const announcementsQuery = query(
            announcementsRef,
            where('barangayId', '==', uuid),
            orderBy('createdAt', 'desc'),
            limit(1)
          );
          const announcementsSnapshot = await getDocs(announcementsQuery);

          if (!announcementsSnapshot.empty) {
            setLatestAnnouncement(announcementsSnapshot.docs[0].data());
          }
        }
      } catch (error) {
        console.error('Error fetching barangay or announcements:', error);
      }
    };

    fetchBarangayDetails();
  }, [uuid]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar navbarBg="/images/navbar-bg-point1.png" />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{barangayName}</h1>
        </div>
        <div className="grid grid-cols-12 gap-8">
          {/* Large Announcement Section */}
          <div className="col-span-12 md:col-span-8">
            {latestAnnouncement ? (
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={latestAnnouncement.imageUrl}
                  alt={latestAnnouncement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 w-full">
                  <h2 className="text-xl font-bold">{latestAnnouncement.title}</h2>
                  <p className="text-sm">{new Date(latestAnnouncement.date).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <div className="h-64 md:h-96 bg-gray-200 flex items-center justify-center rounded-lg shadow-lg">
                <p className="text-gray-600">No announcements available</p>
              </div>
            )}
          </div>

          {/* Sidebar Section */}
          <div className="col-span-12 md:col-span-4">
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => router.push(`/barangay/${uuid}/events`)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Upcoming Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push(`/barangay/${uuid}/announcements`)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Announcements
                </button>
              </li>
              {/* Add more links as needed */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
