import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const registerUser = async ({ email, password, fullName, phoneNumber, address, birthdate, role, barangayId }) => {
  try {
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update the user's display name in Firebase Auth
    await updateProfile(userCredential.user, { displayName: fullName });

    // Save user details in Firestore
    const userDoc = {
      email,
      fullName,
      phoneNumber,
      address, // Includes street, barangay, and city
      birthdate, // Birthdate field
      role, // citizen or barangay_admin
      barangayId, // Reference to barangay collection
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userDoc);

    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default registerUser;
