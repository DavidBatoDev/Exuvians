import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const registerUser = async (email, password, displayName, role, barangayId) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update the display name
    await updateProfile(userCredential.user, { displayName });

    // Save user details to Firestore
    const userDoc = {
      email,
      displayName,
      role, // "citizen" or "barangay_official"
      barangayId,
      createdAt: new Date(),
      updatedAt: new Date(),
      inquiries: role === "citizen" ? [] : null, // For citizens
      managedUpdates: role === "barangay_official" ? [] : null, // For officials
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userDoc);

    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default registerUser;
