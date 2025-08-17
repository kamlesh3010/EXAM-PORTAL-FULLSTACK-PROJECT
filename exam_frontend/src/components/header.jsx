import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/usercontext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Scroll listener
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);
      setIsVisible(currentY < lastScrollY || currentY < 10);
      lastScrollY = currentY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleLoginDropdown = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
  };

  const handleLogout = () => {
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
    >
      <div className="max-w-screen-xl mx-auto flex justify-between items-center py-4 px-6 md:px-20 text-white">
        {/* Logo */}
        <Link to="/" className="text-4xl lg:text-5xl font-semibold tracking-wide text-orange-400">
          Exam Portal
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/check-exam" className="hover:text-orange-300 uppercase text-sm tracking-wider transition">
            Exam-Detail
          </Link>
          <Link to="/user/result-marksheet" className="hover:text-orange-300 uppercase text-sm tracking-wider transition">
            Result
          </Link>
          <Link to="/about" className="hover:text-orange-300 uppercase text-sm tracking-wider transition">
            About
          </Link>
          <Link to="/profile" className="hover:text-orange-300 uppercase text-sm tracking-wider transition">
            Profile
          </Link>
        </nav>

        {/* User / Signin Desktop */}
        <div className="hidden md:block relative">
          {user ? (
            <>
              <button
                onClick={toggleDropdown}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2.5 rounded-full shadow-lg hover:opacity-90 transition"
              >
                👤 {user.name}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={toggleLoginDropdown}
                className="bg-white text-black px-6 py-2.5 rounded-full font-medium shadow-lg hover:bg-orange-400 hover:text-white transition"
              >
                Sign In
              </button>
              {isLoginDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-48 z-50">
                  <Link
                    to="/login"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/adminlogin"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Staff Login
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white text-3xl p-2"
          aria-label="Toggle Menu"
        >
          <i className="bx bx-menu" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="bg-black md:hidden px-6 py-5">
          <nav className="flex flex-col gap-4 text-white items-start">
            <Link to="/" className="uppercase text-sm tracking-wide hover:text-orange-300" onClick={toggleMobileMenu}>
              Exam-Detail
            </Link>
            <Link to="/result" className="uppercase text-sm tracking-wide hover:text-orange-300" onClick={toggleMobileMenu}>
              Result
            </Link>
            <Link to="/about" className="uppercase text-sm tracking-wide hover:text-orange-300" onClick={toggleMobileMenu}>
              About
            </Link>
            <Link to="/profile" className="uppercase text-sm tracking-wide hover:text-orange-300" onClick={toggleMobileMenu}>
              Profile
            </Link>
            {user ? (
              <>
                <span className="bg-white text-black px-5 py-2 rounded-full font-medium mt-2">
                  👤 {user.name}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="mt-3 bg-red-600 px-5 py-2 rounded-full text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMobileMenu}>
                  <button className="mt-2 bg-white text-black px-5 py-2 rounded-full hover:bg-orange-400 hover:text-white transition">
                    Student Login
                  </button>
                </Link>
                <Link to="/adminlogin" onClick={toggleMobileMenu}>
                  <button className="mt-2 bg-white text-black px-5 py-2 rounded-full hover:bg-orange-400 hover:text-white transition">
                    Staff Login
                  </button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
