'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/config/firebase';
import Navbar from '@/app/components/Navbar';
import { CircularProgress } from '@mui/material';

export default function EServicePage() {
  const { uuid } = useParams(); // Get e-service UUID from the URL
  const [eService, setEService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEServiceDetails = async () => {
      try {
        setLoading(true);

        // Fetch the specific e-service details using UUID
        const docRef = doc(collection(db, 'BarangayEServices'), uuid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEService({ ...docSnap.data(), uuid: docSnap.id });
        } else {
          console.error('No such document exists!');
        }
      } catch (error) {
        console.error('Error fetching e-service details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEServiceDetails();
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <CircularProgress />
      </div>
    );
  }

  if (!eService) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">E-Service not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Banner with a stock photo */}
      <div
        className="relative w-full h-64 bg-cover bg-center mt-[56px]"
        style={{
          backgroundImage: 'url(https://i.ytimg.com/vi/2vjuGSlcjGY/maxresdefault.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">{eService.title}</h1>
        </div>
      </div>
      <div className="container mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{eService.title}</h2>
        <p
          className="text-gray-700 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: eService.description }}
        ></p>
      </div>
    </div>
  );
}
