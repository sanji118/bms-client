import { useContext, useEffect } from "react"
import { AuthContext } from "../providers/Authprovider"

export const useAuth = () => {
    return useContext(AuthContext);
}