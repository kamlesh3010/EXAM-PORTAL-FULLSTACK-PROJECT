import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/usercontext";

const AdminHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setUser(null);
    setIsDropdownOpen(false);
    navigate("/adminlogin");
  };

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center py-6 px-4 lg:px-20 z-50 text-white bg-black">
      {/* Logo */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-4xl lg:text-5xl font-light tracking-wide"
      >
        Exam Portal
      </button>

      {/* Desktop - Admin Info */}
      <div className="hidden md:block relative">
        {user && user.role === "admin" && (
          <>
            <button
              onClick={toggleDropdown}
              className="bg-white text-black py-2.5 px-6 rounded-full font-medium shadow-md"
            >
              👨‍💼 {user.name}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-white text-3xl p-2"
        aria-label="Toggle Menu"
      >
        <i className="bx bx-menu"></i>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black p-6 md:hidden z-50">
          <nav className="flex flex-col gap-6 items-center text-white">
            <button
              onClick={() => {
                navigate("/dashboard");
                toggleMobileMenu();
              }}
              className="uppercase text-sm tracking-wider hover:text-orange-300"
            >
              Dashboard
            </button>
            {user && user.role === "admin" && (
              <>
                <span className="bg-white text-black px-5 py-2 rounded-full">
                  👨‍💼 {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="mt-2 bg-red-600 px-5 py-2 rounded-full text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
