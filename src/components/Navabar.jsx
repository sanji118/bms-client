import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignInAlt, FaHome, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../hook/useAuth';
import Logo from './Logo';
import WebsiteName from './WebsiteName';

const Navbar = () => {
    const { user, signOutUser } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const publicNavigation = [
        { name: 'Home', path: '/', icon: <FaHome className="mr-1" /> },
        { name: 'Apartments', path: '/apartments', icon: <FaBuilding className="mr-1" /> },
    ];

    const authenticatedNavigation = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Logout', action: signOutUser },
    ];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeAllMenus = () => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="md:fixed z-50 navbar bg-base-100 shadow-lg">
            <div className="navbar-start">
                {/* Mobile menu button */}
                <div className="dropdown sm:hidden">
                    <button 
                    onClick={toggleMobileMenu}
                    className="btn btn-ghost btn-circle"
                    aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Logo and website name */}
                <Link to="/" className=" normal-case text-xl flex items-center gap-2" onClick={closeAllMenus}>
                    <Logo />
                    <WebsiteName />
                </Link>
            </div>

            {/* Desktop navigation */}
            <div className="navbar-center hidden sm:flex">
                <ul className="menu menu-horizontal px-1">
                    {publicNavigation.map((item) => (
                        <li key={item.name}>
                            <Link 
                                to={item.path} 
                                className="flex items-center border-b-2 border-yellow-500 rounded-b-none mr-5"
                                onClick={closeAllMenus}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Desktop auth section */}
            <div className="navbar-end">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <button 
                            onClick={toggleDropdown}
                            className="btn btn-ghost btn-circle avatar"
                            aria-label="User menu"
                        >
                            <div className="w-10 rounded-full">
                                <img 
                                    src={user.photoURL || 'https://via.placeholder.com/150'} 
                                    alt={user.displayName || 'User'} 
                                />
                            </div>
                        </button>
                        
                        {isDropdownOpen && (
                            <ul className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                                <li className="menu-title">
                                    <span>{user.displayName || 'User'}</span>
                                </li>
                                {authenticatedNavigation.map((item) => (
                                    <li key={item.name || item.path}>
                                        {item.path ? (
                                            <Link 
                                                to={item.path} 
                                                onClick={closeAllMenus}
                                            >
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <button onClick={() => {
                                                item.action();
                                                closeAllMenus();
                                            }}>
                                                {item.name}
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : (
                    <Link 
                        to="/login" 
                        className="btn bg-yellow-500 text-white"
                        onClick={closeAllMenus}
                    >
                        <FaSignInAlt className="mr-2" />
                        Login
                    </Link>
                )}
            </div>

            {/* Mobile menu dropdown */}
            {isMobileMenuOpen && (
                <div className="sm:hidden absolute top-20 left-0 right-0 bg-base-100 shadow-lg z-50">
                    <ul className="menu p-4">
                        {publicNavigation.map((item) => (
                            <li key={item.name}>
                                <Link 
                                    to={item.path} 
                                    className="flex items-center"
                                    onClick={closeAllMenus}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                        
                        {user && (
                            <>
                                <li className="menu-title mt-4">
                                    <span>Account</span>
                                </li>
                                {authenticatedNavigation.map((item) => (
                                    <li key={item.name || item.path}>
                                        {item.path ? (
                                            <Link 
                                                to={item.path} 
                                                onClick={closeAllMenus}
                                            >
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <button onClick={() => {
                                                item.action();
                                                closeAllMenus();
                                            }}>
                                                {item.name}
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </>
                        )}
                    </ul>
                    
                    {!user && (
                        <div className="p-4">
                            <Link 
                                to="/login" 
                                className="btn bg-yellow-500 w-full"
                                onClick={closeAllMenus}
                            >
                                <FaSignInAlt className="mr-2" />
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;