"use client";

import React, { useState } from "react";
import Link from "next/link";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ConstructionIcon from "@mui/icons-material/Construction";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import dynamic from "next/dynamic";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import { fetchUserInfo } from "../../../lib/actions/fetchUserInfo";

// Dynamically import React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    try {
      const userInfo = await fetchUserInfo(); // Fetch user data
      const barangayId = userInfo.barangayId;

      const newEService = await createEService({
        barangayId,
        title,
        description,
        link,
      });
      console.log("E-Service Created:", newEService);
      alert("E-Service successfully created!");
      handleCloseModal();
    } catch (error) {
      console.error("Error creating E-Service:", error.message);
      alert("Failed to create E-Service. Please try again.");
    }
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
      action: handleOpenModal, // Open the modal for this card
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.action || (() => {})}
            className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="flex items-center justify-center mb-4">{card.icon}</div>
            <h2 className="text-xl font-bold mb-2 text-maroon text-center">{card.title}</h2>
            <p className="text-gray-600 text-center">{card.description}</p>
          </div>
        ))}
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

          {/* E-Service Form */}
          <Box component="form" noValidate autoComplete="off">
            {/* E-Service Title */}
            <TextField
              id="e-service-title"
              label="E-Service Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Description with Markdown Support */}
            <Typography
              variant="body1"
              className="mb-2 text-gray-600 font-medium"
            >
              Description (Markdown Supported)
            </Typography>
            <ReactQuill
              value={description}
              onChange={setDescription}
              placeholder="Write the description here..."
              theme="snow"
              className="mb-4"
            />

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
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
              CREATE
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
