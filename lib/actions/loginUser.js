import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/config/firebase";

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Fetch additional user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) {
      throw new Error("User data not found.");
    }

    return { ...userDoc.data(), uid: userCredential.user.uid };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default loginUser;
