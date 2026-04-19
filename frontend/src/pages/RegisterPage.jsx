import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const RegisterPage = () => {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    school: '',
    region: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const regions = [
    'North India', 'South India', 'East India', 'West India', 'Northeast India', 'Central India'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.school,
        formData.region
      );
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      const errorMsg = typeof err === 'string' ? err : err.message || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 py-12 px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, delay: 2 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 max-w-md w-full mx-auto relative z-10 hover:border-white/30 transition-all duration-300 max-h-[90vh] overflow-y-auto"
      >
        <motion.div
          className="text-5xl mb-4 text-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👥
        </motion.div>
        <h2 className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-center text-gray-300 mb-8 text-sm">Join our disaster preparedness program</p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg mb-6 font-semibold text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label className="block text-blue-300 font-bold mb-2 text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
              placeholder="Your name"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-blue-300 font-bold mb-2 text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
              placeholder="your@email.com"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-blue-300 font-bold mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
              placeholder="••••••••"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-blue-300 font-bold mb-2 text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
              placeholder="••••••••"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="block text-blue-300 font-bold mb-2 text-sm">Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
              required
            >
              <option value="student" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>👨‍🎓 Student</option>
              <option value="teacher" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>👩‍🏫 Teacher</option>
            </select>
            <p className="text-gray-400 text-xs mt-1">Admin accounts are created by system administrators</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-blue-300 font-bold mb-2 text-sm">School/College Name</label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
              placeholder="Your institution"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-blue-300 font-bold mb-2 text-sm">Region</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              required
            >
              <option value="" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Select your region</option>
              {regions.map((r) => (
                <option key={r} value={r} style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>{r}</option>
              ))}
            </select>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? '⏳ Registering...' : '✨ Register'}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-300 mt-6 text-sm"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
            Login here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};
