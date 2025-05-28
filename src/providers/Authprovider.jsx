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
import axiosInstance from "../utils/axiosInstance";

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
    tokenStorage.removeToken(); 
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await getIdToken(currentUser);

          const { data } = await axiosInstance.post("/jwt", {
            email: currentUser.email,
            uid: currentUser.uid,
            name: currentUser.displayName,
            photoURL: currentUser.photoURL,
            token: idToken,
          });

          if (data.token) {
            tokenStorage.setToken(data.token);
            setUser({
              ...currentUser,
              role: data.role || 'user', 
            });
          }
        } catch (error) {
          console.error("Failed to get JWT token:", error);
          tokenStorage.removeToken();
          setUser(currentUser); 
        }
      } else {
        tokenStorage.removeToken();
        setUser(null);
      }
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
