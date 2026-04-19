import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    role: 'student' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'teacher') {
        navigate('/dashboard'); // Will create teacher dashboard later
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(formData.email, formData.password);
      
      // Verify the role matches what user selected
      if (userData.role !== formData.role) {
        setError(`❌ Invalid credentials for ${formData.role} login. Please check your role selection.`);
        setLoading(false);
        return;
      }
      
      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'teacher') {
        navigate('/dashboard'); // Teacher dashboard
      } else {
        navigate('/dashboard'); // Student dashboard
      }
    } catch (err) {
      console.error('Login failed:', err);
      const errorMsg = typeof err === 'string' ? err : err.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
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
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 max-w-md w-full relative z-10 hover:border-white/30 transition-all duration-300"
      >
        <motion.div
          className="text-5xl mb-4 text-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🔐
        </motion.div>
        <h2 className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
          Login to Your Account
        </h2>
        <p className="text-center text-gray-300 mb-8 text-lg">Access your PrepSafe dashboard</p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg mb-6 font-semibold"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-blue-300 font-bold mb-3">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              required
            >
              <option value="student" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>👨‍🎓 Student</option>
              <option value="teacher" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>👩‍🏫 Teacher</option>
            </select>
          </motion.div>

          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-blue-300 font-bold mb-3">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
              placeholder="your@email.com"
              required
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-blue-300 font-bold mb-3">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? '⏳ Logging in...' : '🚀 Login'}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-300 mt-8 text-sm"
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
            Register here
          </Link>
        </motion.p>

        {/* Admin Login Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t border-white/10 mt-8 pt-6"
        >
          <p className="text-center text-gray-400 text-sm mb-3">Are you an admin?</p>
          <motion.button
            onClick={() => navigate('/admin-login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 text-lg"
          >
            🔑 Admin Login
          </motion.button>
        </motion.div>

        {/* Demo credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-white/10 mt-6 pt-6 text-xs text-gray-400"
        >
          <p className="font-bold text-blue-300 mb-2">Demo User Credentials:</p>
          <p className="mb-1">📧 <span className="text-white">student@disasterprep.com</span></p>
          <p>🔑 <span className="text-white">student123</span></p>
        </motion.div>
      </motion.div>
    </div>
  );
};
