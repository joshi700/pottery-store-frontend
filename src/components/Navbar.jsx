import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-display font-bold text-pottery-700">
            Pottery
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-pottery-800 hover:text-pottery-600 transition">
              Home
            </Link>
            <Link to="/shop" className="text-pottery-800 hover:text-pottery-600 transition">
              Shop
            </Link>
            <Link to="/about" className="text-pottery-800 hover:text-pottery-600 transition">
              About
            </Link>
            <Link to="/contact" className="text-pottery-800 hover:text-pottery-600 transition">
              Contact
            </Link>
            {isAdminAuthenticated && (
              <Link to="/admin" className="text-pottery-600 hover:text-pottery-700 font-semibold transition">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-pottery-800 hover:text-pottery-600 transition"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pottery-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="p-2 text-pottery-800 hover:text-pottery-600 transition"
                >
                  <User size={24} />
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-pottery-100">
                      <p className="text-sm font-semibold text-pottery-800">{user?.name}</p>
                      <p className="text-xs text-pottery-600">{user?.email}</p>
                    </div>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-sm text-pottery-800 hover:bg-pottery-50"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 bg-pottery-600 text-white rounded-lg hover:bg-pottery-700 transition"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-pottery-800"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              className="block py-2 text-pottery-800 hover:text-pottery-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block py-2 text-pottery-800 hover:text-pottery-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="block py-2 text-pottery-800 hover:text-pottery-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-pottery-800 hover:text-pottery-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isAdminAuthenticated && (
              <Link
                to="/admin"
                className="block py-2 text-pottery-600 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block py-2 text-pottery-600 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
