import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return "Password reset email sent.";
  } catch (error) {
    throw new Error(error.message);
  }
};

export default resetPassword;
