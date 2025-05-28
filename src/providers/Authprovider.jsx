import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  getIdToken,
} from "firebase/auth";
import auth from "../firebase.init";
import tokenStorage from "../utils/tokenStorage";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agreement, setAgreement] = useState(null);

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
    setAgreement(null);
    return signOut(auth);
  };

  
  const fetchUserAgreement = async (userId, email) => {
    try {
      const response = await axiosInstance.get(`/agreements`, {
        params: { userId, email }
      });
      
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Failed to fetch agreement:", error);
      return null;
    }
  };

  
  const checkAgreementStatus = (agreement) => {
    return agreement && agreement.status === "accepted";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await getIdToken(currentUser);
          const userAgreement = await fetchUserAgreement(currentUser.uid, currentUser.email);
          const isAgreementAccepted = checkAgreementStatus(userAgreement);
          
          
          const role = isAgreementAccepted ? "member" : "user";

          const { data } = await axiosInstance.post("/jwt", {
            email: currentUser.email,
            uid: currentUser.uid,
            name: currentUser.displayName,
            photoURL: currentUser.photoURL,
            token: idToken,
            role: role,
          });

          if (data.token) {
            tokenStorage.setToken(data.token);
            setUser({
              ...currentUser,
              role: role,
            });
            setAgreement(userAgreement);
          }
        } catch (error) {
          console.error("Auth state error:", error);
          tokenStorage.removeToken();
          setUser({
            ...currentUser,
            role: "user",
          });
          setAgreement(null);
        }
      } else {
        tokenStorage.removeToken();
        setUser(null);
        setAgreement(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  const refreshUserData = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      const userAgreement = await fetchUserAgreement(currentUser.uid, currentUser.email);
      const isAgreementAccepted = checkAgreementStatus(userAgreement);
      const role = isAgreementAccepted ? "member" : "user";

      setUser({
        ...currentUser,
        role: role,
      });
      setAgreement(userAgreement);

      
      const idToken = await getIdToken(currentUser);
      await axiosInstance.post("/jwt", {
        email: currentUser.email,
        uid: currentUser.uid,
        token: idToken,
        role: role,
      });
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    } finally {
      setLoading(false);
    }
  };


  const authInfo = {
    user,
    loading,
    agreement,
    createUser,
    signInWithGoogle,
    signIn,
    signOutUser,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;