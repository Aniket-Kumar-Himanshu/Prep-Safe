import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userAPI, drillAPI, moduleAPI, alertAPI, quizAPI, disasterTypeAPI, settingsAPI, virtualDrillAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ModuleForm from '../components/ModuleForm';

export const AdminDashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [drillStats, setDrillStats] = useState(null);
  const [modules, setModules] = useState([]);
  const [users, setUsers] = useState([]);
  const [drills, setDrills] = useState([]);
  const [scheduledDrills, setScheduledDrills] = useState([]);
  const [virtualDrills, setVirtualDrills] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [disasterTypes, setDisasterTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settingsData, setSettingsData] = useState({
    name: '',
    school: '',
    region: '',
    defaultAlertRegion: 'All',
    defaultAlertSeverity: 'medium',
    notificationsEnabled: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Module State
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  // Drill State
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [showVirtualDrillModal, setShowVirtualDrillModal] = useState(false);
  const [editingVirtualDrill, setEditingVirtualDrill] = useState(null);
  const [savingVirtualDrill, setSavingVirtualDrill] = useState(false);
  const [virtualDrillForm, setVirtualDrillForm] = useState({
    title: '',
    description: '',
    disasterType: 'earthquake',
    icon: '🌍',
    date: '',
    time: '10:00',
    isActive: true,
  });
  const [newDrill, setNewDrill] = useState({
    title: '',
    date: '',
    time: '',
    class: '',
    disasterType: 'fire',
  });

  // Alert State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    description: '',
    disasterType: 'earthquake',
    severity: 'medium',
    regions: [],
  });

  // User Creation State
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    school: '',
    region: '',
  });

  // Disaster Type State
  const [showDisasterModal, setShowDisasterModal] = useState(false);
  const [editingDisaster, setEditingDisaster] = useState(null);
  const [disasterFormData, setDisasterFormData] = useState({
    name: '',
    displayName: '',
    icon: '🌍',
    description: '',
    safetyTips: [],
    emergencySupplies: [],
    warningSignals: [],
    evacuationGuidelines: '',
    commonInRegions: [],
    severity: 'medium',
    isActive: true,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchStatistics(),
        fetchModules(),
        fetchUsers(),
        fetchDrills(),
        fetchVirtualDrills(),
        fetchAlerts(),
        fetchQuizzes(),
        fetchDisasterTypes(),
        fetchSettings(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const [usersRes, drillsRes] = await Promise.all([
        userAPI.getStatistics(token),
        drillAPI.getStatistics(token),
      ]);
      setUserStats(usersRes.data);
      setDrillStats(drillsRes.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await moduleAPI.getAll();
      setModules(res.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll(token);
      console.log('Fetched users:', res.data);
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', error.response?.data);
      setUsers([]);
    }
  };

  const fetchDrills = async () => {
    try {
      const [resultsRes, scheduledRes] = await Promise.all([
        drillAPI.getAll(token),
        drillAPI.getScheduledDrills(token),
      ]);
      setDrills(resultsRes.data);
      setScheduledDrills(scheduledRes.data);
    } catch (error) {
      console.error('Error fetching drills:', error);
    }
  };

  const fetchVirtualDrills = async () => {
    try {
      const res = await virtualDrillAPI.getAll(false, token);
      setVirtualDrills(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching virtual drills:', error);
      setVirtualDrills([]);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await alertAPI.getAll(undefined, token);
      setAlerts(res.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await quizAPI.getAll(token);
      setQuizzes(res.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchDisasterTypes = async () => {
    try {
      const res = await disasterTypeAPI.getAll();
      setDisasterTypes(res.data || []);
    } catch (error) {
      console.error('Error fetching disaster types:', error);
      setDisasterTypes([]);
    }
  };

  const fetchSettings = async () => {
    try {
      const [profileRes, settingsRes] = await Promise.all([
        userAPI.getProfile(token),
        settingsAPI.get(token),
      ]);

      const profile = profileRes.data || {};
      const settings = settingsRes.data || {};

      setSettingsData({
        name: profile.name || '',
        school: profile.school || '',
        region: profile.region || '',
        defaultAlertRegion: settings.defaultAlertRegion || 'All',
        defaultAlertSeverity: settings.defaultAlertSeverity || 'medium',
        notificationsEnabled: settings.notificationsEnabled ?? true,
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      if (!settingsData.name.trim()) {
        alert('❌ Name is required');
        return;
      }

      setSavingSettings(true);

      await Promise.all([
        userAPI.updateProfile(
          {
            name: settingsData.name,
            school: settingsData.school,
            region: settingsData.region,
          },
          token
        ),
        settingsAPI.update(
          {
            defaultAlertRegion: settingsData.defaultAlertRegion,
            defaultAlertSeverity: settingsData.defaultAlertSeverity,
            notificationsEnabled: settingsData.notificationsEnabled,
          },
          token
        ),
      ]);

      setAlertData((prev) => ({
        ...prev,
        severity: settingsData.defaultAlertSeverity,
      }));

      alert('✓ Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMsg = error.response?.data?.message || 'Failed to save settings';
      alert(`❌ ${errorMsg}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendAlert = async () => {
    try {
      if (!alertData.title || !alertData.description) {
        alert('Please fill in title and description');
        return;
      }

      await alertAPI.create(alertData, token);
      setShowAlertModal(false);
      setAlertData({ title: '', description: '', disasterType: 'earthquake', severity: 'medium', regions: [] });
      alert('✓ Alert sent successfully!');
      await fetchAlerts(); // Refresh alerts list
    } catch (error) {
      alert('Failed to send alert');
    }
  };

  const handleOpenAlertModal = () => {
    setAlertData((prev) => ({
      ...prev,
      severity: settingsData.defaultAlertSeverity || 'medium',
      regions:
        settingsData.defaultAlertRegion && settingsData.defaultAlertRegion !== 'All'
          ? [settingsData.defaultAlertRegion]
          : [],
    }));
    setShowAlertModal(true);
  };

  const handleCreateUser = async () => {
    try {
      // Validate inputs
      if (!newUserData.name || !newUserData.email || !newUserData.password || !newUserData.school || !newUserData.region) {
        alert('❌ Please fill in all fields');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUserData.email)) {
        alert('❌ Please enter a valid email address');
        return;
      }

      // Validate password length
      if (newUserData.password.length < 6) {
        alert('❌ Password must be at least 6 characters long');
        return;
      }

      await userAPI.createStudent(newUserData);
      setShowUserModal(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        school: '',
        region: '',
      });
      alert('✓ User created successfully!');
      await fetchUsers();
      await fetchStatistics(); // Refresh stats
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      alert(`❌ ${errorMessage}`);
    }
  };

  const handleCreateModule = async (moduleData) => {
    try {
      await moduleAPI.create(moduleData, token);
      alert('✓ Module created successfully!');
      setShowCreateModuleModal(false);
      await fetchModules();
    } catch (error) {
      console.error('Error creating module:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create module';
      alert(`❌ ${errorMessage}`);
      throw error; // Re-throw to keep the form in submitting state
    }
  };

  const handleUpdateModule = async (moduleData) => {
    try {
      if (!editingModule?._id) {
        alert('❌ No module selected for editing');
        return;
      }

      await moduleAPI.update(editingModule._id, moduleData, token);
      alert('✓ Module updated successfully!');
      setShowCreateModuleModal(false);
      setEditingModule(null);
      await fetchModules();
    } catch (error) {
      console.error('Error updating module:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update module';
      alert(`❌ ${errorMessage}`);
      throw error;
    }
  };

  const handleOpenCreateModuleModal = () => {
    setEditingModule(null);
    setShowCreateModuleModal(true);
  };

  const handleOpenEditModuleModal = (module) => {
    setEditingModule(module);
    setShowCreateModuleModal(true);
  };

  const handleDeleteModule = async (moduleId) => {
    if (confirm('Are you sure you want to delete this module?')) {
      try {
        await moduleAPI.delete(moduleId, token);
        alert('✓ Module deleted successfully!');
        await fetchModules();
      } catch (error) {
        console.error('Error deleting module:', error);
        alert('Failed to delete module');
      }
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await userAPI.deleteUser(userId, token);
        alert('✓ User deleted successfully!');
        await fetchUsers();
        await fetchStatistics(); // Refresh stats
      } catch (error) {
        console.error('Error deleting user:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete user';
        alert(`❌ ${errorMessage}`);
      }
    }
  };

  const handleDeleteDrill = async (drillId) => {
    if (confirm('Are you sure you want to delete this scheduled drill?')) {
      try {
        await drillAPI.deleteDrill(drillId, token);
        alert('✓ Drill deleted successfully!');
        await fetchDrills();
      } catch (error) {
        console.error('Error deleting drill:', error);
        alert('Failed to delete drill');
      }
    }
  };

  const handleEditScheduledDrill = async (drill) => {
    const newTitle = prompt('Edit drill title:', drill.title);
    if (newTitle === null) return;

    const currentDate = new Date(drill.scheduledDate);
    const currentDateString = currentDate.toISOString().slice(0, 10);
    const currentTimeString = currentDate.toTimeString().slice(0, 5);

    const newDate = prompt('Edit date (YYYY-MM-DD):', currentDateString);
    if (newDate === null) return;

    const newTime = prompt('Edit time (HH:MM):', currentTimeString);
    if (newTime === null) return;

    try {
      await drillAPI.updateDrill(
        drill._id,
        {
          title: newTitle.trim() || drill.title,
          disasterType: drill.disasterType,
          scheduledDate: newDate,
          time: newTime,
          class: drill.class || '',
        },
        token
      );
      await fetchDrills();
      alert('✓ Scheduled drill updated successfully!');
    } catch (error) {
      console.error('Error updating scheduled drill:', error);
      alert(error.response?.data?.message || 'Failed to update scheduled drill');
    }
  };

  const handleDeleteVirtualDrill = async (drillId) => {
    if (!confirm('Are you sure you want to delete this virtual drill?')) {
      return;
    }

    try {
      await virtualDrillAPI.delete(drillId, token);
      await fetchVirtualDrills();
      alert('✓ Virtual drill deleted successfully!');
    } catch (error) {
      console.error('Error deleting virtual drill:', error);
      alert(error.response?.data?.message || 'Failed to delete virtual drill');
    }
  };

  const handleCreateVirtualDrill = () => {
    setEditingVirtualDrill(null);
    setVirtualDrillForm({
      title: '',
      description: '',
      disasterType: 'earthquake',
      icon: '🌍',
      date: new Date().toISOString().slice(0, 10),
      time: '10:00',
      isActive: true,
    });
    setShowVirtualDrillModal(true);
  };

  const handleEditVirtualDrill = (drill) => {
    const scheduledDate = new Date(drill.scheduledDate);
    setEditingVirtualDrill(drill);
    setVirtualDrillForm({
      title: drill.title || '',
      description: drill.description || '',
      disasterType: drill.disasterType || 'earthquake',
      icon: drill.icon || '🧪',
      date: scheduledDate.toISOString().slice(0, 10),
      time: scheduledDate.toTimeString().slice(0, 5),
      isActive: drill.isActive !== false,
    });
    setShowVirtualDrillModal(true);
  };

  const handleSaveVirtualDrill = async () => {
    if (!virtualDrillForm.title || !virtualDrillForm.date || !virtualDrillForm.time) {
      alert('❌ Please fill in title, date, and time');
      return;
    }

    try {
      setSavingVirtualDrill(true);

      const payload = {
        title: virtualDrillForm.title,
        description: virtualDrillForm.description,
        disasterType: virtualDrillForm.disasterType,
        icon: virtualDrillForm.icon,
        scheduledDate: virtualDrillForm.date,
        time: virtualDrillForm.time,
        isActive: virtualDrillForm.isActive,
      };

      if (editingVirtualDrill?._id) {
        await virtualDrillAPI.update(editingVirtualDrill._id, payload, token);
        alert('✓ Virtual drill updated successfully!');
      } else {
        await virtualDrillAPI.create(payload, token);
        alert('✓ Virtual drill created successfully!');
      }

      setShowVirtualDrillModal(false);
      setEditingVirtualDrill(null);
      await fetchVirtualDrills();
    } catch (error) {
      console.error('Error saving virtual drill:', error);
      alert(error.response?.data?.message || 'Failed to save virtual drill');
    } finally {
      setSavingVirtualDrill(false);
    }
  };

  const handleScheduleDrill = async () => {
    try {
      if (!newDrill.title || !newDrill.date || !newDrill.time) {
        alert('Please fill in all required fields');
        return;
      }

      const drillData = {
        title: newDrill.title,
        disasterType: newDrill.disasterType,
        scheduledDate: newDrill.date,
        time: newDrill.time,
        class: newDrill.class,
      };

      await drillAPI.scheduleDrill(drillData, token);
      setShowDrillModal(false);
      setNewDrill({ title: '', date: '', time: '', class: '', disasterType: 'fire' });
      await fetchDrills();
      alert(`✓ Drill "${drillData.title}" scheduled successfully!`);
    } catch (error) {
      console.error('Error scheduling drill:', error);
      const errorMsg = error.response?.data?.message || 'Failed to schedule drill';
      alert(`❌ ${errorMsg}`);
    }
  };

  const handleOpenDisasterModal = (disaster = null) => {
    if (disaster) {
      setEditingDisaster(disaster);
      setDisasterFormData({
        name: disaster.name || '',
        displayName: disaster.displayName || '',
        icon: disaster.icon || '🌍',
        description: disaster.description || '',
        safetyTips: disaster.safetyTips || [],
        emergencySupplies: disaster.emergencySupplies || [],
        warningSignals: disaster.warningSignals || [],
        evacuationGuidelines: disaster.evacuationGuidelines || '',
        commonInRegions: disaster.commonInRegions || [],
        severity: disaster.severity || 'medium',
        isActive: disaster.isActive !== undefined ? disaster.isActive : true,
      });
    } else {
      setEditingDisaster(null);
      setDisasterFormData({
        name: '',
        displayName: '',
        icon: '🌍',
        description: '',
        safetyTips: [],
        emergencySupplies: [],
        warningSignals: [],
        evacuationGuidelines: '',
        commonInRegions: [],
        severity: 'medium',
        isActive: true,
      });
    }
    setShowDisasterModal(true);
  };

  const handleSaveDisaster = async () => {
    try {
      if (!disasterFormData.name || !disasterFormData.displayName || !disasterFormData.description) {
        alert('❌ Please fill in required fields (Name, Display Name, Description)');
        return;
      }

      if (editingDisaster) {
        await disasterTypeAPI.update(editingDisaster._id, disasterFormData, token);
        alert('✓ Disaster type updated successfully!');
      } else {
        await disasterTypeAPI.create(disasterFormData, token);
        alert('✓ Disaster type created successfully!');
      }

      setShowDisasterModal(false);
      setEditingDisaster(null);
      await fetchDisasterTypes();
    } catch (error) {
      console.error('Error saving disaster type:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save disaster type';
      alert(`❌ ${errorMessage}`);
    }
  };

  const handleDeleteDisaster = async (disasterId, disasterName) => {
    if (confirm(`Are you sure you want to delete "${disasterName}"?`)) {
      try {
        await disasterTypeAPI.delete(disasterId, token);
        alert('✓ Disaster type deleted successfully!');
        await fetchDisasterTypes();
      } catch (error) {
        console.error('Error deleting disaster type:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete disaster type';
        alert(`❌ ${errorMessage}`);
      }
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.delete(quizId, token);
        alert('✓ Quiz deleted successfully!');
        await fetchQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz');
      }
    }
  };

  // Calculate student progress based on completed vs assigned modules
  const calculateStudentProgress = (student) => {
    if (!student) return 0;
    
    const assignedCount = student.assignedModules?.length || 0;
    const completedCount = student.completedModules?.length || 0;
    
    if (assignedCount === 0) return 0;
    
    const progress = Math.round((completedCount / assignedCount) * 100);
    return Math.min(progress, 100);
  };

  // Export report handler for admin
  const handleExportAdminReport = () => {
    try {
      const reportDate = new Date().toLocaleDateString();
      const reportTime = new Date().toLocaleTimeString();
      
      // Calculate statistics
      const students = users.filter(u => u.role === 'student');
      const teachers = users.filter(u => u.role === 'teacher');
      const avgProgress = students.length > 0 
        ? Math.round(students.reduce((sum, s) => sum + calculateStudentProgress(s), 0) / students.length)
        : 0;
      
      // Create CSV content
      let csvContent = "Admin System Report\n";
      csvContent += `Generated: ${reportDate} ${reportTime}\n\n`;
      
      csvContent += "=== SYSTEM OVERVIEW ===\n";
      csvContent += `Total Users,${users.length}\n`;
      csvContent += `Students,${students.length}\n`;
      csvContent += `Teachers,${teachers.length}\n`;
      csvContent += `Admins,${users.filter(u => u.role === 'admin').length}\n`;
      csvContent += `Average Student Progress,${avgProgress}%\n`;
      csvContent += `Total Learning Modules,${modules.length}\n`;
      csvContent += `Total Quizzes,${quizzes.length}\n`;
      csvContent += `Total Drills,${drills.length}\n`;
      csvContent += `Scheduled Drills,${scheduledDrills.length}\n`;
      csvContent += `Active Alerts,${alerts.length}\n`;
      csvContent += `Disaster Types,${disasterTypes.length}\n\n`;
      
      csvContent += "=== USER DETAILS ===\n";
      csvContent += "Name,Email,Role,School,Region,Created\n";
      users.forEach(user => {
        csvContent += `"${user.name}","${user.email}","${user.role}","${user.school || 'N/A'}","${user.region || 'N/A'}","${new Date(user.createdAt).toLocaleDateString()}"\n`;
      });
      
      csvContent += "\n=== STUDENT PROGRESS ===\n";
      csvContent += "Name,Email,School,Progress,Completed Modules,Assigned Modules\n";
      students.forEach(student => {
        const progress = calculateStudentProgress(student);
        const completed = student.completedModules?.length || 0;
        const assigned = student.assignedModules?.length || 0;
        csvContent += `"${student.name}","${student.email}","${student.school || 'N/A'}",${progress}%,${completed},${assigned}\n`;
      });
      
      csvContent += "\n=== LEARNING MODULES ===\n";
      csvContent += "Title,Type,Difficulty,Created\n";
      modules.forEach(module => {
        csvContent += `"${module.title}","${module.type || 'N/A'}","${module.difficulty || 'N/A'}","${new Date(module.createdAt).toLocaleDateString()}"\n`;
      });
      
      csvContent += "\n=== ALERTS ===\n";
      csvContent += "Title,Disaster Type,Severity,Region,Created\n";
      alerts.forEach(alert => {
        const regions = Array.isArray(alert.regions) ? alert.regions.join('; ') : alert.regions || 'N/A';
        csvContent += `"${alert.title}","${alert.disasterType || 'N/A'}","${alert.severity || 'N/A'}","${regions}","${new Date(alert.createdAt).toLocaleDateString()}"\n`;
      });
      
      csvContent += "\n=== DISASTER TYPES ===\n";
      csvContent += "Name,Display Name,Severity,Icon\n";
      disasterTypes.forEach(disaster => {
        csvContent += `"${disaster.name}","${disaster.displayName}","${disaster.severity || 'N/A'}","${disaster.icon}"\n`;
      });
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Admin_System_Report_${reportDate.replace(/\//g, '-')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('✓ System report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('❌ Failed to export report. Please try again.');
    }
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', color: 'blue' },
    { id: 'users', icon: '👥', label: 'User Management', color: 'green' },
    { id: 'disasters', icon: '🌍', label: 'Disaster Management', color: 'orange' },
    { id: 'modules', icon: '📚', label: 'Learning Modules', color: 'purple' },
    { id: 'drills', icon: '🧪', label: 'Drill Management', color: 'cyan' },
    { id: 'alerts', icon: '🚨', label: 'Alerts & Notifications', color: 'red' },
    { id: 'reports', icon: '📈', label: 'Reports & Analytics', color: 'indigo' },
    { id: 'settings', icon: '⚙️', label: 'Settings', color: 'gray' },
  ];

  // Stats Cards Data
  const statsCards = [
    { 
      title: 'Total Students', 
      value: userStats?.studentCount || 0, 
      icon: '👨‍🎓', 
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    { 
      title: 'Total Teachers', 
      value: userStats?.teacherCount || 0, 
      icon: '👩‍🏫', 
      gradient: 'from-green-500 to-teal-500',
      change: '+5%'
    },
    { 
      title: 'Total Drills', 
      value: drillStats?.totalDrills || 0, 
      icon: '🧪', 
      gradient: 'from-purple-500 to-pink-500',
      change: '+8%'
    },
    { 
      title: 'Total Modules', 
      value: modules.length, 
      icon: '📚', 
      gradient: 'from-orange-500 to-red-500',
      change: '+15%'
    },
  ];

  // Chart Data
  const userChartData = [
    { name: 'Students', value: userStats?.studentCount || 0 },
    { name: 'Teachers', value: userStats?.teacherCount || 0 },
    { name: 'Admins', value: userStats?.adminCount || 1 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];
  const availableRegions = [...new Set((users || []).map(u => u.region).filter(Boolean))].sort();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ⚙️
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-r border-white/10 flex-shrink-0 overflow-hidden`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg">
              🛡️
            </div>
            <div>
              <h2 className="text-xl font-black text-white">PrepSafe</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-cyan-300'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200">
              <span className="text-2xl">🚪</span>
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
              >
                ☰
              </button>
              <div>
                <h1 className="text-2xl font-black text-white">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-400">Welcome back, Admin!</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenAlertModal}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <span>🚨</span> Send Alert
              </motion.button>

              {/* Admin Profile */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardHome statsCards={statsCards} userChartData={userChartData} COLORS={COLORS} users={users} alerts={alerts} drills={drills} modules={modules} />
            )}
            {activeTab === 'users' && <UserManagement users={users} onDeleteUser={handleDeleteUser} setShowUserModal={setShowUserModal} />}
            {activeTab === 'disasters' && <DisasterManagement disasterTypes={disasterTypes} onEdit={handleOpenDisasterModal} onDelete={handleDeleteDisaster} onAdd={handleOpenDisasterModal} />}
            {activeTab === 'modules' && <ModuleManagement modules={modules} onDeleteModule={handleDeleteModule} onCreateModule={handleOpenCreateModuleModal} onEditModule={handleOpenEditModuleModal} token={token} />}
            {activeTab === 'drills' && (
              <DrillManagement
                scheduledDrills={scheduledDrills}
                virtualDrills={virtualDrills}
                onDeleteDrill={handleDeleteDrill}
                onEditScheduledDrill={handleEditScheduledDrill}
                onDeleteVirtualDrill={handleDeleteVirtualDrill}
                onEditVirtualDrill={handleEditVirtualDrill}
                onCreateVirtualDrill={handleCreateVirtualDrill}
                onScheduleDrill={() => setShowDrillModal(true)}
              />
            )}
            {activeTab === 'alerts' && <AlertsManagement alerts={alerts} onOpenAlertModal={handleOpenAlertModal} />}
            {activeTab === 'reports' && <ReportsAnalytics userStats={userStats} drillStats={drillStats} modules={modules} quizzes={quizzes} onExport={handleExportAdminReport} />}
            {activeTab === 'settings' && (
              <SettingsPage
                settingsData={settingsData}
                setSettingsData={setSettingsData}
                users={users}
                onSave={handleSaveSettings}
                isSaving={savingSettings}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Create Module Modal */}
      <AnimatePresence>
        {showCreateModuleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowCreateModuleModal(false);
              setEditingModule(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span>📚</span> {editingModule ? 'Edit Learning Module' : 'Create New Learning Module'}
              </h2>
              <ModuleForm 
                onSubmit={editingModule ? handleUpdateModule : handleCreateModule}
                onCancel={() => {
                  setShowCreateModuleModal(false);
                  setEditingModule(null);
                }}
                initialData={editingModule}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      <AnimatePresence>
        {showAlertModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl"
            >
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span>🚨</span> Send Emergency Alert
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Alert Title</label>
                  <input
                    type="text"
                    value={alertData.title}
                    onChange={(e) => setAlertData({ ...alertData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Fire Drill Tomorrow"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea
                    value={alertData.description}
                    onChange={(e) => setAlertData({ ...alertData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    placeholder="Provide details about the alert..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Disaster Type</label>
                    <select
                      value={alertData.disasterType}
                      onChange={(e) => setAlertData({ ...alertData, disasterType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="earthquake" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Earthquake</option>
                      <option value="fire" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Fire</option>
                      <option value="flood" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Flood</option>
                      <option value="cyclone" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Cyclone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Severity</label>
                    <select
                      value={alertData.severity}
                      onChange={(e) => setAlertData({ ...alertData, severity: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Low</option>
                      <option value="medium" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Medium</option>
                      <option value="high" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>High</option>
                      <option value="critical" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Target Region</label>
                  <select
                    value={alertData.regions?.[0] || 'All'}
                    onChange={(e) => setAlertData({ ...alertData, regions: e.target.value === 'All' ? [] : [e.target.value] })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>All Regions (Broadcast)</option>
                    {availableRegions.map((region) => (
                      <option key={region} value={region} style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendAlert}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:shadow-xl transition-all"
                >
                  Send Alert
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAlertModal(false)}
                  className="px-6 py-3 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drill Modal */}
      <AnimatePresence>
        {showDrillModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDrillModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
            >
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span>🧪</span> Schedule Drill
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Drill Title</label>
                  <input
                    type="text"
                    value={newDrill.title}
                    onChange={(e) => setNewDrill({ ...newDrill, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Fire Drill"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Disaster Type</label>
                  <select
                    value={newDrill.disasterType}
                    onChange={(e) => setNewDrill({ ...newDrill, disasterType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fire" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Fire</option>
                    <option value="earthquake" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Earthquake</option>
                    <option value="flood" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Flood</option>
                    <option value="cyclone" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Cyclone</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      value={newDrill.date}
                      onChange={(e) => setNewDrill({ ...newDrill, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Time</label>
                    <input
                      type="time"
                      value={newDrill.time}
                      onChange={(e) => setNewDrill({ ...newDrill, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Class</label>
                  <input
                    type="text"
                    value={newDrill.class}
                    onChange={(e) => setNewDrill({ ...newDrill, class: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10A, 9B"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScheduleDrill}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-xl transition-all"
                >
                  Schedule Drill
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDrillModal(false)}
                  className="px-6 py-3 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Virtual Drill Modal */}
      <AnimatePresence>
        {showVirtualDrillModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVirtualDrillModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 max-w-lg w-full border border-white/10 shadow-2xl"
            >
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span>🎮</span> {editingVirtualDrill ? 'Edit Virtual Drill' : 'Create Virtual Drill'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={virtualDrillForm.title}
                    onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Earthquake Drill"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea
                    value={virtualDrillForm.description}
                    onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Virtual simulation description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Disaster Type</label>
                    <select
                      value={virtualDrillForm.disasterType}
                      onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, disasterType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="earthquake" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Earthquake</option>
                      <option value="fire" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Fire</option>
                      <option value="flood" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Flood</option>
                      <option value="cyclone" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Cyclone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Icon</label>
                    <input
                      type="text"
                      value={virtualDrillForm.icon}
                      onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, icon: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-2xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      value={virtualDrillForm.date}
                      onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Time</label>
                    <input
                      type="time"
                      value={virtualDrillForm.time}
                      onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={virtualDrillForm.isActive}
                    onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, isActive: e.target.checked })}
                    className="w-5 h-5"
                  />
                  Active for students
                </label>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveVirtualDrill}
                  disabled={savingVirtualDrill}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {savingVirtualDrill ? 'Saving...' : (editingVirtualDrill ? 'Update Virtual Drill' : 'Create Virtual Drill')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowVirtualDrillModal(false)}
                  className="px-6 py-3 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Creation Modal */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl"
            >
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span>👤</span> Create New User
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min 6 characters"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Role</label>
                    <select
                      value={newUserData.role}
                      onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="student" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Student</option>
                      <option value="teacher" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Teacher</option>
                      <option value="admin" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Region</label>
                    <input
                      type="text"
                      value={newUserData.region}
                      onChange={(e) => setNewUserData({ ...newUserData, region: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Metro Manila"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">School</label>
                  <input
                    type="text"
                    value={newUserData.school}
                    onChange={(e) => setNewUserData({ ...newUserData, school: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter school name"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateUser}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:shadow-xl transition-all"
                >
                  Create User
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUserModal(false)}
                  className="px-6 py-3 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disaster Type Modal */}
      <AnimatePresence>
        {showDisasterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 max-w-3xl w-full border border-white/10 shadow-2xl my-8"
            >
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span>🌍</span> {editingDisaster ? 'Edit Disaster Type' : 'Create Disaster Type'}
              </h2>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Name (lowercase, no spaces)*</label>
                    <input
                      type="text"
                      value={disasterFormData.name}
                      onChange={(e) => setDisasterFormData({ ...disasterFormData, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., earthquake"
                      disabled={editingDisaster}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Display Name*</label>
                    <input
                      type="text"
                      value={disasterFormData.displayName}
                      onChange={(e) => setDisasterFormData({ ...disasterFormData, displayName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Earthquake"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Icon Emoji</label>
                    <input
                      type="text"
                      value={disasterFormData.icon}
                      onChange={(e) => setDisasterFormData({ ...disasterFormData, icon: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-3xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="🌍"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Severity</label>
                    <select
                      value={disasterFormData.severity}
                      onChange={(e) => setDisasterFormData({ ...disasterFormData, severity: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Low</option>
                      <option value="medium" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Medium</option>
                      <option value="high" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>High</option>
                      <option value="critical" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Critical</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={disasterFormData.isActive}
                        onChange={(e) => setDisasterFormData({ ...disasterFormData, isActive: e.target.checked })}
                        className="w-5 h-5 rounded bg-white/10 border-white/20"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Description*</label>
                  <textarea
                    value={disasterFormData.description}
                    onChange={(e) => setDisasterFormData({ ...disasterFormData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Describe this disaster type..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Evacuation Guidelines</label>
                  <textarea
                    value={disasterFormData.evacuationGuidelines}
                    onChange={(e) => setDisasterFormData({ ...disasterFormData, evacuationGuidelines: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                    placeholder="Evacuation procedures and guidelines..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Common Regions (comma-separated)</label>
                  <input
                    type="text"
                    value={disasterFormData.commonInRegions.join(', ')}
                    onChange={(e) => setDisasterFormData({ ...disasterFormData, commonInRegions: e.target.value.split(',').map(r => r.trim()).filter(Boolean) })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Metro Manila, Cebu, Davao"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveDisaster}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:shadow-xl transition-all"
                >
                  {editingDisaster ? 'Update' : 'Create'} Disaster Type
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDisasterModal(false)}
                  className="px-6 py-3 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ statsCards, userChartData, COLORS, users, alerts, drills, modules }) => {
  // Helper function to get relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
    return then.toLocaleDateString();
  };

  // Generate real activity data from existing data
  const generateRecentActivity = () => {
    const activities = [];
    
    // Add recent users
    if (users && users.length > 0) {
      users.slice(0, 2).forEach(u => {
        activities.push({
          icon: u.role === 'student' ? '👨‍🎓' : u.role === 'teacher' ? '👩‍🏫' : '🛡️',
          text: `${u.name} registered as ${u.role}`,
          time: getRelativeTime(u.createdAt || new Date()),
          color: u.role === 'student' ? 'blue' : u.role === 'teacher' ? 'purple' : 'pink',
          timestamp: new Date(u.createdAt || new Date())
        });
      });
    }
    
    // Add recent alerts
    if (alerts && alerts.length > 0) {
      alerts.slice(0, 2).forEach(alert => {
        activities.push({
          icon: '🚨',
          text: `Alert: ${alert.title}`,
          time: getRelativeTime(alert.createdAt || new Date()),
          color: alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'yellow',
          timestamp: new Date(alert.createdAt || new Date())
        });
      });
    }
    
    // Add recent drills
    if (drills && drills.length > 0) {
      drills.slice(0, 1).forEach(drill => {
        activities.push({
          icon: '🧪',
          text: `${drill.disasterType} drill created`,
          time: getRelativeTime(drill.createdAt || new Date()),
          color: 'purple',
          timestamp: new Date(drill.createdAt || new Date())
        });
      });
    }
    
    // Add recent modules
    if (modules && modules.length > 0) {
      modules.slice(0, 1).forEach(module => {
        activities.push({
          icon: '📚',
          text: `Module: ${module.title}`,
          time: getRelativeTime(module.createdAt || new Date()),
          color: 'green',
          timestamp: new Date(module.createdAt || new Date())
        });
      });
    }
    
    // Sort by timestamp (most recent first) and limit to 5
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  };

  const recentActivity = generateRecentActivity();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                {card.icon}
              </div>
              <span className="text-green-400 text-sm font-semibold">{card.change}</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">{card.title}</h3>
            <p className="text-4xl font-black text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold text-white mb-6">User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r from-${activity.color}-500 to-${activity.color}-600 flex items-center justify-center`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{activity.text}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Placeholder Components for other tabs
const UserManagement = ({ users, onDeleteUser, setShowUserModal }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-black text-white">👥 User Management</h2>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-400">Total Users: {users.length}</div>
        <button 
          onClick={() => setShowUserModal(true)}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold hover:shadow-xl transition-all flex items-center gap-2"
        >
          <span>+</span> Add User
        </button>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Email</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Role</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">School</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users && users.length > 0 ? users.map((user, idx) => (
            <tr key={user._id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 text-white">{user.name}</td>
              <td className="px-6 py-4 text-gray-300">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                  user.role === 'teacher' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-300">{user.school || 'N/A'}</td>
              <td className="px-6 py-4">
                {user.role !== 'admin' ? (
                  <button
                    onClick={() => onDeleteUser(user._id, user.name)}
                    className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Delete
                  </button>
                ) : (
                  <span className="px-3 py-1 text-gray-500 text-sm">Protected</span>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const DisasterManagement = ({ disasterTypes, onEdit, onDelete, onAdd }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-black text-white">🌍 Disaster Management</h2>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-400">Total Types: {disasterTypes.length}</div>
        <button 
          onClick={() => onAdd()}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:shadow-xl transition-all flex items-center gap-2"
        >
          <span>+</span> Add Disaster Type
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {disasterTypes && disasterTypes.length > 0 ? disasterTypes.map((disaster) => (
        <motion.div
          key={disaster._id}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-5xl">{disaster.icon}</div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                disaster.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                disaster.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                disaster.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                {disaster.severity}
              </span>
              {disaster.isActive && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                  Active
                </span>
              )}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">{disaster.displayName}</h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{disaster.description}</p>
          
          {disaster.safetyTips && disaster.safetyTips.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Safety Tips: {disaster.safetyTips.length}</p>
            </div>
          )}
          
          {disaster.commonInRegions && disaster.commonInRegions.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-400">Regions: {disaster.commonInRegions.slice(0, 2).join(', ')}{disaster.commonInRegions.length > 2 ? '...' : ''}</p>
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(disaster)}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm font-semibold"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(disaster._id, disaster.displayName)}
              className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-semibold"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )) : (
        <div className="col-span-3 text-center py-12">
          <div className="text-6xl mb-4">🌍</div>
          <p className="text-gray-400 mb-4">No disaster types found</p>
          <button
            onClick={() => onAdd()}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:shadow-xl transition-all"
          >
            Add Your First Disaster Type
          </button>
        </div>
      )}
    </div>
  </motion.div>
);

const ModuleManagement = ({ modules, onDeleteModule, onCreateModule, onEditModule }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-black text-white">📚 Learning Modules</h2>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-400">Total Modules: {modules.length}</div>
        <button
          onClick={onCreateModule}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:shadow-xl transition-all"
        >
          + Create Module
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules && modules.length > 0 ? modules.map((module, idx) => (
        <div key={module._id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all">
          <div className="text-3xl mb-4">
            {module.disasterType === 'fire' ? '🔥' :
             module.disasterType === 'earthquake' ? '🌍' :
             module.disasterType === 'flood' ? '🌊' :
             module.disasterType === 'cyclone' ? '🌪️' : '📚'}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{module.description}</p>
          <p className="text-gray-400 text-xs mb-4">{module.quiz?.length || 0} quiz questions • {module.estimatedTime || 0} min</p>
          <div className="flex gap-2">
            <button
              onClick={() => onEditModule(module)}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={() => onDeleteModule(module._id)}
              className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors">
              Delete
            </button>
          </div>
        </div>
      )) : (
        <div className="col-span-full text-center py-12 text-gray-400">
          No modules found
        </div>
      )}
    </div>
  </motion.div>
);

const DrillManagement = ({
  scheduledDrills,
  virtualDrills,
  onDeleteDrill,
  onEditScheduledDrill,
  onDeleteVirtualDrill,
  onEditVirtualDrill,
  onCreateVirtualDrill,
  onScheduleDrill,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-black text-white">🧪 Drill Management</h2>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-400">Scheduled: {scheduledDrills?.length || 0} | Virtual: {virtualDrills?.length || 0}</div>
        <button
          onClick={onScheduleDrill}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-xl transition-all"
        >
          + Schedule Drill
        </button>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 text-white font-semibold">Scheduled Drills</div>
      <table className="w-full">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Title</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Type</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Scheduled Date</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Class</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {scheduledDrills && scheduledDrills.length > 0 ? scheduledDrills.map((drill) => (
            <tr key={drill._id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 text-white">{drill.title}</td>
              <td className="px-6 py-4">
                <span className="capitalize text-gray-300">{drill.disasterType}</span>
              </td>
              <td className="px-6 py-4 text-gray-300">
                {new Date(drill.scheduledDate).toLocaleDateString()} {new Date(drill.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-6 py-4 text-gray-300">{drill.class || 'All'}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditScheduledDrill(drill)}
                    className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteDrill(drill._id)}
                    className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                No scheduled drills
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Virtual Drills</h3>
          <p className="text-sm text-gray-400">Manage the drill cards shown to students</p>
        </div>
        <button
          onClick={onCreateVirtualDrill}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:shadow-xl transition-all"
        >
          + Create Virtual Drill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {virtualDrills && virtualDrills.length > 0 ? virtualDrills.map((drill) => {
          const scheduledDate = new Date(drill.scheduledDate);
          const isUpcoming = scheduledDate > new Date();

          return (
            <motion.div
              key={drill._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{drill.icon || '🧪'}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${drill.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                  {drill.isActive ? (isUpcoming ? 'Upcoming' : 'Available') : 'Inactive'}
                </span>
              </div>

              <h4 className="text-xl font-bold text-white mb-2">{drill.title}</h4>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{drill.description || 'Virtual simulation'}</p>

              <div className="space-y-2 text-sm text-gray-400 mb-4">
                <p><span className="text-gray-500">Type:</span> <span className="capitalize text-gray-200">{drill.disasterType}</span></p>
                <p><span className="text-gray-500">Date:</span> {scheduledDate.toLocaleDateString()}</p>
                <p><span className="text-gray-500">Time:</span> {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEditVirtualDrill(drill)}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteVirtualDrill(drill._id)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          );
        }) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            No virtual drills found
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const AlertsManagement = ({ alerts, onOpenAlertModal }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-black text-white">🚨 Alerts & Notifications</h2>
      <button 
        onClick={onOpenAlertModal}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:shadow-xl transition-all">
        + Send Alert
      </button>
    </div>
    
    <div className="space-y-4">
      {alerts && alerts.length > 0 ? alerts.slice(0, 10).map((alert) => (
        <div key={alert._id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="text-3xl">
                {alert.disasterType === 'fire' ? '🔥' :
                 alert.disasterType === 'earthquake' ? '🌍' :
                 alert.disasterType === 'flood' ? '🌊' :
                 alert.disasterType === 'cyclone' ? '🌪️' : '🚨'}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{alert.title}</h3>
                <p className="text-gray-300 text-sm mb-2">{alert.description}</p>
                <p className="text-gray-400 text-xs">{new Date(alert.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              alert.severity === 'high' ? 'bg-red-500/20 text-red-300' :
              alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-green-500/20 text-green-300'
            }`}>
              {alert.severity}
            </span>
          </div>
        </div>
      )) : (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
          <p className="text-gray-400">No alerts sent yet</p>
        </div>
      )}
    </div>
  </motion.div>
);

const ReportsAnalytics = ({ userStats, drillStats, modules, quizzes, onExport }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black text-white">📈 Reports & Analytics</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExport}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-shadow"
        >
          📥 Export System Report
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="text-sm text-gray-400 mb-2">Total Users</div>
          <div className="text-3xl font-bold text-white">{userStats?.totalUsers || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Students: {userStats?.studentCount || 0} • Teachers: {userStats?.teacherCount || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="text-sm text-gray-400 mb-2">Total Drills</div>
          <div className="text-3xl font-bold text-white">{drillStats?.totalDrills || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Avg Score: {drillStats?.averageScore?.toFixed(1) || 0}%</div>
        </div>
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="text-sm text-gray-400 mb-2">Learning Modules</div>
          <div className="text-3xl font-bold text-white">{modules?.length || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Active content</div>
        </div>
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="text-sm text-gray-400 mb-2">Quizzes</div>
          <div className="text-3xl font-bold text-white">{quizzes?.length || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Assessment tools</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">User Statistics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Students</span>
              <span className="text-white font-bold">{userStats?.studentCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Teachers</span>
              <span className="text-white font-bold">{userStats?.teacherCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Administrators</span>
              <span className="text-white font-bold">{userStats?.adminCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Avg Preparedness Score</span>
              <span className="text-white font-bold">{userStats?.averagePreparednessScore?.toFixed(1) || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Content Statistics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Learning Modules</span>
              <span className="text-white font-bold">{modules?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Quizzes</span>
              <span className="text-white font-bold">{quizzes?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Drills Completed</span>
              <span className="text-white font-bold">{drillStats?.totalDrills || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Avg Drill Score</span>
              <span className="text-white font-bold">{drillStats?.averageScore?.toFixed(1) || 0}%</span>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

const SettingsPage = ({ settingsData, setSettingsData, users, onSave, isSaving }) => {
  const availableRegions = [...new Set((users || []).map((u) => u.region).filter(Boolean))].sort();

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <h2 className="text-3xl font-black text-white">⚙️ Settings</h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Admin Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={settingsData.name}
              onChange={(e) => setSettingsData({ ...settingsData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">School</label>
            <input
              type="text"
              value={settingsData.school}
              onChange={(e) => setSettingsData({ ...settingsData, school: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Region</label>
            <input
              type="text"
              value={settingsData.region}
              onChange={(e) => setSettingsData({ ...settingsData, region: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Metro Manila"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Alert Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Default Alert Region</label>
            <select
              value={settingsData.defaultAlertRegion}
              onChange={(e) => setSettingsData({ ...settingsData, defaultAlertRegion: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>All Regions</option>
              {availableRegions.map((region) => (
                <option key={region} value={region} style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Default Alert Severity</label>
            <select
              value={settingsData.defaultAlertSeverity}
              onChange={(e) => setSettingsData({ ...settingsData, defaultAlertSeverity: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Low</option>
              <option value="medium" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Medium</option>
              <option value="high" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>High</option>
              <option value="critical" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Critical</option>
            </select>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              id="notificationsEnabled"
              type="checkbox"
              checked={settingsData.notificationsEnabled}
              onChange={(e) => setSettingsData({ ...settingsData, notificationsEnabled: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="notificationsEnabled" className="text-sm text-gray-300">
              Enable notifications for admin actions
            </label>
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-end">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSave}
        disabled={isSaving}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save Settings'}
      </motion.button>
    </div>
  </motion.div>
  );
};
