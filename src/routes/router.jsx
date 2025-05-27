import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home/Home";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import ApartmentsList from "../pages/Apartments/ApartmentsList";
import ApartmentDetails from "../pages/Apartments/ApartmentDetails";
import PrivateProvider from "../providers/PrivateProvider";
import UserDashboard from "../pages/Dashboard/UserDashboard";
import MemberDashboard from "../pages/Dashboard/MemberDashboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<MainLayout/>,
        errorElement: <NotFound/>,
        children:[
            {
                index: true,
                element:<Home></Home>
            },
            {
                path: 'login',
                element: <Login></Login>
            },
            {
                path: 'register',
                element: <Register/>
            },
            {
                path: "apartments",
                element: <ApartmentsList/>
            },
            {
                path: 'apartments/:id',
                element: <ApartmentDetails/>
            },
            {
                path: 'dashboard/user',
                element:(<PrivateProvider role='user'>
                    <UserDashboard/>
                </PrivateProvider>)
            },
            {
                path: 'dashboard/member',
                element: (
                    <PrivateProvider role='member' >
                        <MemberDashboard/>
                    </PrivateProvider>
                )
            },
            {
                path: 'dashboard/admin',
                element: (
                    <PrivateProvider role ='admin'>
                        <AdminDashboard/>
                    </PrivateProvider>
                )
            }
        ]
    }
])