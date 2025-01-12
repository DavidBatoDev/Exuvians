'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/config/firebase';
import EventIcon from '@mui/icons-material/Event';
import CampaignIcon from '@mui/icons-material/Campaign';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { CircularProgress } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WarningIcon from '@mui/icons-material/Warning';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SchoolIcon from '@mui/icons-material/School';
import ConstructionIcon from '@mui/icons-material/Construction';
import GavelIcon from '@mui/icons-material/Gavel';
import ElderlyIcon from '@mui/icons-material/Elderly';
import Link from 'next/link';
import BarangayNavbar from '@/app/components/BarangayNavbar';
import Footer from '@/app/components/Footer';

const icons = {
  "Public Employment Service Inquiry": WorkIcon,
  "Person with Disability Verification Service": AccessibilityNewIcon,
  "Occupational Permit/Health Certificates": LocalHospitalIcon,
  "Community Tax Certificate": ReceiptIcon,
  "Real Property Tax (RPTAX)": AccountBalanceIcon,
  "Notice of Violations": WarningIcon,
  "Business Permit Licensing": BusinessIcon,
  "Business Tax (BTAX)": AttachMoneyIcon,
  "Skills and Livelihood Programs": SchoolIcon,
  "Building Permit Management System": ConstructionIcon,
  "Single Ticketing System": GavelIcon,
  "Office of the Senior Citizen ID System": ElderlyIcon
};


