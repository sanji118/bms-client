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
import { getUser } from "../utils/useUser";

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
          const userInfo = { email: currentUser.email };
          const jwtRes = await axiosInstance.post("/jwt", userInfo);

          if (jwtRes.data.token) {
            tokenStorage.setToken(jwtRes.data.token);

            let userData;

            try {
              const userRes = await getUser(currentUser.email);
              userData = userRes;
            } catch (error) {
              if (error.response?.status === 404) {
                // Create new user as default "user"
                const createRes = await axiosInstance.post("/users", {
                  email: currentUser.email,
                  name: currentUser.displayName,
                  role: "user", // default
                  photo: currentUser.photoURL,
                });
                userData = createRes.data;
              } else {
                throw error;
              }
            }

            const fullUser = { ...currentUser, role: userData.role || "user" };
            setUser(fullUser);
          }
        } catch (err) {
          console.error("Auth setup error:", err);
          setUser(null);
          tokenStorage.removeToken();
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        tokenStorage.removeToken();
        setLoading(false);
      }
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
