import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../store/slices/authSlice';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-3xl font-heading font-bold text-secondary">
              Eclora
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-text hover:text-accent transition-colors duration-300 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-text">Hello, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-text hover:text-accent transition-colors"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center space-x-1 text-text hover:text-accent transition-colors"
              >
                <FiUser size={20} />
                <span>Login</span>
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <FiShoppingCart size={24} className="text-text hover:text-accent transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-text"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-text hover:text-accent transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text hover:text-accent transition-colors"
                >
                  Login / Register
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

