import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

export const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Handle hash scrolling on page load
  useEffect(() => {
    if (location.hash) {
      // Remove the # from hash
      const sectionId = location.hash.substring(1);
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  const features = [
    { 
      icon: '📚', 
      title: 'Learning Modules', 
      description: 'Interactive learning materials for disaster awareness and safety. Access videos, slides, and step-by-step instructions.',
      path: '/dashboard',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: '🧪', 
      title: 'Virtual Drills', 
      description: 'Simulated disaster drills for real-life preparedness. Practice fire drills, earthquake responses, and more.',
      path: '/drills',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      icon: '🚨', 
      title: 'Emergency Alerts', 
      description: 'Real-time notifications for emergency situations. Get instant alerts for fires, earthquakes, and other disasters.',
      path: '/dashboard',
      gradient: 'from-red-500 to-orange-500'
    },
    { 
      icon: '👨‍💼', 
      title: 'Role-Based Dashboard', 
      description: 'Separate dashboards for Admin, Teacher, and Student. Customized experience for each user type.',
      path: '/dashboard',
      gradient: 'from-green-500 to-teal-500'
    },
    { 
      icon: '📊', 
      title: 'Preparedness Tracking', 
      description: 'Monitor user progress and disaster preparedness levels. Track completion, earn badges, and improve skills.',
      path: '/dashboard',
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      icon: '🆘', 
      title: 'SOS Emergency System', 
      description: 'Quick emergency help and safety instructions. Access emergency contacts and immediate guidance.',
      path: '/contacts',
      gradient: 'from-yellow-500 to-red-500'
    },
  ];

  return (
    <div id="home" className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 min-h-screen relative overflow-hidden">
      {/* Enhanced Animated background blobs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="absolute bottom-20 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
        transition={{ duration: 20, repeat: Infinity, delay: 4 }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              {/* Title */}
              <motion.h1 
                className="text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Disaster Preparedness & Response Education
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                className="text-2xl font-semibold text-cyan-300 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Empowering students and educators to respond effectively to disasters
              </motion.p>

              {/* Description */}
              <motion.p 
                className="text-lg text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Learn disaster safety through virtual drills, interactive training modules, and real-time alerts. 
                This platform provides disaster awareness, virtual drills, and emergency guidance for schools 
                and colleges to improve safety and preparedness.
              </motion.p>

              {/* Buttons */}
              <motion.div 
                className="flex gap-4 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {user ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/dashboard"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 inline-flex items-center gap-2"
                      >
                        🚀 Go to Dashboard
                      </Link>
                    </motion.div>
                    {user.role === 'admin' && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/admin"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 inline-flex items-center gap-2"
                        >
                          ⚙️ Admin Panel
                        </Link>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/register"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 inline-flex items-center gap-2"
                      >
                        🚀 Get Started
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/login"
                        className="bg-transparent border-2 border-blue-400 text-blue-300 px-8 py-4 rounded-xl font-bold hover:bg-blue-500/20 hover:border-blue-300 transition-all duration-300 inline-flex items-center gap-2"
                      >
                        🔐 Login
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => {
                          const element = document.getElementById('features');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 hover:border-white/50 transition-all duration-300 inline-flex items-center gap-2"
                      >
                        📖 Learn More
                      </button>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Right Side - Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Animated Floating Icons Illustration */}
              <div className="relative w-full h-[400px] lg:h-[500px]">
                {/* Central Emergency Icon */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🚨
                </motion.div>

                {/* Floating Disaster Icons */}
                <motion.div
                  className="absolute top-10 left-10 text-6xl"
                  animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                >
                  🌍
                </motion.div>

                <motion.div
                  className="absolute top-20 right-10 text-5xl"
                  animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                >
                  🔥
                </motion.div>

                <motion.div
                  className="absolute bottom-20 left-20 text-5xl"
                  animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  💧
                </motion.div>

                <motion.div
                  className="absolute bottom-10 right-20 text-6xl"
                  animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: 1.5 }}
                >
                  🌪️
                </motion.div>

                {/* Shield Icon */}
                <motion.div
                  className="absolute top-1/3 right-5 text-5xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                >
                  🛡️
                </motion.div>

                {/* Book Icon */}
                <motion.div
                  className="absolute bottom-1/3 left-5 text-5xl"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: 0.7 }}
                >
                  📚
                </motion.div>

                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 py-20">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
            >
              Key Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Explore the powerful features of our disaster preparedness system
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const featureCard = (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`group relative p-8 rounded-2xl backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 ${
                    user 
                      ? 'cursor-pointer bg-gradient-to-br from-white/10 to-white/5 hover:shadow-2xl' 
                      : 'bg-gradient-to-br from-white/5 to-white/2 hover:shadow-xl'
                  }`}
                >
                  {/* Gradient Glow Effect on Hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with Gradient Background */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 text-3xl shadow-lg`}>
                      {feature.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    
                    {/* Call to Action */}
                    {user ? (
                      <div className="flex items-center text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
                        <span>Explore now</span>
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex items-center text-blue-400 font-semibold">
                        <span className="text-sm">🔒 Login to access</span>
                      </div>
                    )}
                  </div>

                  {/* Corner Accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-20 rounded-2xl blur-2xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                </motion.div>
              );

              return user ? (
                <Link key={idx} to={feature.path} className="no-underline">
                  {featureCard}
                </Link>
              ) : (
                <div key={idx}>
                  {featureCard}
                </div>
              );
            })}
          </div>
        </section>

        {/* Supported Disasters */}
        <section id="disasters" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
              >
                Disaster Types Covered
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto"
              >
                Prepare for different types of natural disasters with specialized training modules
              </motion.p>
            </div>

            {/* Disaster Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: '🌍', 
                  name: 'Earthquake', 
                  description: 'Safety guidelines and earthquake simulation drills',
                  gradient: 'from-yellow-400/20 to-orange-400/20', 
                  border: 'border-yellow-500/30',
                  iconBg: 'from-yellow-500 to-orange-500'
                },
                { 
                  icon: '🌊', 
                  name: 'Flood', 
                  description: 'Flood safety training and evacuation drills',
                  gradient: 'from-blue-400/20 to-cyan-400/20', 
                  border: 'border-blue-500/30',
                  iconBg: 'from-blue-500 to-cyan-500'
                },
                { 
                  icon: '🔥', 
                  name: 'Fire', 
                  description: 'Fire emergency response and evacuation planning',
                  gradient: 'from-orange-400/20 to-red-400/20', 
                  border: 'border-orange-500/30',
                  iconBg: 'from-orange-500 to-red-500'
                },
                { 
                  icon: '🌪️', 
                  name: 'Cyclone', 
                  description: 'Cyclone preparedness and safety instructions',
                  gradient: 'from-purple-400/20 to-pink-400/20', 
                  border: 'border-purple-500/30',
                  iconBg: 'from-purple-500 to-pink-500'
                },
              ].map((disaster, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`group relative bg-gradient-to-br ${disaster.gradient} backdrop-blur-md border ${disaster.border} hover:border-white/40 p-8 rounded-2xl text-center transition-all duration-300 hover:shadow-2xl cursor-pointer`}
                >
                  {/* Glow Effect on Hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${disaster.iconBg} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with Gradient Background */}
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${disaster.iconBg} mb-4 text-4xl shadow-lg mx-auto`}>
                      {disaster.icon}
                    </div>
                    
                    {/* Disaster Name */}
                    <h3 className="font-bold text-2xl text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                      {disaster.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {disaster.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '1000+', label: 'Students Trained', icon: '👥', gradient: 'from-blue-500 to-cyan-500' },
                { value: '50+', label: 'Training Modules', icon: '📚', gradient: 'from-purple-500 to-pink-500' },
                { value: '10+', label: 'Disaster Types', icon: '🌍', gradient: 'from-green-500 to-teal-500' },
                { value: '95%', label: 'Preparedness Rate', icon: '✅', gradient: 'from-orange-500 to-red-500' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 p-8 rounded-2xl text-center transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Gradient Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with Gradient Background */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${stat.gradient} mb-4 text-3xl shadow-lg`}>
                      {stat.icon}
                    </div>
                    
                    {/* Value */}
                    <div className={`text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>
                    
                    {/* Label */}
                    <p className="text-gray-300 font-semibold text-lg">{stat.label}</p>
                  </div>

                  {/* Corner Accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-2xl blur-2xl group-hover:opacity-20 transition-opacity duration-300`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
              >
                How It Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto"
              >
                Simple steps to improve disaster preparedness
              </motion.p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connecting Lines (Desktop Only) */}
              <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
                <div className="max-w-6xl mx-auto relative">
                  <div className="absolute top-0 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-30"></div>
                </div>
              </div>

              {[
                {
                  number: '1',
                  icon: '👤',
                  title: 'Register / Login',
                  description: 'Create account and access role-based dashboard as Admin, Teacher, or Student.',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  number: '2',
                  icon: '📚',
                  title: 'Learn Disaster Safety',
                  description: 'Study disaster preparedness through interactive modules and comprehensive content.',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  number: '3',
                  icon: '🧪',
                  title: 'Participate in Virtual Drills',
                  description: 'Practice disaster response using realistic virtual simulation scenarios.',
                  gradient: 'from-green-500 to-teal-500'
                },
                {
                  number: '4',
                  icon: '📊',
                  title: 'Track Preparedness',
                  description: 'Monitor your performance, progress, and overall preparedness score.',
                  gradient: 'from-orange-500 to-red-500'
                },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 p-8 rounded-2xl text-center transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Gradient Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Step Number Badge */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.gradient} mb-4 text-2xl font-black text-white shadow-xl`}>
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="text-5xl mb-4">
                      {step.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300">
                      {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>

                  {/* Corner Accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${step.gradient} opacity-10 rounded-2xl blur-2xl group-hover:opacity-20 transition-opacity duration-300`}></div>

                  {/* Arrow (Desktop Only, Not on Last Item) */}
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-20 -right-4 text-3xl text-cyan-400 opacity-50 z-20">
                      →
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-cyan-600/30"></div>
            <motion.div
              className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
              transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            />
          </div>

          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/30 p-16 rounded-3xl text-center shadow-2xl"
            >
              {/* Icon Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mb-8 text-4xl shadow-xl"
              >
                🚀
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight"
              >
                Start Your Disaster Preparedness Journey Today
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                Improve safety and preparedness with interactive disaster training and virtual drills. 
                Join thousands of students and educators learning to stay safe.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex gap-6 justify-center flex-wrap"
              >
                {!user ? (
                  <>
                    {/* Primary CTA */}
                    <motion.div
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/register"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/60 transition-all duration-300"
                      >
                        <span>🚀 Get Started</span>
                      </Link>
                    </motion.div>

                    {/* Secondary CTA */}
                    <motion.div
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-3 bg-white/10 border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                      >
                        <span>🔐 Login</span>
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* For Logged In Users */}
                    <motion.div
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/60 transition-all duration-300"
                      >
                        <span>📊 Go to Dashboard</span>
                      </Link>
                    </motion.div>
                    {user.role === 'admin' && (
                      <motion.div
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/admin"
                          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/60 transition-all duration-300"
                        >
                          <span>⚙️ Admin Panel</span>
                        </Link>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-12 flex items-center justify-center gap-8 flex-wrap text-gray-400 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>Interactive Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>Virtual Drills</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>Track Progress</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent"
            >
              About PrepSafe
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Project */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-white/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-white mb-4">About Project</h3>
                <p className="text-gray-300 leading-relaxed">
                  PrepSafe is a comprehensive disaster preparedness and response education platform designed to 
                  empower students and educators with critical knowledge and practical skills to handle emergency situations.
                </p>
              </motion.div>

              {/* Objectives */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-white/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-4">Objectives</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>✓ Educate on disaster preparedness</li>
                  <li>✓ Provide practical virtual drills</li>
                  <li>✓ Enable real-time emergency alerts</li>
                  <li>✓ Build confident, prepared communities</li>
                </ul>
              </motion.div>

              {/* Problem Statement */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-white/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-white mb-4">Problem Statement</h3>
                <p className="text-gray-300 leading-relaxed">
                  Many students and educators lack access to quality disaster preparedness training. 
                  PrepSafe bridges this gap with accessible, engaging, and region-specific educational resources.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent"
            >
              Contact Us
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-blue-400/30 p-8 rounded-2xl text-center hover:border-blue-400/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-bold text-white mb-3">Email</h3>
                <a href="mailto:aniketkumarhimanshu1@gmail.com" className="text-blue-300 hover:text-blue-200 transition-colors">
                  aniketkumarhimanshu1@gmail.com
                </a>
              </motion.div>

              {/* College */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-400/30 p-8 rounded-2xl text-center hover:border-purple-400/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-white mb-3">College</h3>
                <p className="text-gray-300">
                  Lovely Professional University<br />
                  Department of Computer Science
                </p>
              </motion.div>

              {/* Team */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-md border border-green-400/30 p-8 rounded-2xl text-center hover:border-green-400/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-white mb-3">Team Info</h3>
                <p className="text-gray-300">
                  Developed by passionate students<br />
                  committed to community safety
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="border-t border-white/10 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400">
              🛡️ <span className="text-blue-300 font-semibold">PrepSafe - Be Prepared. Be Safe. Be Ready.</span>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Your guide to disaster preparedness and emergency response
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
