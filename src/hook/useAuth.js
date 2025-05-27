import { useContext } from "react"
import { AuthContext } from "../providers/Authprovider"

export const useAuth = () => {
    return useContext(AuthContext);
}