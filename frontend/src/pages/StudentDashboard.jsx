import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { moduleAPI, alertAPI, drillAPI, virtualDrillAPI, disasterTypeAPI, quizAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

export const StudentDashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modules, setModules] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [drills, setDrills] = useState([]);
  const [virtualDrills, setVirtualDrills] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [disasterTypes, setDisasterTypes] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modulesRes, alertsRes, drillsRes, virtualDrillsRes, disastersRes] = await Promise.all([
        moduleAPI.getAll(),
        alertAPI.getAll(user?.region, token),
        drillAPI.getUserResults(token),
        virtualDrillAPI.getAll(true, token),
        disasterTypeAPI.getAll(true), // Get only active disasters
      ]);
      setModules(modulesRes.data);
      setAlerts(alertsRes.data);
      setDrills(Array.isArray(drillsRes.data) ? drillsRes.data : []);
      setVirtualDrills(Array.isArray(virtualDrillsRes.data) ? virtualDrillsRes.data : []);
      setDisasterTypes(disastersRes.data || []);
      
      // Fetch quizzes separately after other data
      const quizzesRes = await quizAPI.getAll(token);
      setQuizzes(Array.isArray(quizzesRes.data) ? quizzesRes.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', color: 'blue' },
    { id: 'modules', icon: '📚', label: 'Learning Modules', color: 'purple' },
    { id: 'safety', icon: '🌍', label: 'Safety Guide', color: 'emerald' },
    { id: 'drills', icon: '🧪', label: 'Drills', color: 'cyan' },
    { id: 'quiz', icon: '📝', label: 'Assessments', color: 'orange' },
    { id: 'alerts', icon: '🚨', label: 'Alerts', color: 'red' },
    { id: 'progress', icon: '📈', label: 'Progress', color: 'green' },
    { id: 'profile', icon: '👤', label: 'Profile', color: 'gray' },
  ];

  // Stats Cards Data
  const statsCards = [
    { 
      title: 'Learning Modules', 
      value: modules.length, 
      icon: '📚', 
      gradient: 'from-purple-500 to-pink-500',
      subtitle: 'Available modules'
    },
    { 
      title: 'Upcoming Drills', 
      value: virtualDrills.filter(d => d.isActive !== false).length || 0, 
      icon: '🧪', 
      gradient: 'from-cyan-500 to-blue-500',
      subtitle: 'Scheduled soon'
    },
    { 
      title: 'Quiz Assigned', 
      value: quizzes.filter(q => q.status === 'published').length, 
      icon: '📝', 
      gradient: 'from-orange-500 to-red-500',
      subtitle: 'Available quizzes'
    },
    { 
      title: 'Preparedness Score', 
      value: `${Math.min((user?.preparednessScore || 0) / 2, 100).toFixed(0)}%`, 
      icon: '📊', 
      gradient: 'from-green-500 to-teal-500',
      subtitle: 'Your readiness level'
    },
  ];

  // Performance Data
  const performanceData = [
    { subject: 'Fire Safety', score: drills.filter(d => d.drillType === 'fire')[0]?.score || 85 },
    { subject: 'Earthquake', score: drills.filter(d => d.drillType === 'earthquake')[0]?.score || 78 },
    { subject: 'Flood Safety', score: drills.filter(d => d.drillType === 'flood')[0]?.score || 92 },
    { subject: 'Cyclone', score: drills.filter(d => d.drillType === 'cyclone')[0]?.score || 88 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          ⏳
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Main Layout */}
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-64 bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-r border-white/10 flex flex-col"
            >
              {/* Logo */}
              <div className="p-6 border-b border-white/10">
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                    👨‍🎓
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white">PrepSafe</h1>
                    <p className="text-xs text-gray-400">Student Portal</p>
                  </div>
                </motion.div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? `bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white shadow-lg shadow-${item.color}-500/50`
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-semibold text-sm">Logout</span>
                </motion.button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Navbar */}
          <header className="bg-slate-800/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-2xl text-white hover:text-blue-400 transition-colors"
                >
                  ☰
                </motion.button>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {menuItems.find(m => m.id === activeTab)?.icon} {menuItems.find(m => m.id === activeTab)?.label}
                  </h2>
                  <p className="text-sm text-gray-400">Welcome back, {user?.name?.split(' ')[0]}! 👋</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">Student</p>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && <DashboardHome statsCards={statsCards} alerts={alerts} user={user} setActiveTab={setActiveTab} />}
              {activeTab === 'modules' && <ModulesPage modules={modules} />}
              {activeTab === 'safety' && <SafetyGuidePage disasterTypes={disasterTypes} selectedDisaster={selectedDisaster} setSelectedDisaster={setSelectedDisaster} />}
              {activeTab === 'drills' && <DrillsPage drills={drills} virtualDrills={virtualDrills} />}
              {activeTab === 'quiz' && <QuizPage quizzes={quizzes} />}
              {activeTab === 'alerts' && <AlertsPage alerts={alerts} user={user} />}
              {activeTab === 'progress' && <ProgressPage drills={drills} modules={modules} user={user} performanceData={performanceData} />}
              {activeTab === 'profile' && <ProfilePage user={user} />}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ statsCards, alerts, user, setActiveTab }) => {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 text-7xl opacity-10">{stat.icon}</div>
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-semibold mb-2">{stat.title}</p>
              <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
              <p className="text-white/60 text-xs">{stat.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl p-6 rounded-2xl border border-red-400/30"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🚨 Active Alerts for {user?.region}
          </h3>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert, idx) => (
              <motion.div
                key={alert._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white/5 p-4 rounded-lg border border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-semibold">{alert.title}</h4>
                    <p className="text-gray-300 text-sm mt-1">{alert.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    alert.severity === 'critical' 
                      ? 'bg-red-500/30 text-red-300' 
                      : 'bg-yellow-500/30 text-yellow-300'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('modules')}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl p-6 rounded-2xl border border-purple-400/30 cursor-pointer"
        >
          <div className="text-4xl mb-3">📚</div>
          <h3 className="text-xl font-bold text-white mb-2">Start Learning</h3>
          <p className="text-gray-300 text-sm">Access disaster safety modules</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('drills')}
          className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl p-6 rounded-2xl border border-cyan-400/30 cursor-pointer"
        >
          <div className="text-4xl mb-3">🧪</div>
          <h3 className="text-xl font-bold text-white mb-2">Practice Drills</h3>
          <p className="text-gray-300 text-sm">Join virtual drill sessions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('quiz')}
          className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl p-6 rounded-2xl border border-orange-400/30 cursor-pointer"
        >
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-xl font-bold text-white mb-2">Take Quiz</h3>
          <p className="text-gray-300 text-sm">Test your knowledge</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Modules Page
const ModulesPage = ({ modules }) => {
  return (
    <motion.div
      key="modules"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Available Learning Modules</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, idx) => (
          <motion.div
            key={module._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 cursor-pointer"
          >
            <div className="text-5xl mb-4">{module.icon || '📚'}</div>
            <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{module.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">📹 {module.videoDuration || '15 min'}</span>
              <span className="text-sm text-gray-500">📄 {module.materialCount || '5'} materials</span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>0%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '0%' }}></div>
              </div>
            </div>

            <Link to={`/modules/${module._id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold shadow-lg"
              >
                Start Learning →
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No modules available yet.</p>
        </div>
      )}
    </motion.div>
  );
};

// Drills Page
const DrillsPage = ({ drills, virtualDrills }) => {
  const upcomingDrills = (virtualDrills || []).map((drill) => {
    const scheduledDate = new Date(drill.scheduledDate);
    return {
      id: drill._id,
      title: drill.title,
      date: scheduledDate.toLocaleDateString(),
      time: scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: drill.disasterType,
      status: scheduledDate > new Date() ? 'upcoming' : 'available',
      icon: drill.icon || (drill.disasterType === 'fire' ? '🔥' : drill.disasterType === 'earthquake' ? '🌍' : drill.disasterType === 'flood' ? '🌊' : '🌀'),
      description: drill.description || 'Virtual simulation',
    };
  });

  return (
    <motion.div
      key="drills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Virtual Drills</h2>

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Drill</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {upcomingDrills.map((drill, idx) => (
                <motion.tr
                  key={drill.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/5 transition-all"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{drill.icon}</div>
                      <div>
                        <p className="text-white font-semibold">{drill.title}</p>
                        <p className="text-gray-400 text-sm">{drill.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{drill.date}</p>
                    <p className="text-gray-400 text-sm">{drill.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold capitalize">
                      {drill.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
                      Upcoming
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to="/drills">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-semibold"
                      >
                        Start Drill →
                      </motion.button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Drills */}
      {drills.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Completed Drills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drills.map((drill, idx) => (
              <motion.div
                key={drill._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{drill.drillType === 'fire' ? '🔥' : drill.drillType === 'earthquake' ? '🌍' : '🌊'}</div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                    Completed
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 capitalize">{drill.drillType} Drill</h4>
                <p className="text-gray-400 text-sm mb-4">{new Date(drill.completedAt).toLocaleDateString()}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Score</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                    {drill.score}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Quiz Page
const QuizPage = ({ quizzes }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [quizResults, setQuizResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);
  
  useEffect(() => {
    fetchQuizResults();
  }, []);

  const fetchQuizResults = async () => {
    try {
      const response = await quizAPI.getUserResults(token);
      setQuizResults(response.data || []);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    } finally {
      setLoadingResults(false);
    }
  };
  
  // Helper function to get icon based on disaster type
  const getQuizIcon = (disasterType) => {
    const icons = {
      fire: '🔥',
      earthquake: '🌍',
      flood: '🌊',
      cyclone: '🌀',
      general: '📝'
    };
    return icons[disasterType] || '📝';
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleReviewQuiz = (resultId) => {
    navigate(`/quiz/review/${resultId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Assessments & Quizzes</h2>

      {/* Quiz History Section */}
      {quizResults.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">📜 Your Quiz History</h3>
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Quiz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {quizResults.map((result, idx) => (
                    <motion.tr
                      key={result._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getQuizIcon(result.quizId?.disasterType)}
                          </span>
                          <div>
                            <p className="text-white font-medium">
                              {result.quizId?.title || 'Quiz'}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {result.quizId?.disasterType || 'general'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {formatDate(result.completedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold text-white">
                            {result.percentage.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            ({result.score}/{result.totalPoints} pts)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          result.passed
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {result.passed ? '✓ PASS' : '✗ FAIL'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReviewQuiz(result._id)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xs font-semibold"
                        >
                          📝 Review
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Available Quizzes Section */}
      <h3 className="text-xl font-bold text-white mb-4">✨ Available Quizzes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes && quizzes.length > 0 ? quizzes.map((quiz, idx) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{getQuizIcon(quiz.disasterType)}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                quiz.status === 'published' 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {quiz.status === 'published' ? 'Available' : quiz.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{quiz.description || 'Test your knowledge'}</p>
            <p className="text-gray-500 text-xs mb-4">
              {quiz.questions?.length || 0} Questions • {quiz.timeLimit || 30} minutes
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartQuiz(quiz._id)}
              className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-semibold"
            >
              Start Quiz →
            </motion.button>
          </motion.div>
        )) : (
          <div className="col-span-3 text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 mb-2">No quizzes available yet</p>
            <p className="text-gray-500 text-sm">Your teacher will assign quizzes soon</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Alerts Page
const AlertsPage = ({ alerts, user }) => {
  return (
    <motion.div
      key="alerts"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">🚨 Alerts & Notifications</h2>

      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <motion.div
              key={alert._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br backdrop-blur-xl p-6 rounded-2xl border ${
                alert.severity === 'critical'
                  ? 'from-red-500/20 to-orange-500/20 border-red-400/30'
                  : 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{alert.severity === 'critical' ? '🚨' : '⚠️'}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{alert.title}</h3>
                    <p className="text-gray-300 mb-3">{alert.description}</p>
                    <div className="flex gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        alert.severity === 'critical'
                          ? 'bg-red-500/30 text-red-300 border border-red-400/50'
                          : 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/50'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-300 border border-blue-400/50 capitalize">
                        {alert.disasterType}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-300 border border-purple-400/50">
                        {user?.region}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-12 rounded-2xl border border-white/10 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Active Alerts</h3>
          <p className="text-gray-400">You're all caught up! No emergency alerts for your region.</p>
        </div>
      )}
    </motion.div>
  );
};

// Progress Page
const ProgressPage = ({ drills, modules, user, performanceData }) => {
  const completedModules = user?.completedModules?.length || 0;
  const totalModules = modules.length || 10;
  const completedDrills = drills.length;
  const preparednessScore = Math.min((user?.preparednessScore || 0) / 2, 100).toFixed(0);

  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">📈 Your Progress & Reports</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl p-6 rounded-2xl border border-purple-400/30"
        >
          <div className="text-4xl mb-3">📚</div>
          <h3 className="text-lg font-semibold text-white mb-2">Modules Completed</h3>
          <p className="text-4xl font-black text-white mb-2">{completedModules}/{totalModules}</p>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
              style={{ width: `${(completedModules / totalModules) * 100}%` }}
            ></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl p-6 rounded-2xl border border-cyan-400/30"
        >
          <div className="text-4xl mb-3">🧪</div>
          <h3 className="text-lg font-semibold text-white mb-2">Drills Completed</h3>
          <p className="text-4xl font-black text-white mb-2">{completedDrills}</p>
          <p className="text-sm text-gray-400">Average Score: {drills.length > 0 ? (drills.reduce((acc, d) => acc + (d.score || 0), 0) / drills.length).toFixed(1) : 0}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl p-6 rounded-2xl border border-green-400/30"
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-white mb-2">Preparedness Score</h3>
          <p className="text-4xl font-black bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
            {preparednessScore}%
          </p>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-teal-500" 
              style={{ width: `${preparednessScore}%` }}
            ></div>
          </div>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-4">Performance by Disaster Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="subject" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Bar dataKey="score" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-4">🏆 Badges Earned</h3>
        {user?.badges?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.badges.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="bg-white/5 p-4 rounded-lg text-center hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-white font-semibold text-sm">{badge.name}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-400">Complete drills and modules to earn badges!</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Profile Page
const ProfilePage = ({ user }) => {
  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">👤 Profile Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              {user?.name?.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{user?.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{user?.email}</p>
            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
              Student
            </span>
            <div className="mt-6 pt-6 border-t border-white/10 text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">School</span>
                <span className="text-white font-semibold">{user?.school || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Region</span>
                <span className="text-white font-semibold">{user?.region || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Joined</span>
                <span className="text-white font-semibold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Update Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">School/College</label>
              <input
                type="text"
                defaultValue={user?.school || ''}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Region</label>
              <input
                type="text"
                defaultValue={user?.region || ''}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg"
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Safety Guide Page
const SafetyGuidePage = ({ disasterTypes, selectedDisaster, setSelectedDisaster }) => {
  return (
    <motion.div
      key="safety"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {!selectedDisaster ? (
        <>
          <div>
            <h2 className="text-3xl font-black text-white mb-2">🌍 Disaster Safety Guide</h2>
            <p className="text-gray-400">Learn essential safety information for different types of disasters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disasterTypes.map((disaster, idx) => (
              <motion.div
                key={disaster._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => setSelectedDisaster(disaster)}
                className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 cursor-pointer hover:border-white/30 transition-all"
              >
                <div className="text-6xl mb-4">{disaster.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{disaster.displayName}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{disaster.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    disaster.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                    disaster.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                    disaster.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {disaster.severity}
                  </span>
                  {disaster.safetyTips && disaster.safetyTips.length > 0 && (
                    <span className="text-xs text-gray-400">
                      {disaster.safetyTips.length} safety tips
                    </span>
                  )}
                </div>

                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold">
                  Learn More →
                </button>
              </motion.div>
            ))}
          </div>

          {disasterTypes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-gray-400">No disaster information available yet.</p>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Back Button */}
          <button
            onClick={() => setSelectedDisaster(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span> Back to Safety Guide
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
            <div className="flex items-start gap-6">
              <div className="text-8xl">{selectedDisaster.icon}</div>
              <div className="flex-1">
                <h2 className="text-4xl font-black text-white mb-2">{selectedDisaster.displayName}</h2>
                <p className="text-gray-300 mb-4">{selectedDisaster.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedDisaster.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                    selectedDisaster.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                    selectedDisaster.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    Severity: {selectedDisaster.severity}
                  </span>
                  {selectedDisaster.commonInRegions && selectedDisaster.commonInRegions.length > 0 && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-300">
                      Common in: {selectedDisaster.commonInRegions.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Safety Tips */}
          {selectedDisaster.safetyTips && selectedDisaster.safetyTips.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Before */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl p-6 rounded-2xl border border-blue-400/30">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>⏰</span> Before
                </h3>
                <ul className="space-y-3">
                  {selectedDisaster.safetyTips.filter(tip => tip.category === 'before').map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-200 text-sm">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{tip.tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* During */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl p-6 rounded-2xl border border-orange-400/30">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>⚠️</span> During
                </h3>
                <ul className="space-y-3">
                  {selectedDisaster.safetyTips.filter(tip => tip.category === 'during').map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-200 text-sm">
                      <span className="text-red-400 mt-1">!</span>
                      <span>{tip.tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl p-6 rounded-2xl border border-green-400/30">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>✅</span> After
                </h3>
                <ul className="space-y-3">
                  {selectedDisaster.safetyTips.filter(tip => tip.category === 'after').map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-200 text-sm">
                      <span className="text-emerald-400 mt-1">→</span>
                      <span>{tip.tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Emergency Supplies */}
          {selectedDisaster.emergencySupplies && selectedDisaster.emergencySupplies.length > 0 && (
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">🎒 Emergency Supplies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedDisaster.emergencySupplies.map((supply, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-200 text-sm">{supply}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Signals */}
          {selectedDisaster.warningSignals && selectedDisaster.warningSignals.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl p-6 rounded-2xl border border-yellow-400/30">
              <h3 className="text-2xl font-bold text-white mb-4">🚨 Warning Signals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedDisaster.warningSignals.map((signal, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                    <span className="text-yellow-400">⚠️</span>
                    <span className="text-gray-200 text-sm">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evacuation Guidelines */}
          {selectedDisaster.evacuationGuidelines && (
            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl p-6 rounded-2xl border border-purple-400/30">
              <h3 className="text-2xl font-bold text-white mb-4">🚪 Evacuation Guidelines</h3>
              <p className="text-gray-200 text-sm leading-relaxed">{selectedDisaster.evacuationGuidelines}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
