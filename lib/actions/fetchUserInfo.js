import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase"; // Ensure auth and db are initialized correctly

/**
 * Fetch the authenticated user's information, including barangayId.
 * @returns {Object} - User information (fullName, email, barangayId, etc.)
 * @throws {Error} - If no user is authenticated or user document is not found.
 */
const fetchUserInfo = async () => {
  try {
    const user = auth.currentUser; // Ensure auth is correctly imported and initialized

    if (!user) {
      throw new Error("No authenticated user.");
    }

    console.log("Current User in fetchUserInfo:", user);
    const userDoc = doc(db, "users", user.uid); // Adjust "users" to match your collection name
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      throw new Error("User document not found.");
    }

    return userSnapshot.data(); // Return user data
  } catch (error) {
    throw new Error("Failed to fetch user info: " + error.message);
  }
};

export default fetchUserInfo; // Default export
