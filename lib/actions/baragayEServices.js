import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

// Firestore collection name
const collectionName = "BarangayEServices";

/**
 * Create a new e-service
 * @param {Object} data - E-service data (barangayId, title, description, link)
 * @returns {Object} - Newly created e-service with ID
 */
export const createEService = async ({ barangayId, title, description, link }) => {
  try {
    const eServicesRef = collection(db, collectionName);
    const newEService = {
      barangayId,
      title,
      description,
      link,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(eServicesRef, newEService);
    return { id: docRef.id, ...newEService };
  } catch (error) {
    throw new Error("Failed to create e-service: " + error.message);
  }
};

/**
 * Fetch a specific e-service by ID
 * @param {string} id - E-service ID
 * @returns {Object} - E-service data
 */
export const getEService = async (id) => {
  try {
    const eServiceDoc = doc(db, collectionName, id);
    const docSnapshot = await getDoc(eServiceDoc);
    if (!docSnapshot.exists()) {
      throw new Error("E-service not found");
    }
    return { id: docSnapshot.id, ...docSnapshot.data() };
  } catch (error) {
    throw new Error("Failed to fetch e-service: " + error.message);
  }
};

/**
 * Update an existing e-service
 * @param {string} id - E-service ID
 * @param {Object} updates - Fields to update
 * @returns {Object} - Updated e-service data
 */
export const updateEService = async (id, updates) => {
  try {
    const eServiceDoc = doc(db, collectionName, id);
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(eServiceDoc, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    throw new Error("Failed to update e-service: " + error.message);
  }
};

/**
 * Delete an e-service by ID
 * @param {string} id - E-service ID
 * @returns {string} - Deleted e-service ID
 */
export const deleteEService = async (id) => {
  try {
    const eServiceDoc = doc(db, collectionName, id);
    await deleteDoc(eServiceDoc);
    return id;
  } catch (error) {
    throw new Error("Failed to delete e-service: " + error.message);
  }
};
