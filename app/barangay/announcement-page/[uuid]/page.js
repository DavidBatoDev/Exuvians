'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/config/firebase';
import Navbar from '@/app/components/Navbar';
import { CircularProgress } from '@mui/material';

export default function AnnouncementPage() {
  const { uuid } = useParams(); // Get announcement UUID from the URL
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      try {
        setLoading(true);

        // Fetch the specific announcement details using UUID
        const docRef = doc(db, 'BarangayAnnouncements', uuid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAnnouncement({ ...docSnap.data(), uuid: docSnap.id });
        } else {
          console.error('No such document exists!');
        }
      } catch (error) {
        console.error('Error fetching announcement details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementDetails();
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <CircularProgress />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Announcement not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Banner Section */}
      <div
        className="relative w-full h-64 md:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${announcement.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold text-center">{announcement.title}</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-8 py-12">
        
        <p className="text-gray-600 text-sm mb-4">
          Posted on: {new Date(announcement.date).toLocaleDateString()}
        </p>
        <div
          className="text-gray-700 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: announcement.description }}
        ></div>
      </div>
    </div>
  );
}