export default function BarangayPage() {
  const { uuid } = useParams(); // Get barangay UUID from URL
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [otherAnnouncements, setOtherAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [barangayName, setBarangayName] = useState('');
  const [barangayProjects, setBarangayProjects] = useState([]);
  const [eServices, setEServices] = useState([]);
  const [transparencyDocs, setTransparencyDocs] = useState([]);
  const router = useRouter();

  const truncateText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    }
    return text.substring(0, limit) + '...';
  };

  console.log(latestAnnouncement, otherAnnouncements)

  useEffect(() => {
    const fetchBarangayDetails = async () => {
      try {
        setLoading(true);
        // Fetch barangay details
        const barangayRef = collection(db, 'barangay');
        const barangayQuery = query(barangayRef, where('__name__', '==', uuid));
        const barangaySnapshot = await getDocs(barangayQuery);

        if (!barangaySnapshot.empty) {
          const barangayData = {
            ...barangaySnapshot.docs[0].data(),
            uuid: barangaySnapshot.docs[0].id,
          }
          setBarangayName(barangayData.name);

          // Fetch all announcements
          const announcementsRef = collection(db, 'BarangayAnnouncements');
          const announcementsQuery = query(
            announcementsRef,
            where('barangayId', '==', uuid),
            orderBy('createdAt', 'desc'),
            limit(5) // Fetch up to 5 announcements
          );
          const announcementsSnapshot = await getDocs(announcementsQuery);

          // Separate latest announcement and others
          if (!announcementsSnapshot.empty) {
            const allAnnouncements = announcementsSnapshot.docs.map((doc) => ({
              uuid: doc.id,
              ...doc.data(),
            }));
            setLatestAnnouncement(allAnnouncements[0]); // First announcement as the latest
            setOtherAnnouncements(allAnnouncements.slice(1)); // Remaining as others
          }
          // Fetch all barangay projects
          const projectsRef = collection(db, 'BarangayProjects');
          const projectsQuery = query(projectsRef, where('barangayId', '==', uuid));
          const projectsSnapshot = await getDocs(projectsQuery);

          const projects = projectsSnapshot.docs.map((doc) => ({
            ...doc.data(), // Spread the document data
            uuid: doc.id,  // Add the document ID as `uuid`
          }))
          setBarangayProjects(projects);

          // Fetch all transparency documents
          const transparencyRef = collection(db, 'BarangayTransparency');
          const transparencyQuery = query(transparencyRef, where('barangayId', '==', uuid));
          const transparencySnapshot = await getDocs(transparencyQuery);

          const transparencyData = transparencySnapshot.docs.map((doc) => ({
            ...doc.data(),
            uuid: doc.id,
          }));
          setTransparencyDocs(transparencyData);


          // Fetch all barangay eServices
          const eServicesRef = collection(db, 'BarangayEServices');
          const eServicesQuery = query(eServicesRef, where('barangayId', '==', uuid));
          const eServicesSnapshot = await getDocs(eServicesQuery);
          const services = eServicesSnapshot.docs.map((doc) => ({
            ...doc.data(), // Spread the document data
            uuid: doc.id,  // Add the document ID as `uuid`
          }))
          setEServices(services);
        }
      } catch (error) {
        console.error('Error fetching barangay or announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarangayDetails();
  }, [uuid]);

  return (
    <div className="min-h-screen bg-gray-100">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <CircularProgress style={{ color: "#fff" }} />
        </div>
      )}
      <BarangayNavbar navbarTitle={barangayName} />
      <div className="container mx-auto px-16 py-8 pt-36">
        <div className="grid grid-cols-12 gap-8">
          {/* Large Announcement Section */}
          <div className="col-span-12 md:col-span-8">
            {latestAnnouncement ? (
              <Link href={`/barangay/announcement-page/${latestAnnouncement.uuid}`} className="cursor-pointer relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={latestAnnouncement.imageUrl}
                  alt={latestAnnouncement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 w-full">
                  <h2 className="text-xl font-bold">{latestAnnouncement.title}</h2>
                  <p className="text-sm">{new Date(latestAnnouncement.date).toLocaleDateString()}</p>
                </div>
              </Link>
            ) : (
              <div className="h-64 md:h-96 bg-gray-200 flex items-center justify-center rounded-lg shadow-lg">
                <p className="text-gray-600">No announcements available</p>
              </div>
            )}
          </div>

          {/* Sidebar Section */}
          <div className="col-span-12 md:col-span-4">
            <h2 className="text-2xl font-bold mb-4">Other Announcements</h2>
            <div className="grid grid-cols-1 gap-4">
              {otherAnnouncements && otherAnnouncements.length > 0 ? (
                otherAnnouncements.map((announcement, index) => (
                  <Link
                    key={index}
                    href={`/barangay/announcement-page/${announcement.uuid}`}
                    className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden flex items-center p-4"
                  >
                    {announcement.imageUrl ? (
                      <img
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        className="w-16 h-16 rounded-lg mr-4 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                        No Image
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {truncateText(announcement.title, 30)}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {new Date(announcement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
                  <p className="text-gray-500">No other announcements available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* In the second page, fetch all the projects  */}
      <div className='min-h-max-content bg-[#05184A]'>
        {/* Barangay Projects Section */}
        <div className="container mx-auto px-16 py-8">
          <h2 className="text-3xl font-bold  mb-6 text-white">Barangay Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barangayProjects.length > 0 ? (
              barangayProjects.map((project, index) => (
                <Link href={`/barangay/project-page/${project.uuid}`} className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={project.images[0] || 'https://via.placeholder.com/640x360'}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-2" dangerouslySetInnerHTML={{ __html: project.description }}/>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-600">No projects available for this barangay.</p>
            )}
          </div>
        </div>
      </div> 

      {/* Transparency Documents Section */}
      <div className="container mx-auto px-16 py-8">
        <h2 className="text-3xl font-bold mb-6 text-slate-900">Transparency Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transparencyDocs.length > 0 ? (
            transparencyDocs.map((doc, index) => (
              <a href={doc.pdfUrl} target='_blank' className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 w-full overflow-hidden">
                  <iframe
                    src={doc.pdfUrl}
                    title={doc.title}
                    className="w-full h-full border-none"
                    allow="fullscreen"
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{doc.title}</h3>
                  <p className="text-gray-600 text-sm mt-2" dangerouslySetInnerHTML={{ __html: doc.description }}></p>
                </div>
              </a>
            ))
          ) : (
            <p className="text-gray-600">No transparency documents available for this barangay.</p>
          )}
        </div>
      </div>


      {/* In the third page list all the Eservices */}
      <div className="py-16 bg-[#05184A]">
        <div className="container mx-auto px-16">
          <h2 className="text-3xl font-bold text-gray-100 mb-10 text-center">E-Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {eServices.map((service, index) => {
            const Icon = icons[service.title] || WorkIcon; // Default to WorkIcon if no match
            return (
              <Link
                key={index}
                href={`/barangay/eservices-page/${service.uuid}`}
                passHref
              >
                <div
                  className="bg-white rounded-lg shadow-md text-center p-4 hover:shadow-xl hover:-translate-y-2 transform transition duration-300 cursor-pointer"
                >
                  <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                    <Icon style={{ fontSize: "2rem", color: "#05184A" }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 text-sm mt-2 h-16 overflow-hidden" dangerouslySetInnerHTML={{__html: service.description}}></p>
                </div>
              </Link>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
