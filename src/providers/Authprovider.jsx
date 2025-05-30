import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import auth from "../firebase.init";
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
        const token = tokenStorage.getToken();
        if (token) {
          try {
            // Verify token expiration
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            setUser(currentUser);
          } catch (err) {
            if (err.name === 'TokenExpiredError') {
              // Handle token refresh here
              const newToken = await refreshToken(currentUser.email);
              tokenStorage.setToken(newToken);
            }
          }
        }
      }
      setLoading(false);
    });
    return unsubscribe;
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
