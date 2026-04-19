import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Header = ({ user, onLogout }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isSticky, setIsSticky] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showDisastersDropdown, setShowDisastersDropdown] = useState(false);
  const location = useLocation();
  
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    school: user?.school || '',
    region: user?.region || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setMessage('✅ Profile updated successfully!');
        setTimeout(() => {
          setShowProfileModal(false);
          window.location.reload();
        }, 1500);
      } else {
        setMessage('❌ Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('❌ Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header 
        className={`bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg transition-all duration-300 ${
          isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-2xl' : 'relative'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <Link 
              to="/" 
              onClick={() => scrollToSection('home')}
              className="text-white font-black text-3xl tracking-tight hover:scale-105 transition-transform duration-200"
            >
              🛡️ PrepSafe
            </Link>
            
            {/* Navigation Menu */}
            <ul className="flex gap-8 items-center font-semibold">
              {/* Home */}
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className={`text-white hover:text-yellow-300 transition-all duration-200 flex items-center gap-2 ${
                    activeSection === 'home' ? 'text-yellow-300 border-b-2 border-yellow-300' : ''
                  }`}
                >
                  🏠 Home
                </button>
              </li>

              {/* Features Dropdown */}
              <li 
                className="relative"
                onMouseEnter={() => setShowFeaturesDropdown(true)}
                onMouseLeave={() => setShowFeaturesDropdown(false)}
              >
                <button
                  onClick={() => scrollToSection('features')}
                  className={`text-white hover:text-yellow-300 transition-all duration-200 flex items-center gap-2 ${
                    activeSection === 'features' ? 'text-yellow-300 border-b-2 border-yellow-300' : ''
                  }`}
                >
                  ⭐ Features
                </button>
                {showFeaturesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[200px] z-50"
                  >
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      📚 Learning Modules
                    </Link>
                    <Link to="/drills" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      🎮 Virtual Drills
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      🚨 Emergency Alerts
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      📊 Dashboard
                    </Link>
                  </motion.div>
                )}
              </li>

              {/* Disasters Dropdown */}
              <li 
                className="relative"
                onMouseEnter={() => setShowDisastersDropdown(true)}
                onMouseLeave={() => setShowDisastersDropdown(false)}
              >
                <button
                  onClick={() => scrollToSection('disasters')}
                  className={`text-white hover:text-yellow-300 transition-all duration-200 flex items-center gap-2 ${
                    activeSection === 'disasters' ? 'text-yellow-300 border-b-2 border-yellow-300' : ''
                  }`}
                >
                  🌍 Disasters
                </button>
                {showDisastersDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[180px] z-50"
                  >
                    <div className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                      🏚️ Earthquake
                    </div>
                    <div className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                      🔥 Fire
                    </div>
                    <div className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                      🌊 Flood
                    </div>
                    <div className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                      🌪️ Cyclone
                    </div>
                  </motion.div>
                )}
              </li>

              {/* About */}
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className={`text-white hover:text-yellow-300 transition-all duration-200 flex items-center gap-2 ${
                    activeSection === 'about' ? 'text-yellow-300 border-b-2 border-yellow-300' : ''
                  }`}
                >
                  ℹ️ About
                </button>
              </li>

              {/* Contact */}
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`text-white hover:text-yellow-300 transition-all duration-200 flex items-center gap-2 ${
                    activeSection === 'contact' ? 'text-yellow-300 border-b-2 border-yellow-300' : ''
                  }`}
                >
                  📞 Contact
                </button>
              </li>

              {/* User Actions */}
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <li>
                      <Link to="/admin" className="text-white hover:text-yellow-300 transition-colors">
                        ⚙️ Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="text-white hover:text-yellow-300 hover:underline cursor-pointer transition-all duration-200"
                    >
                      👤 {user.name}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={onLogout}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      🚪 Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-white hover:text-yellow-300 transition-colors">
                      🔑 Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="bg-white text-blue-600 px-5 py-2 rounded-lg hover:bg-yellow-300 hover:text-blue-700 transition-all duration-200 hover:scale-105 font-bold"
                    >
                      ✨ Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>
      
      {/* Spacer for sticky header */}
      {isSticky && <div className="h-[72px]"></div>}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/10"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Edit Profile</h2>

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 rounded-lg mb-6 font-semibold ${
                  message.includes('✅')
                    ? 'bg-green-500/20 border border-green-400/50 text-green-300'
                    : 'bg-red-500/20 border border-red-400/50 text-red-300'
                }`}
              >
                {message}
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-blue-300 font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-blue-300 font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-blue-300 font-bold mb-2">School/Institution</label>
                <input
                  type="text"
                  name="school"
                  value={editData.school}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-blue-300 font-bold mb-2">Region</label>
                <input
                  type="text"
                  name="region"
                  value={editData.region}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <motion.button
                onClick={handleSaveProfile}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? '⏳ Saving...' : '💾 Save Changes'}
              </motion.button>
              <motion.button
                onClick={() => setShowProfileModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                ✕ Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export const Footer = () => {
  const location = useLocation();
  
  // Function to navigate to landing page section
  const navigateToSection = (sectionId) => {
    if (location.pathname !== '/') {
      // If not on landing page, navigate to it with hash
      window.location.href = `/#${sectionId}`;
    } else {
      // If on landing page, smooth scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Project Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🛡️</span>
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                PrepSafe
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              A disaster preparedness education system for schools and colleges providing training, 
              virtual drills, and emergency alerts to improve safety and readiness.
            </p>
            <div className="mt-6 flex gap-3">
              <a 
                href="https://github.com/Aniket-Kumar-Himanshu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/aniket-kumar-himanshu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-cyan-300">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigateToSection('home')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>→</span> Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToSection('features')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>→</span> Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToSection('disasters')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>→</span> Disasters
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToSection('about')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>→</span> About
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToSection('contact')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>→</span> Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-cyan-300">Features</h3>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm flex items-center gap-2">
                <span className="text-blue-400">📚</span> Learning Modules
              </li>
              <li className="text-gray-400 text-sm flex items-center gap-2">
                <span className="text-purple-400">🧪</span> Virtual Drills
              </li>
              <li className="text-gray-400 text-sm flex items-center gap-2">
                <span className="text-red-400">🚨</span> Emergency Alerts
              </li>
              <li className="text-gray-400 text-sm flex items-center gap-2">
                <span className="text-green-400">📊</span> Preparedness Tracking
              </li>
              <li className="text-gray-400 text-sm flex items-center gap-2">
                <span className="text-yellow-400">🆘</span> SOS Emergency System
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-cyan-300">Contact</h3>
            <ul className="space-y-4">
              <li className="text-gray-400 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">📧</span>
                  <div>
                    <p className="font-semibold text-white mb-1">Email</p>
                    <a href="mailto:aniketkumarhimanshu1@gmail.com" className="hover:text-cyan-400 transition-colors">
                      aniketkumarhimanshu1@gmail.com
                    </a>
                  </div>
                </div>
              </li>
              <li className="text-gray-400 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">🎓</span>
                  <div>
                    <p className="font-semibold text-white mb-1">College</p>
                    <p>Lovely Professional University</p>
                  </div>
                </div>
              </li>
              <li className="text-gray-400 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">💻</span>
                  <div>
                    <p className="font-semibold text-white mb-1">Department</p>
                    <p>Computer Science & Engineering</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer - Copyright */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2026 PrepSafe | Final Year B.Tech CSE Project | All Rights Reserved
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <button className="hover:text-cyan-400 transition-colors">Privacy Policy</button>
              <span>•</span>
              <button className="hover:text-cyan-400 transition-colors">Terms of Service</button>
              <span>•</span>
              <p>Made with ❤️ by CSE Students</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
