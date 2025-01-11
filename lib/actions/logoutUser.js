import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const logoutUser = async () => {
  try {
    await signOut(auth);
    return "User logged out successfully";
  } catch (error) {
    throw new Error(error.message);
  }
};

export default logoutUser;
