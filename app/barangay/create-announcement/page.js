"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import ClearIcon from "@mui/icons-material/Clear";
import ImageIcon from "@mui/icons-material/Image";
import { createAnnouncement } from "../../../lib/actions/announcement"; // Import the Firestore function
import uploadFile from '../../../lib/actions/uploadFile'

// Dynamically import React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function CreateAnnouncementPage() {
  const router = useRouter(); // Use Next.js router for navigation

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const barangayId = "123"; // Replace with actual barangay ID from context or props

  // Handle image upload using react-dropzone
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setImage({ file, preview: URL.createObjectURL(file) }); // Save the file and create a preview URL
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: "image/*" });

  // Remove uploaded photo
  const handleRemovePhoto = () => {
    setImage(null);
  };

  // Submit Announcement
  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Title and description are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to Firebase Storage
      let imageUrl = "";
      if (image?.file) {
        imageUrl = await uploadFile(image.file, `announcements/${barangayId}`);
      }

      // Create announcement in Firestore
      const newAnnouncement = {
        barangayId,
        title,
        description,
        date: new Date().toISOString(),
        imageUrl,
      };

      const createdAnnouncement = await createAnnouncement(newAnnouncement);

      console.log("Announcement created successfully:", createdAnnouncement);
      alert("Announcement Created!");
      // router.push("/announcements"); // Navigate to the announcements page
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Left Section */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6 mr-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()} // Navigate to the previous page
          className="mb-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
        >
          Back
        </button>

        <h1 className="text-2xl font-bold mb-4">Add New Announcement</h1>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-maroon"
        />

        {/* Image Upload */}
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-300 p-4 rounded mb-4 cursor-pointer"
        >
          <input {...getInputProps()} />
          {!image ? (
            <div className="flex gap-2">
              <ImageIcon className="text-4xl text-gray-300" />
              <p>Drag 'n' drop an image here, or click to select one.</p>
            </div>
          ) : (
            <p className="text-green-500">Image uploaded successfully!</p>
          )}
        </div>

        {/* React Quill Editor */}
        <ReactQuill
          value={description}
          onChange={setDescription}
          placeholder="Write the announcement description..."
          className="mb-4"
          theme="snow"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-maroon text-white font-semibold py-2 rounded hover:bg-lightMaroon transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish Announcement"}
        </button>
      </div>

      {/* Right Section - Preview */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Preview</h2>

        {/* Title Preview */}
        <h3 className="text-lg font-semibold mb-2">{title || "Announcement Title..."}</h3>

        {/* Image Preview with Remove Button */}
        {image && (
          <div className="relative group mt-4">
            {/* Image */}
            <img src={image.preview} alt="Uploaded Preview" className="w-full rounded" />

            {/* Remove Photo Button */}
            <button
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <ClearIcon />
            </button>
          </div>
        )}

        {/* Description Preview */}
        <div
          className="prose prose-sm prose-gray mt-5"
          dangerouslySetInnerHTML={{ __html: description || "Description will appear here..." }}
        ></div>
      </div>
    </div>
  );
}
