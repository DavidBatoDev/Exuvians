import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

// Firestore collection name
const collectionName = "BarangayProjects";

/**
 * Create a new barangay project
 * @param {Object} data - Project data (barangayId, title, description, images, startDate, endDate, status)
 * @returns {Object} - Newly created project with ID
 */
export const createProject = async ({ barangayId, title, description, images = [], startDate, endDate, status }) => {
  try {
    const projectsRef = collection(db, collectionName);
    const newProject = {
      barangayId,
      title,
      description,
      images,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      status: status || "ongoing", // Default status
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(projectsRef, newProject);
    return { id: docRef.id, ...newProject };
  } catch (error) {
    throw new Error("Failed to create project: " + error.message);
  }
};

/**
 * Fetch a specific barangay project by ID
 * @param {string} id - Project ID
 * @returns {Object} - Project data
 */
export const getProject = async (id) => {
  try {
    const projectDoc = doc(db, collectionName, id);
    const docSnapshot = await getDoc(projectDoc);
    if (!docSnapshot.exists()) {
      throw new Error("Project not found");
    }
    return { id: docSnapshot.id, ...docSnapshot.data() };
  } catch (error) {
    throw new Error("Failed to fetch project: " + error.message);
  }
};

/**
 * Update an existing barangay project
 * @param {string} id - Project ID
 * @param {Object} updates - Fields to update
 * @returns {Object} - Updated project data
 */
export const updateProject = async (id, updates) => {
  try {
    const projectDoc = doc(db, collectionName, id);
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(projectDoc, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    throw new Error("Failed to update project: " + error.message);
  }
};

/**
 * Delete a barangay project by ID
 * @param {string} id - Project ID
 * @returns {string} - Deleted project ID
 */
export const deleteProject = async (id) => {
  try {
    const projectDoc = doc(db, collectionName, id);
    await deleteDoc(projectDoc);
    return id;
  } catch (error) {
    throw new Error("Failed to delete project: " + error.message);
  }
};
