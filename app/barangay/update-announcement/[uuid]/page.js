"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ClearIcon from "@mui/icons-material/Clear";
import ImageIcon from "@mui/icons-material/Image";
import { useDropzone } from "react-dropzone";
import {
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../../../lib/actions/announcement"; // Adjust the import path
import uploadFile from "../../../../lib/actions/uploadFile";

// Dynamically import React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function UpdateAnnouncementPage({ params }) {
  const router = useRouter();
  const { uuid } = params; // Extract uuid from params

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImage({ file, preview: URL.createObjectURL(file) });
      }
    },
    accept: "image/*",
  });

  useEffect(() => {
    // Fetch the existing announcement data
    const fetchAnnouncement = async () => {
      try {
        const announcement = await getAnnouncement(uuid);
        setTitle(announcement.title);
        setDescription(announcement.description);
        if (announcement.imageUrl) {
          setImage({ preview: announcement.imageUrl }); // Set existing image preview
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
        alert("Failed to fetch announcement data.");
        router.push("/barangay"); // Redirect back if fetching fails
      }
    };

    if (uuid) {
      fetchAnnouncement();
    }
  }, [uuid, router]);

  const handleRemovePhoto = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Title and description are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = image?.preview || "";
      if (image?.file) {
        imageUrl = await uploadFile(image.file, `announcements/${uuid}`);
      }

      const updates = {
        title,
        description,
        imageUrl,
      };

      await updateAnnouncement(uuid, updates);
      alert("Announcement Updated!");
      router.push("/barangay"); // Redirect to the announcements page
    } catch (error) {
      console.error("Error updating announcement:", error);
      alert("Failed to update announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      await deleteAnnouncement(uuid);
      alert("Announcement Deleted!");
      router.push("/barangay");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Left Section */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6 mr-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
        >
          Back
        </button>

        <h1 className="text-2xl font-bold mb-4">Update Announcement</h1>

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
          {isSubmitting ? "Updating..." : "Update Announcement"}
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 mt-4 transition"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Announcement"}
        </button>
      </div>

      {/* Right Section - Preview */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <h3 className="text-lg font-semibold mb-2">{title || "Announcement Title..."}</h3>
        {image && (
          <div className="relative group mt-4">
            <img src={image.preview} alt="Uploaded Preview" className="w-full rounded" />
            <button
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <ClearIcon />
            </button>
          </div>
        )}
        <div
          className="prose prose-sm prose-gray mt-5"
          dangerouslySetInnerHTML={{ __html: description || "Description will appear here..." }}
        ></div>
      </div>
    </div>
  );
}
