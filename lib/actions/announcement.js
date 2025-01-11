import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/config/firebase";

// Firestore collection name
const collectionName = "BarangayAnnouncements";

/**
 * Create a new announcement
 * @param {Object} data - Announcement data (barangayId, title, description, date, imageUrl)
 * @returns {Object} - Newly created announcement with ID
 */
export const createAnnouncement = async ({ barangayId, title, description, date, imageUrl }) => {
  try {
    const announcementRef = collection(db, collectionName);
    const newAnnouncement = {
      barangayId,
      title,
      description,
      date,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(announcementRef, newAnnouncement);
    return { id: docRef.id, ...newAnnouncement };
  } catch (error) {
    throw new Error("Failed to create announcement: " + error.message);
  }
};

/**
 * Fetch a specific announcement by ID
 * @param {string} id - Announcement ID
 * @returns {Object} - Announcement data
 */
export const getAnnouncement = async (id) => {
  try {
    const announcementDoc = doc(db, collectionName, id);
    const docSnapshot = await getDoc(announcementDoc);
    if (!docSnapshot.exists()) {
      throw new Error("Announcement not found");
    }
    return { id: docSnapshot.id, ...docSnapshot.data() };
  } catch (error) {
    throw new Error("Failed to fetch announcement: " + error.message);
  }
};

/**
 * Update an existing announcement
 * @param {string} id - Announcement ID
 * @param {Object} updates - Fields to update
 * @returns {Object} - Updated announcement data
 */
export const updateAnnouncement = async (id, updates) => {
  try {
    const announcementDoc = doc(db, collectionName, id);
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(announcementDoc, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    throw new Error("Failed to update announcement: " + error.message);
  }
};

/**
 * Delete an announcement by ID
 * @param {string} id - Announcement ID
 * @returns {string} - Deleted announcement ID
 */
export const deleteAnnouncement = async (id) => {
  try {
    const announcementDoc = doc(db, collectionName, id);
    await deleteDoc(announcementDoc);
    return id;
  } catch (error) {
    throw new Error("Failed to delete announcement: " + error.message);
  }
};
