"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {
  getProject,
  updateProject,
  deleteProject,
} from "../../../../lib/actions/baragayProjects";
import uploadFile from "../../../../lib/actions/uploadFile";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Dynamically import React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function UpdateProjectPage({ params }) {
  const { uuid } = params; // Access the dynamic route parameter
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Fetch the existing project data
    const fetchProject = async () => {
      try {
        const project = await getProject(uuid);
        setTitle(project.title);
        setDescription(project.description);
        setExistingImages(project.images || []);
      } catch (error) {
        console.error("Error fetching project:", error);
        alert("Failed to fetch project data.");
        router.push("/barangay");
      }
    };

    if (uuid) {
      fetchProject();
    }
  }, [uuid, router]);

  // Handle image upload
  const onDrop = (acceptedFiles) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: "image/*" });

  // Remove an image from the list
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Remove an existing image
  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Title and description are required!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload new images
      const uploadedImages = await Promise.all(
        images.map((file) => uploadFile(file, "barangay-projects"))
      );

      const updatedData = {
        title,
        description,
        images: [...existingImages, ...uploadedImages],
      };

      await updateProject(uuid, updatedData);
      alert("Project updated successfully!");
      router.push("/barangay");
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      await deleteProject(uuid);
      alert("Project deleted successfully!");
      router.push("/barangay");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Left Section */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6 mr-6">
        <h1 className="text-2xl font-bold mb-4">Update Project</h1>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
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
          disabled={isSubmitting}
          className={`w-full text-white font-semibold py-2 rounded ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-maroon hover:bg-lightMaroon transition"
          }`}
        >
          {isSubmitting ? "Updating..." : "Update Project"}
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`w-full mt-4 text-white font-semibold py-2 rounded ${
            isDeleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isDeleting ? "Deleting..." : "Delete Project"}
        </button>
      </div>

      {/* Right Section - Preview */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Preview</h2>

        {/* Swiper Image Preview */}
        <div className="w-full h-[300px] lg:max-w-xl bg-gray-200 rounded-lg overflow-hidden mb-4">
          {(existingImages.length > 0 || images.length > 0) ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="w-full h-full"
            >
              {existingImages.map((url, index) => (
                <SwiperSlide key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Existing Image ${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <IconButton
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-5 right-3 bg-red-500 text-white rounded-full"
                  >
                    <CloseIcon />
                  </IconButton>
                </SwiperSlide>
              ))}
              {images.map((file, index) => (
                <SwiperSlide key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-5 right-3 bg-red-500 text-white rounded-full"
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
