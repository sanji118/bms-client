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
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            if (currentUser) {
              const userInfo = { email: currentUser.email };
              axiosInstance.post('/jwt', userInfo)
                .then(res => {
                  if (res.data.token) {
                    tokenStorage.setToken(res.data.token);
                    setLoading(false);
                  }
                })
            }
            else {
              tokenStorage.removeToken()
              setLoading(false);
            }
            
        });
        return () => {
            return unsubscribe();
        }
    }, [axiosInstance])

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
