import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  getIdToken,
  updateProfile
} from "firebase/auth";
import auth from "../firebase.init";
import axios from "axios";
import tokenStorage from "../utils/tokenStorage";

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signOutUser = () => {
    setLoading(true);
    tokenStorage.removeToken(); // Remove token on sign out
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Option 1: Get Firebase ID token
        const idToken = await getIdToken(currentUser);

        try {
          // Send ID token or email to your backend to get JWT token
          const { data } = await axios.post("http://localhost:5000/jwt", {
            token: idToken,
            // Or you can send: email: currentUser.email
          });

          tokenStorage.setToken(data.token); // Save JWT in localStorage

          // Optionally attach role fetched from your backend
          currentUser.role = data.role || "user";
        } catch (error) {
          console.error("Failed to get JWT token:", error);
          tokenStorage.removeToken();
        }
      } else {
        // No user signed in
        tokenStorage.removeToken();
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signInWithGoogle,
    signIn,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
