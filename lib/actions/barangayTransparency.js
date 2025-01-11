import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

// Firestore collection name
const collectionName = "BarangayTransparency";

/**
 * Create a new transparency record
 * @param {Object} data - Transparency data (barangayId, title, description, pdfUrl)
 * @returns {Object} - Newly created transparency record with ID
 */
export const createTransparencyRecord = async ({ barangayId, title, description, pdfUrl }) => {
  try {
    const transparencyRef = collection(db, collectionName);
    const newRecord = {
      barangayId,
      title,
      description,
      pdfUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(transparencyRef, newRecord);
    return { id: docRef.id, ...newRecord };
  } catch (error) {
    throw new Error("Failed to create transparency record: " + error.message);
  }
};

/**
 * Fetch a specific transparency record by ID
 * @param {string} id - Transparency record ID
 * @returns {Object} - Transparency record data
 */
export const getTransparencyRecord = async (id) => {
  try {
    const transparencyDoc = doc(db, collectionName, id);
    const docSnapshot = await getDoc(transparencyDoc);
    if (!docSnapshot.exists()) {
      throw new Error("Transparency record not found");
    }
    return { id: docSnapshot.id, ...docSnapshot.data() };
  } catch (error) {
    throw new Error("Failed to fetch transparency record: " + error.message);
  }
};

/**
 * Update an existing transparency record
 * @param {string} id - Transparency record ID
 * @param {Object} updates - Fields to update
 * @returns {Object} - Updated transparency record data
 */
export const updateTransparencyRecord = async (id, updates) => {
  try {
    const transparencyDoc = doc(db, collectionName, id);
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(transparencyDoc, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    throw new Error("Failed to update transparency record: " + error.message);
  }
};

/**
 * Delete a transparency record by ID
 * @param {string} id - Transparency record ID
 * @returns {string} - Deleted transparency record ID
 */
export const deleteTransparencyRecord = async (id) => {
  try {
    const transparencyDoc = doc(db, collectionName, id);
    await deleteDoc(transparencyDoc);
    return id;
  } catch (error) {
    throw new Error("Failed to delete transparency record: " + error.message);
  }
};
