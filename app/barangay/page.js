"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ConstructionIcon from "@mui/icons-material/Construction";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import dynamic from "next/dynamic";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import fetchUserInfo from "@/lib/actions/fetchUserInfo";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../../lib/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { createEService, updateEService } from "../../lib/actions/baragayEServices";
import { deleteTransparencyRecord } from "../../lib/actions/barangayTransparency";

// Dynamically import React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [eServices, setEServices] = useState([]);
  const [transparencyRecords, setTransparencyRecords] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [link, setLink] = useState("");
  const router = useRouter();

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setTitle(service.title);
      setDescription(service.description);
    } else {
      setEditingService(null);
      setTitle("");
      setDescription("");
    }
    setOpenModal(true);
  };
  

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);

        // Fetch data only if the user is authenticated
        const fetchData = async () => {
          try {
            const userInfo = await fetchUserInfo();
            const userBarangayId = userInfo.barangayId;

            // Fetch announcements
            const announcementsRef = collection(db, "BarangayAnnouncements");
            const announcementsQuery = query(
              announcementsRef,
              where("barangayId", "==", userBarangayId)
            );

            onSnapshot(announcementsQuery, (snapshot) => {
              const fetchedAnnouncements = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setAnnouncements(fetchedAnnouncements);
            });

            // Fetch projects
            const projectsRef = collection(db, "BarangayProjects");
            const projectsQuery = query(
              projectsRef,
              where("barangayId", "==", userBarangayId)
            );

            onSnapshot(projectsQuery, (snapshot) => {
              const fetchedProjects = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setProjects(fetchedProjects);
            });

            // Fetch e-services
            const eServicesRef = collection(db, "BarangayEServices");
            const eServicesQuery = query(
              eServicesRef,
              where("barangayId", "==", userBarangayId)
            );

            onSnapshot(eServicesQuery, (snapshot) => {
              const fetchedEServices = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setEServices(fetchedEServices);
            });

            // Fetch transparency records
            const transparencyRef = collection(db, "BarangayTransparency");
            const transparencyQuery = query(
              transparencyRef,
              where("barangayId", "==", userBarangayId)
            );

            onSnapshot(transparencyQuery, (snapshot) => {
              const fetchedTransparencyRecords = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setTransparencyRecords(fetchedTransparencyRecords);
            });

          } catch (error) {
            console.error("Error fetching data:", error.message);
          }
        };

        fetchData();
      } else {
        setIsAuthenticated(false);
        router.push("/login");
      }
    });

    return () => {
      unsubscribeAuth(); // Cleanup listener
    };
  }, [router]);

  const handleCloseModal = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setOpenModal(false);
  };

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setLink("");
    setOpenModal(true);
  };
  
  

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
      action: handleOpenCreateModal,
      icon: <BuildCircleIcon fontSize="large" className="text-maroon" />,
    },
    {
      title: "Create Transparency Record",
      description: "Add transparency-related documents.",
      link: "/barangay/create-transparency",
      icon: <DescriptionIcon fontSize="large" className="text-maroon" />,
    },
  ];

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => {
              if (card.link) {
                router.push(card.link);
              } else if (card.action) {
                card.action();
              }
            }}
            className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="flex items-center justify-center mb-4">{card.icon}</div>
            <h2 className="text-xl font-bold mb-2 text-maroon text-center">{card.title}</h2>
            <p className="text-gray-600 text-center">{card.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Link href={`/barangay/update-announcement/${announcement.id}`} key={announcement.id} className="bg-white shadow-lg rounded-lg">
              {announcement.imageUrl && (
                <img
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
              )}
              <div className="p-3">
                <h3 className="text-lg font-bold mb-2">{announcement.title}</h3>
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: announcement.description }}
                ></div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No announcements available.</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link href={`/barangay/update-project/${project.id}`}  className="bg-white shadow-lg rounded-lg">
              {project.images?.[0] && (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
              )}
              <div className="p-3">
                <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                ></div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No projects available.</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">E-Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {eServices.length > 0 ? (
          eServices.map((service) => (
            <div key={service.id} className="bg-white shadow-lg rounded-lg">
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                {/* dangerous html description */}
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                ></div>
                {service.link && (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-maroon font-semibold underline mt-2 inline-block"
                  >
                    Visit Service
                  </a>
                )}
                <button
                  onClick={() => handleOpenModal(service)}
                  className="text-maroon font-semibold underline mt-2 inline-block"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No e-services available.</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Transparency Records</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {transparencyRecords.length > 0 ? (
          transparencyRecords.map((record) => (
            <div key={record.id} className="bg-white shadow-lg rounded-lg">
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{record.title}</h3>
                {/* dangerous html description */}
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: record.description }}
                ></div>
                {record.pdfUrl && (
                  <a
                    href={record.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-maroon font-semibold underline mt-2 inline-block"
                  >
                    View PDF
                  </a>
                )}
            <button
              onClick={async () => {
                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this transparency record?"
                );
                if (confirmDelete) {
                  try {
                    await deleteTransparencyRecord(record.id);
                    alert("Transparency record deleted successfully!");
                    // State update to reflect deletion
                    setTransparencyRecords((prev) =>
                      prev.filter((item) => item.id !== record.id)
                    );
                  } catch (error) {
                    console.error("Error deleting record:", error.message);
                    alert("Failed to delete record. Please try again.");
                  }
                }
              }}
              className="text-red-500 font-semibold underline mt-2 inline-block ml-4"
            >
              Delete
            </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No transparency records available.</p>
        )}
      </div>


      {/* Material UI Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography
            id="modal-title"
            variant="h5"
            component="h2"
            className="text-maroon text-center font-semibold mb-4"
          >
            Create E-Service
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              id="e-service-title"
              label="E-Service Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Typography variant="body1" className="mb-2 text-gray-600 font-medium">
              Description (Markdown Supported)
            </Typography>
            <ReactQuill
              value={description}
              onChange={setDescription}
              placeholder="Write the description here..."
              theme="snow"
              className="mb-4"
            />
              <TextField
                id="e-service-link"
                label="E-Service Link"
                variant="outlined"
                fullWidth
                margin="normal"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            <Button
                onClick={async () => {
                  if (editingService) {
                    // Update functionality (already implemented above)
                    const updates = { title, description, link };
                    await updateEService(editingService.id, updates);
                    
                    handleCloseModal();
                  } else {
                    // Create functionality
                    try {
                      const userInfo = await fetchUserInfo();
                      const newEService = {
                        barangayId: userInfo.barangayId,
                        title,
                        description,
                        link,
                      };
                      await createEService(newEService);
                      alert("E-service created successfully!");
                      handleCloseModal();
                    } catch (error) {
                      console.error("Error creating E-service:", error.message);
                      alert("Failed to create E-service. Please try again.");
                    }
                  }
                }}
              variant="contained"
              color="secondary"
              fullWidth
              sx={{
                backgroundColor: "#800000",
                "&:hover": { backgroundColor: "#990000" },
                fontWeight: "bold",
                color: "white",
              }}
            >
              {editingService ? "UPDATE" : "CREATE"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
