import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from './Authprovider';

const PrivateProvider = ({children}) => {
    const {user, loading} = useContext(AuthContext);
    if(loading){
        return <span className="loading loading-spinner loading-md"></span>
    }
    if(user){
        return children;
    }
  return (
    <Navigate to='/login'></Navigate>
  )
}

export default PrivateProvider