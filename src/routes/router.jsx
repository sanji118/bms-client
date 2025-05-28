import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home/Home";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import ApartmentsList from "../pages/Apartments/ApartmentsList";
import ApartmentDetails from "../pages/Apartments/ApartmentDetails";
import PrivateProvider from "../providers/PrivateProvider";
import UserAnnouncements from "../User/UserAnnouncements";
import MemberProfile from "../member/MemberProfile";
import MakePayment from "../member/MakePayment";
import PaymentHistory from "../member/PaymentHistory";
import MemberAnnouncements from "../member/MemberAnnouncements";
import AdminProfile from "../admin/AdminProfile";
import ManageMembers from "../admin/ManageMembers";
import AgreementRequests from "../admin/AgreementRequests";
import ManageCoupons from "../admin/ManageCoupons";
import MakeAnnouncement from "../admin/MakeAnnouncement";
import DashboardRedirect from "../components/DashboardRedirect";
import DashboardLayout from "../layouts/DashboardLayout";
import MyProfile from "../User/MyProfile";
import Unauthorized from "../components/Unauthorized";
import Coupons from "../components/Coupons";


const apartments = () => fetch('http://localhost:5000/apartments')
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
                element: <ApartmentsList/>,
                loader: apartments
            },
            {
                path: 'apartments/:id',
                element: <ApartmentDetails/>
            },
            {
                path: 'coupons',
                element:<Coupons/>
            },
            {
                path: 'unauthorized',
                element: <Unauthorized/>
            },
            {
                path: 'dashboard',
                element: <DashboardLayout />,
                children: [
                    {
                    index: true,
                    element: <DashboardRedirect />
                    },
                    {
                    path: 'user',
                    element: <PrivateProvider role="user"><Outlet/></PrivateProvider>,
                    children: [
                        { index: true, element: <MyProfile /> },
                        { path: 'profile', element: <MyProfile /> },
                        { path: 'announcements', element: <UserAnnouncements /> },
                    ],
                    },
                    {
                    path: 'member',
                    element: <PrivateProvider role="member"><Outlet/></PrivateProvider>,
                    children: [
                        { index: true, element: <MemberProfile /> },
                        { path: 'profile', element: <MemberProfile /> },
                        { path: 'make-payment', element: <MakePayment /> },
                        { path: 'payment-history', element: <PaymentHistory /> },
                        { path: 'announcements', element: <MemberAnnouncements /> },
                    ],
                    },
                    {
                    path: 'admin',
                    element: <PrivateProvider role="admin"><Outlet/></PrivateProvider>,
                    children: [
                        { index: true, element: <AdminProfile /> },
                        { path: 'profile', element: <AdminProfile /> },
                        { path: 'manage-members', element: <ManageMembers /> },
                        { path: 'make-announcement', element: <MakeAnnouncement /> },
                        { path: 'agreement-requests', element: <AgreementRequests /> },
                        { path: 'manage-coupons', element: <ManageCoupons /> },
                    ],
                    },
                ],
            }
        ]
    }
])