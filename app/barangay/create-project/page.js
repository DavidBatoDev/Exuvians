"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { createProject } from "../../../lib/actions/baragayProjects"
import uploadFile from "../../../lib/actions/uploadFile"

// Dynamically import React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// Register Swiper modules
SwiperCore.use([Navigation, Pagination]);

export default function CreateProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter(); // Next.js router for navigation

  // Handle image upload
  const onDrop = (acceptedFiles) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: "image/*" });

  // Remove an image from the list
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Title and description are required!");
      return;
    }

    setIsLoading(true);

    try {
      // Upload images and get their URLs
      const imageUrls = await Promise.all(
        images.map((file) => uploadFile(file, "barangay-projects"))
      );

      // Create the project in Firestore
      const projectData = {
        barangayId: "sampleBarangayId", // Replace with actual barangayId
        title,
        description,
        images: imageUrls,
        startDate: new Date(), // Adjust startDate if needed
        endDate: null,
        status: "ongoing", // Default status
      };

      const newProject = await createProject(projectData);
      console.log("Project created:", newProject);

      alert("Project created successfully!");
      router.push("/projects"); // Redirect to projects page or any other page
    } catch (error) {
      console.error("Error creating project:", error.message);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back(); // Navigates to the previous page
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Left Section */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6 mr-6">
        <h1 className="text-2xl font-bold mb-4">Create New Project</h1>

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="mb-4 text-gray-700 font-semibold bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Back
        </button>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter project title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-maroon"
        />

        {/* React Quill Editor */}
        <ReactQuill
          value={description}
          onChange={setDescription}
          placeholder="Write the project description..."
          className="mb-4"
          theme="snow"
        />

        {/* Image Upload */}
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-300 p-4 rounded mb-4 cursor-pointer"
        >
          <input {...getInputProps()} />
          <p>Drag 'n' drop images here, or click to select files.</p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full text-white font-semibold py-2 rounded ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-maroon hover:bg-lightMaroon transition"
          }`}
        >
          {isLoading ? "Creating..." : "Publish Project"}
        </button>
      </div>

      {/* Right Section - Preview */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Preview</h2>

        {/* Swiper Image Preview */}
        <div className="w-full h-[300px] lg:max-w-xl bg-gray-200 rounded-lg overflow-hidden mb-4">
          {images.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="w-full h-full"
            >
              {images.map((file, index) => (
                <SwiperSlide key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 left-2 bg-white bg-opacity-50 group-hover:bg-opacity-100"
                  >
                    <CloseIcon />
                  </IconButton>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-gray-500 text-center">No images uploaded</p>
          )}
        </div>

        {/* Title Preview */}
        <h3 className="text-lg font-semibold mb-2">{title || "Project Title"}</h3>

        {/* Description Preview */}
        <div
          className="prose prose-sm prose-gray mb-4"
          dangerouslySetInnerHTML={{ __html: description || "Description will appear here..." }}
        ></div>
      </div>
    </div>
  );
}
