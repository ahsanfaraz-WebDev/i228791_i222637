import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, CalendarDays, ChevronDown, User, LogOut } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Add background color on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
  ];

  // Ensure user state is valid before generating authLinks
  let authLinks = [];
  if (user) {
    authLinks = [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Create Event", path: "/events/create" },
    ];
  } else {
    authLinks = [
      { name: "Login", path: "/login" },
      { name: "Register", path: "/register" },
    ];
  }

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled ? "bg-white shadow-md py-2" : "bg-black/40 backdrop-blur-sm py-4"
  }`;

  const textColor = isScrolled ? "text-gray-700" : "text-white";
  const textHoverColor = isScrolled
    ? "hover:text-primary-600"
    : "hover:text-primary-300";
  const activeTextColor = isScrolled ? "text-primary-600" : "text-primary-300";

  return (
    <nav className={navbarClasses}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <CalendarDays
              className={`h-8 w-8 ${
                isScrolled ? "text-primary-600" : "text-primary-300"
              }`}
            />
            <span
              className={`font-bold text-xl hidden sm:inline-block ${textColor}`}
            >
              GatherSpace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main navigation links */}
            <div className="flex space-x-6">
              {Array.isArray(navLinks) &&
                navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium transition-colors duration-200 ${
                      location.pathname === link.path
                        ? activeTextColor
                        : `${textColor} ${textHoverColor}`
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>

            {/* Auth navigation */}
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className={`font-medium transition-colors duration-200 ${textColor} ${textHoverColor}`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`${
                      isScrolled
                        ? "btn-primary"
                        : "bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                    }`}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center space-x-2 font-medium focus:outline-none ${textColor} ${textHoverColor}`}
                  >
                    <span>{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    >
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden focus:outline-none ${textColor}`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container-custom py-4 space-y-4">
            {/* Navigation links */}
            <div className="flex flex-col space-y-3">
              {Array.isArray(navLinks) &&
                navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-base font-medium px-2 py-1 rounded ${
                      location.pathname === link.path
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-700 hover:text-primary-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>

            {/* Auth links */}
            <div className="pt-3 border-t border-gray-200 space-y-3">
              {Array.isArray(authLinks) &&
                authLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-base font-medium px-2 py-1 text-gray-700 hover:text-primary-600"
                  >
                    {link.name}
                  </Link>
                ))}

              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-1 text-base font-medium text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
