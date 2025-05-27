import { createContext, useEffect, useState } from "react"
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import auth from "../firebase.init";
import axios from "axios";

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();


const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] =useState(true);


  
  const createUser = (email, password) =>{
    setLoading(true);
    return(
      createUserWithEmailAndPassword(auth, email, password)
    )
  }

  const signIn = (email, password) =>{
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () =>{
    setLoading(true);
    return signInWithPopup(auth, googleProvider)
  }

  const signOutUser =()=>{
    setLoading(true);
    return signOut(auth);
  }

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, async(currentUser) =>{
      if(currentUser){
        const res = await axios.get(`http://localhost:5000/users/${currentUser.email}`);
        const UserData = await res.data;
        currentUser.role = UserData?.role || 'user';
      }
      setUser(currentUser);
      setLoading(false);
    })
    return()=>{
      unsubscribe()
    }
  }, [])

  const authInfo = {
    user, 
    loading,
    createUser,
    signInWithGoogle,
    signIn,
    signOutUser
  }

  return(
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;