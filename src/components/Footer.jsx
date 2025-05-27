import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
        
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400">H2 Apartments</h2>
          <p className="mt-2 text-gray-400 text-sm">
            Discover modern and affordable apartments across the city. Your next home is just a click away.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <Link to="/" className="text-gray-300 hover:text-pink-400 transition">Home</Link>
          <Link to="/apartments" className="text-gray-300 hover:text-yellow-400 transition">Apartments</Link>
          <Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition">Contact</Link>
          <Link to="/dashboard" className="text-gray-300 hover:text-yellow-400 transition">Dashboard</Link>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400 text-xl transition">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400 text-xl transition">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400 text-xl transition">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400 text-xl transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 mt-6">
        &copy; {new Date().getFullYear()} H2 Apartments. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
