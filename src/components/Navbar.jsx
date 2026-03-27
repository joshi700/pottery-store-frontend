import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAdminAuthenticated } = useAdminAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          </div>
        )}
      </div>
    </nav>
  );
}
