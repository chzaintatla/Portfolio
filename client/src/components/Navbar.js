import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logoImage from '../logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin, isEmployee, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full overflow-x-hidden ${
        scrolled ? 'bg-[#0a192f]/90 backdrop-blur-md border-b border-blue-500/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center space-x-3"
            >
              <img 
                src={logoImage} 
                alt="SparkWave Digital" 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x50/1e2d4a/ffffff?text=SparkWave';
                  e.target.onerror = null;
                }}
                className="h-12 w-auto object-contain" 
              />
              <span className="text-xl font-black text-white tracking-widest uppercase hidden lg:block italic">SparkWave <span className="text-blue-500">Digitals</span></span>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['About', 'Skills', 'Projects', 'Services', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-gray-400 hover:text-white font-medium transition-colors text-sm uppercase tracking-widest"
              >
                {item}
              </button>
            ))}
            <Link
              to="/blog"
              className="text-gray-400 hover:text-white font-medium transition-colors text-sm uppercase tracking-widest"
            >
              BLOG
            </Link>

            {/* Auth Dependent Buttons */}
            {(isAdmin || isEmployee) ? (
              <div className="flex items-center gap-4 border-l border-blue-500/20 pl-6">
                <Link
                  to="/admin"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-black transition-all hover:scale-105 shadow-lg shadow-blue-500/30 text-[10px] uppercase tracking-widest"
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-500 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => scrollToSection('meeting')}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20 text-sm"
              >
                Book Call
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-500 transition-colors"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#112240] border-t border-blue-500/10 h-screen">
          <div className="px-6 pt-10 pb-4 space-y-4">
            {['About', 'Skills', 'Projects', 'Services', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="block w-full text-left text-2xl font-bold text-gray-300 hover:text-white transition-colors py-2"
              >
                {item}
              </button>
            ))}
            <Link
              to="/blog"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left text-2xl font-bold text-gray-300 hover:text-white transition-colors py-2"
            >
              Blog
            </Link>
            <div className="pt-6 border-t border-blue-500/10">
              {(isAdmin || isEmployee) ? (
                <>
                  <Link 
                    to="/admin" 
                    onClick={() => setIsOpen(false)}
                    className="block text-2xl font-bold text-blue-500 mb-4"
                  >
                    Admin Dashboard
                  </Link>
                  <button onClick={signOut} className="text-2xl font-bold text-red-500">Sign Out</button>
                </>
              ) : (
                <button
                  onClick={() => scrollToSection('meeting')}
                  className="text-2xl font-bold text-blue-500"
                >
                  Book Strategy Call
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
