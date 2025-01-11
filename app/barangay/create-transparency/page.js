"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { createTransparencyRecord } from "../../../lib/actions/barangayTransparency";
import uploadFile from "../../../lib/actions/uploadFile";
import fetchUserInfo from "../../../lib/actions/fetchUserInfo";
import dynamic from "next/dynamic";

// Dynamically import React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function CreateTransparencyPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter(); // For navigation

  // Handle PDF upload
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => setPdf(acceptedFiles[0]),
    accept: "application/pdf",
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!title || !description || !pdf) {
      alert("Title, description, and PDF are required!");
      return;
    }

    setIsLoading(true);

    try {
      // Upload the PDF to Firebase Storage
      const pdfUrl = await uploadFile(pdf, "transparency-pdfs");

      // Fetch user information to get barangayId
      const userInfo = await fetchUserInfo();
      const barangayId = userInfo.barangayId;

      // Create the transparency record in Firestore
      const transparencyData = {
        barangayId,
        title,
        description,
        pdfUrl,
      };

      const newRecord = await createTransparencyRecord(transparencyData);
      console.log("Transparency Record Created:", newRecord);

      alert("Transparency record created successfully!");
      router.push("/transparency"); // Navigate to the transparency records page
    } catch (error) {
      console.error("Error creating transparency record:", error.message);
      alert("Failed to create transparency record. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Create Transparency Record</h1>

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="mb-4 bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          Back
        </button>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        {/* Description Editor */}
        <ReactQuill
          value={description}
          onChange={setDescription}
          placeholder="Write the description..."
          className="mb-4"
        />

        {/* PDF Upload */}
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-300 p-4 rounded mb-4 cursor-pointer"
        >
          <input {...getInputProps()} />
          {pdf ? (
            <p className="text-green-500">PDF uploaded: {pdf.name}</p>
          ) : (
            <p>Drag 'n' drop a PDF here, or click to select one.</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full bg-maroon text-white font-semibold py-2 rounded ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-lightMaroon"
          }`}
        >
          {isLoading ? "Submitting..." : "Create Transparency Record"}
        </button>
      </div>
    </div>
  );
}
