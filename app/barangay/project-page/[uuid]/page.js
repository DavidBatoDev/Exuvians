'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/config/firebase';
import Navbar from '@/app/components/Navbar';
import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Swiper = dynamic(() => import('swiper/react').then((mod) => mod.Swiper), {
  ssr: false,
});

const SwiperSlide = dynamic(() => import('swiper/react').then((mod) => mod.SwiperSlide), {
  ssr: false,
});

import { Navigation, Pagination } from 'swiper/modules';

export default function BarangayProjectPage() {
  const { uuid } = useParams(); // Get project UUID from the URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);


    console.log(project.images)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);

        // Fetch the specific barangay project details using UUID
        const docRef = doc(db, 'BarangayProjects', uuid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ ...docSnap.data(), uuid: docSnap.id });
        } else {
          console.error('No such document exists!');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <CircularProgress />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Barangay Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Project Banner Section */}
      <div className="relative w-full h-96 bg-gray-200">
        {project.images && project.images.length > 0 ? (
          <Swiper
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            className="h-full"
          >
            {project.images.map((image, index) => (
              <SwiperSlide key={index} className="h-full">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">No images available</p>
          </div>
        )}
      </div>

      {/* Project Details Section */}
      <div className="container mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{project.title}</h1>
        <div className="flex flex-col md:flex-row md:items-center mb-6">
          <p className="text-gray-600 text-lg">
            <strong>Status:</strong> {project.status}
          </p>
          {project.startDate && (
            <p className="text-gray-600 text-lg md:ml-8">
              <strong>Start Date:</strong>{' '}
              {new Date(project.startDate).toLocaleDateString()}
            </p>
          )}
          {project.endDate && (
            <p className="text-gray-600 text-lg md:ml-8">
              <strong>End Date:</strong>{' '}
              {new Date(project.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div
          className="text-gray-700 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: project.description }}
        ></div>
      </div>
    </div>
  );
}
