import { auth } from "../config/firebase";

const getCurrentUser = () => {
  return auth.currentUser;
};

export default getCurrentUser;
