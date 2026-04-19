import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userAPI, drillAPI, moduleAPI, alertAPI, quizAPI, disasterTypeAPI, virtualDrillAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ModuleForm from '../components/ModuleForm';

export const TeacherDashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [drills, setDrills] = useState([]);
  const [scheduledDrills, setScheduledDrills] = useState([]);
  const [virtualDrills, setVirtualDrills] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [disasterTypes, setDisasterTypes] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [loading, setLoading] = useState(true);

  // Alert State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    description: '',
    disasterType: 'other',
    severity: 'medium',
    regions: [],
    actionItems: []
  });
  const [alerts, setAlerts] = useState([]);

  // Student Modal State
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    school: '',
    class: '',
    rollNumber: '',
  });

  // Edit Student Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Assign Module Modal State
  const [showAssignModuleModal, setShowAssignModuleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Create Module Modal State
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);

  // Drill Modal State
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

  // Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQuizResultsModal, setShowQuizResultsModal] = useState(false);
  const [selectedQuizForResults, setSelectedQuizForResults] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    disasterType: 'general',
    timeLimit: 30,
    passingScore: 70,
    questions: [],
  });

  // Disaster Type Modal State
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
    fetchData();
    fetchAlerts();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch students, modules, drills, quizzes, disasters
      console.log('Fetching students with token:', token ? 'Token exists' : 'No token');
      const studentsRes = await userAPI.getAll(token);
      console.log('Students response:', studentsRes.data);
      
      const modulesRes = await moduleAPI.getAll();
      const drillsRes = await drillAPI.getAll(token);
      const scheduledDrillsRes = await drillAPI.getScheduledDrills(token);
      const virtualDrillsRes = await virtualDrillAPI.getAll(false, token);
      const quizzesRes = await quizAPI.getAll(token);
      const disastersRes = await disasterTypeAPI.getAll(true);
      
      const studentsList = studentsRes.data.filter(u => u.role === 'student');
      console.log('Filtered students:', studentsList);
      
      setStudents(studentsList);
      setModules(modulesRes.data);
      setDrills(drillsRes.data);
      setScheduledDrills(scheduledDrillsRes.data);
      setVirtualDrills(Array.isArray(virtualDrillsRes.data) ? virtualDrillsRes.data : []);
      setQuizzes(quizzesRes.data);
      setDisasterTypes(disastersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await alertAPI.getAll(user?.region || 'All', token);
      setAlerts(res.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
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
      setAlertData({ 
        title: '', 
        description: '', 
        disasterType: 'other', 
        severity: 'medium',
        regions: [],
        actionItems: []
      });
      alert('✓ Alert sent successfully!');
      fetchAlerts(); // Refresh alerts list
    } catch (error) {
      console.error('Error sending alert:', error);
      alert('Failed to send alert: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddStudent = async () => {
    try {
      // Validate required fields
      if (!newStudent.name || !newStudent.email) {
        alert('Please fill in all required fields (Name and Email)');
        return;
      }

      // Create student account with default password
      const studentData = {
        name: newStudent.name,
        email: newStudent.email,
        password: 'student123', // Default password
        role: 'student',
        school: newStudent.school || user?.school || 'N/A',
        region: user?.region || 'North',
      };

      console.log('Creating student:', studentData);
      const response = await userAPI.createStudent(studentData);
      console.log('Student created:', response.data);
      
      setShowStudentModal(false);
      setNewStudent({ name: '', email: '', school: '', class: '', rollNumber: '' });
      alert('✓ Student added successfully! Default password: student123');
      
      // Refresh student list
      console.log('Refreshing student list...');
      await fetchData();
    } catch (error) {
      console.error('Error adding student:', error);
      console.error('Error response:', error.response);
      if (error.response?.data?.message) {
        alert('Failed to add student: ' + error.response.data.message);
      } else {
        alert('Failed to add student. Email might already exist.');
      }
    }
  };

  const handleScheduleDrill = async () => {
    try {
      // Validate required fields
      if (!newDrill.title || !newDrill.date || !newDrill.time) {
        alert('Please fill in all required fields');
        return;
      }

      // Call the new API endpoint to schedule drill
      const drillData = {
        title: newDrill.title,
        disasterType: newDrill.disasterType,
        scheduledDate: newDrill.date,
        time: newDrill.time,
        class: newDrill.class,
      };

      const response = await drillAPI.scheduleDrill(drillData, token);
      console.log('Drill scheduled:', response.data);
      
      setShowDrillModal(false);
      setNewDrill({ title: '', date: '', time: '', class: '', disasterType: 'fire' });
      
      // Refresh the drill list
      await fetchData();
      
      alert(`✓ Drill "${newDrill.title}" scheduled successfully!`);
      
      // Optionally send an alert notification to students (non-blocking)
      try {
        const alertData = {
          title: `Scheduled: ${newDrill.title}`,
          description: `${newDrill.title} scheduled for ${newDrill.date} at ${newDrill.time}${newDrill.class ? ` - Class: ${newDrill.class}` : ''}. Please be prepared.`,
          disasterType: newDrill.disasterType,
          severity: 'medium',
          region: user?.region || 'All',
        };

        await alertAPI.create(alertData, token);
        console.log('Alert notification sent successfully');
      } catch (alertError) {
        console.error('Failed to send alert notification (non-critical):', alertError);
      }
      
    } catch (error) {
      console.error('Error scheduling drill:', error);
      const errorMsg = error.response?.data?.message || 'Failed to schedule drill';
      alert(`❌ ${errorMsg}`);
    }
  };

  const handleDeleteScheduledDrill = async (drillId) => {
    if (!confirm('Are you sure you want to delete this scheduled drill?')) {
      return;
    }

    try {
      await drillAPI.deleteDrill(drillId, token);
      await fetchData();
      alert('✓ Scheduled drill deleted successfully!');
    } catch (error) {
      console.error('Error deleting scheduled drill:', error);
      alert(error.response?.data?.message || 'Failed to delete scheduled drill');
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

      await fetchData();
      alert('✓ Scheduled drill updated successfully!');
    } catch (error) {
      console.error('Error updating scheduled drill:', error);
      alert(error.response?.data?.message || 'Failed to update scheduled drill');
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
      await fetchData();
    } catch (error) {
      console.error('Error saving virtual drill:', error);
      alert(error.response?.data?.message || 'Failed to save virtual drill');
    } finally {
      setSavingVirtualDrill(false);
    }
  };

  const handleDeleteVirtualDrill = async (drillId) => {
    if (!confirm('Are you sure you want to delete this virtual drill?')) {
      return;
    }

    try {
      await virtualDrillAPI.delete(drillId, token);
      await fetchData();
      alert('✓ Virtual drill deleted successfully!');
    } catch (error) {
      console.error('Error deleting virtual drill:', error);
      alert(error.response?.data?.message || 'Failed to delete virtual drill');
    }
  };

  // Quiz handlers
  const handleCreateQuiz = () => {
    setNewQuiz({
      title: '',
      description: '',
      disasterType: 'general',
      timeLimit: 30,
      passingScore: 70,
      questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', points: 1 }],
    });
    setShowQuizModal(true);
  };

  const handleAddQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', points: 1 }],
    });
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = newQuiz.questions.filter((_, i) => i !== index);
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[index][field] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleSaveQuiz = async () => {
    try {
      if (!newQuiz.title || newQuiz.questions.length === 0) {
        alert('Please provide a title and at least one question');
        return;
      }

      // Validate all questions
      for (let i = 0; i < newQuiz.questions.length; i++) {
        const q = newQuiz.questions[i];
        if (!q.question || q.options.some(opt => !opt)) {
          alert(`Please complete all fields for question ${i + 1}`);
          return;
        }
      }

      const response = await quizAPI.create(newQuiz, token);
      console.log('Quiz created:', response.data);
      
      setShowQuizModal(false);
      await fetchData();
      alert(`✓ Quiz "${newQuiz.title}" created successfully!`);
    } catch (error) {
      console.error('Error creating quiz:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create quiz';
      alert(`❌ ${errorMsg}`);
    }
  };

  const handleViewResults = async (quiz) => {
    try {
      const response = await quizAPI.getQuizResults(quiz._id, token);
      setQuizResults(response.data);
      setSelectedQuizForResults(quiz);
      setShowQuizResultsModal(true);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      alert('Failed to fetch quiz results');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.delete(quizId, token);
        await fetchData();
        alert('✓ Quiz deleted successfully!');
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
    
    // If no modules assigned, return 0
    if (assignedCount === 0) return 0;
    
    // Calculate percentage
    const progress = Math.round((completedCount / assignedCount) * 100);
    return Math.min(progress, 100); // Cap at 100%
  };

  // Student action handlers
  const handleViewStudent = (student) => {
    const progress = calculateStudentProgress(student);
    alert(`Viewing details for ${student.name}\n\nEmail: ${student.email}\nSchool: ${student.school || 'N/A'}\nProgress: ${progress}%\nCompleted Modules: ${student.completedModules?.length || 0}\nAssigned Modules: ${student.assignedModules?.length || 0}`);
  };

  const handleEditStudent = (student) => {
    setEditingStudent({
      id: student._id,
      name: student.name,
      email: student.email,
      school: student.school || '',
      region: student.region || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateStudent = async () => {
    try {
      if (!editingStudent.name || !editingStudent.email) {
        alert('Please fill in all required fields (Name and Email)');
        return;
      }

      await userAPI.updateUser(editingStudent.id, {
        name: editingStudent.name,
        email: editingStudent.email,
        school: editingStudent.school,
        region: editingStudent.region,
      }, token);

      setShowEditModal(false);
      setEditingStudent(null);
      alert('✓ Student updated successfully!');
      await fetchData();
    } catch (error) {
      console.error('Error updating student:', error);
      if (error.response?.data?.message) {
        alert('Failed to update student: ' + error.response.data.message);
      } else {
        alert('Failed to update student');
      }
    }
  };

  const handleDeleteStudent = async (student) => {
    if (confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
      try {
        await userAPI.deleteUser(student._id, token);
        alert('✓ Student deleted successfully!');
        await fetchData();
      } catch (error) {
        console.error('Error deleting student:', error);
        if (error.response?.data?.message) {
          alert('Failed to delete student: ' + error.response.data.message);
        } else {
          alert('Failed to delete student');
        }
      }
    }
  };

  // Module assignment handlers
  const handleAssignModule = (module) => {
    setSelectedModule(module);
    setSelectedStudents([]);
    setShowAssignModuleModal(true);
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

  const handleToggleStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleConfirmAssignment = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    try {
      // Call the new API endpoint to assign module
      const response = await userAPI.assignModule(
        selectedModule._id,
        selectedStudents,
        null, // dueDate - can be added to the modal later
        token
      );

      console.log('Assignment response:', response.data);
      
      setShowAssignModuleModal(false);
      setSelectedModule(null);
      setSelectedStudents([]);
      
      // Show success message with details
      if (response.data.failed && response.data.failed.length > 0) {
        const failedNames = response.data.failed.map(f => f.name).join(', ');
        alert(`✓ Module "${selectedModule.title}" assigned to ${response.data.totalAssigned} student(s)!\n\nNote: ${response.data.failed.length} assignment(s) failed: ${failedNames}`);
      } else {
        alert(`✓ Module "${selectedModule.title}" successfully assigned to ${response.data.totalAssigned} student(s)!`);
      }
      
      // Optionally send an alert notification to students (non-blocking)
      try {
        const studentNames = students
          .filter(s => selectedStudents.includes(s._id))
          .map(s => s.name)
          .join(', ');

        const alertData = {
          title: `New Module Assigned: ${selectedModule.title}`,
          description: `${selectedModule.title} has been assigned to: ${studentNames}. Please complete it to improve your preparedness score.`,
          disasterType: selectedModule.disasterType || 'general',
          severity: 'low',
          region: user?.region || 'All',
        };

        await alertAPI.create(alertData, token);
        console.log('Alert notification sent successfully');
      } catch (alertError) {
        console.error('Failed to send alert notification (non-critical):', alertError);
        // Don't show error to user since assignment was successful
      }
      
    } catch (error) {
      console.error('Error assigning module:', error);
      const errorMsg = error.response?.data?.message || 'Failed to assign module';
      alert(`❌ ${errorMsg}`);
    }
  };

  const handleAddDisaster = () => {
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
    setShowDisasterModal(true);
  };

  const handleEditDisaster = (disaster) => {
    setEditingDisaster(disaster);
    setDisasterFormData({
      name: disaster.name,
      displayName: disaster.displayName,
      icon: disaster.icon || '🌍',
      description: disaster.description,
      safetyTips: disaster.safetyTips || [],
      emergencySupplies: disaster.emergencySupplies || [],
      warningSignals: disaster.warningSignals || [],
      evacuationGuidelines: disaster.evacuationGuidelines || '',
      commonInRegions: disaster.commonInRegions || [],
      severity: disaster.severity || 'medium',
      isActive: disaster.isActive !== undefined ? disaster.isActive : true,
    });
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
      await fetchData();
    } catch (error) {
      console.error('Error saving disaster type:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save disaster type';
      alert(`❌ ${errorMessage}`);
    }
  };

  // Export report handler
  const handleExportReport = () => {
    try {
      // Prepare report data
      const reportDate = new Date().toLocaleDateString();
      const reportTime = new Date().toLocaleTimeString();
      
      // Calculate statistics
      const totalStudents = students.length;
      const avgProgress = students.length > 0 
        ? Math.round(students.reduce((sum, s) => sum + calculateStudentProgress(s), 0) / students.length)
        : 0;
      const activeStudents = students.filter(s => calculateStudentProgress(s) > 0).length;
      const totalModules = modules.length;
      const totalQuizzes = quizzes.length;
      const totalDrills = drills.length;
      
      // Create CSV content
      let csvContent = "Teacher Report\n";
      csvContent += `Generated: ${reportDate} ${reportTime}\n\n`;
      
      csvContent += "=== OVERVIEW ===\n";
      csvContent += `Total Students,${totalStudents}\n`;
      csvContent += `Active Students,${activeStudents}\n`;
      csvContent += `Average Progress,${avgProgress}%\n`;
      csvContent += `Total Modules,${totalModules}\n`;
      csvContent += `Total Quizzes,${totalQuizzes}\n`;
      csvContent += `Total Drills,${totalDrills}\n\n`;
      
      csvContent += "=== STUDENT DETAILS ===\n";
      csvContent += "Name,Email,School,Progress,Completed Modules,Assigned Modules\n";
      
      students.forEach(student => {
        const progress = calculateStudentProgress(student);
        const completed = student.completedModules?.length || 0;
        const assigned = student.assignedModules?.length || 0;
        csvContent += `"${student.name}","${student.email}","${student.school || 'N/A'}",${progress}%,${completed},${assigned}\n`;
      });
      
      csvContent += "\n=== MODULE DETAILS ===\n";
      csvContent += "Title,Type,Difficulty,Description\n";
      modules.forEach(module => {
        csvContent += `"${module.title}","${module.type || 'N/A'}","${module.difficulty || 'N/A'}","${module.description?.substring(0, 50) || 'N/A'}..."\n`;
      });
      
      csvContent += "\n=== QUIZ DETAILS ===\n";
      csvContent += "Title,Disaster Type,Questions,Created\n";
      quizzes.forEach(quiz => {
        csvContent += `"${quiz.title}","${quiz.disasterType || 'N/A'}",${quiz.questions?.length || 0},"${new Date(quiz.createdAt).toLocaleDateString()}"\n`;
      });
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Teacher_Report_${reportDate.replace(/\//g, '-')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('✓ Report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('❌ Failed to export report. Please try again.');
    }
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', color: 'blue' },
    { id: 'students', icon: '👨‍🎓', label: 'Students', color: 'green' },
    { id: 'modules', icon: '📚', label: 'Learning Modules', color: 'purple' },
    { id: 'safety', icon: '🌍', label: 'Safety Guide', color: 'emerald' },
    { id: 'drills', icon: '🧪', label: 'Drills', color: 'cyan' },
    { id: 'assessments', icon: '📝', label: 'Assessments', color: 'orange' },
    { id: 'alerts', icon: '🚨', label: 'Alerts', color: 'red' },
    { id: 'reports', icon: '📈', label: 'Reports', color: 'indigo' },
    { id: 'profile', icon: '👤', label: 'Profile', color: 'gray' },
  ];

  // Stats Cards Data
  const statsCards = [
    { 
      title: 'Total Students', 
      value: students.length, 
      icon: '👨‍🎓', 
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    { 
      title: 'Assigned Modules', 
      value: modules.length, 
      icon: '📚', 
      gradient: 'from-purple-500 to-pink-500',
      change: '+5%'
    },
    { 
      title: 'Upcoming Drills', 
      value: scheduledDrills.filter(d => new Date(d.scheduledDate) > new Date()).length, 
      icon: '🧪', 
      gradient: 'from-cyan-500 to-blue-500',
      change: '+8%'
    },
    { 
      title: 'Avg Preparedness', 
      value: '85%', 
      icon: '📊', 
      gradient: 'from-green-500 to-teal-500',
      change: '+3%'
    },
  ];

  // Recent Activity Data
  // Performance Data
  const performanceData = [
    { subject: 'Fire Safety', score: 85 },
    { subject: 'Earthquake', score: 78 },
    { subject: 'Flood Safety', score: 92 },
    { subject: 'Cyclone', score: 88 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

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
                    👩‍🏫
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white">PrepSafe</h1>
                    <p className="text-xs text-gray-400">Teacher Panel</p>
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
                  <p className="text-sm text-gray-400">Welcome back, {user?.name}!</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAlertModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-red-500/50 transition-all"
                >
                  🚨 Send Alert
                </motion.button>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl">
                    👩‍🏫
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-gray-400">Teacher</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && <DashboardHome statsCards={statsCards} performanceData={performanceData} COLORS={COLORS} students={students} drills={drills} scheduledDrills={scheduledDrills} quizzes={quizzes} modules={modules} />}
              {activeTab === 'students' && (
                <StudentsPage 
                  students={students} 
                  onAddStudent={() => setShowStudentModal(true)}
                  onViewStudent={handleViewStudent}
                  onEditStudent={handleEditStudent}
                  onDeleteStudent={handleDeleteStudent}
                  calculateProgress={calculateStudentProgress}
                />
              )}
              {activeTab === 'modules' && <ModulesPage modules={modules} onAssignModule={handleAssignModule} onCreateModule={() => setShowCreateModuleModal(true)} />}
              {activeTab === 'safety' && <SafetyGuidePage disasterTypes={disasterTypes} selectedDisaster={selectedDisaster} setSelectedDisaster={setSelectedDisaster} onAddDisaster={handleAddDisaster} onEditDisaster={handleEditDisaster} />}
              {activeTab === 'drills' && (
                <DrillsPage
                  scheduledDrills={scheduledDrills}
                  virtualDrills={virtualDrills}
                  onScheduleDrill={() => setShowDrillModal(true)}
                  onEditScheduledDrill={handleEditScheduledDrill}
                  onDeleteScheduledDrill={handleDeleteScheduledDrill}
                  onCreateVirtualDrill={handleCreateVirtualDrill}
                  onEditVirtualDrill={handleEditVirtualDrill}
                  onDeleteVirtualDrill={handleDeleteVirtualDrill}
                />
              )}
              {activeTab === 'assessments' && <AssessmentsPage quizzes={quizzes} onCreateQuiz={handleCreateQuiz} onViewResults={handleViewResults} onDeleteQuiz={handleDeleteQuiz} />}
              {activeTab === 'alerts' && <AlertsPage alerts={alerts} />}
              {activeTab === 'reports' && <ReportsPage students={students} performanceData={performanceData} onExport={handleExportReport} />}
              {activeTab === 'profile' && <ProfilePage user={user} />}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Alert Modal */}
      <AnimatePresence>
        {showAlertModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAlertModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                🚨 Send Alert to Students
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Alert Title</label>
                  <input
                    type="text"
                    value={alertData.title}
                    onChange={(e) => setAlertData({ ...alertData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Fire Drill Tomorrow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                  <textarea
                    value={alertData.description}
                    onChange={(e) => setAlertData({ ...alertData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Enter alert description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Disaster Type</label>
                  <select
                    value={alertData.disasterType}
                    onChange={(e) => setAlertData({ ...alertData, disasterType: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="earthquake" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🌍 Earthquake</option>
                    <option value="fire" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🔥 Fire</option>
                    <option value="flood" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🌊 Flood</option>
                    <option value="cyclone" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🌪️ Cyclone</option>
                    <option value="other" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>📋 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Severity Level</label>
                  <select
                    value={alertData.severity}
                    onChange={(e) => setAlertData({ ...alertData, severity: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🟢 Low</option>
                    <option value="medium" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🟡 Medium</option>
                    <option value="high" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🟠 High</option>
                    <option value="critical" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🔴 Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendAlert}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-blue-500/50 transition-all"
                >
                  Send Alert
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAlertModal(false)}
                  className="px-4 py-3 bg-white/5 text-gray-300 rounded-lg font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Modal */}
      <AnimatePresence>
        {showStudentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowStudentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                👨‍🎓 Add Student
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Student Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="student@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    School/College <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newStudent.school}
                    onChange={(e) => setNewStudent({ ...newStudent, school: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ABC College"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Class <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10A"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs">
                    ℹ️ Default password will be set to: <span className="font-bold">student123</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddStudent}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-green-500/50 transition-all"
                >
                  Add Student
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-3 bg-white/5 text-gray-300 rounded-lg font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {showEditModal && editingStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                ✏️ Edit Student
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Student Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="student@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    School/College
                  </label>
                  <input
                    type="text"
                    value={editingStudent.school}
                    onChange={(e) => setEditingStudent({ ...editingStudent, school: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ABC College"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={editingStudent.region}
                    onChange={(e) => setEditingStudent({ ...editingStudent, region: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., North, South, East, West"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateStudent}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-yellow-500/50 transition-all"
                >
                  Update Student
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-3 bg-white/5 text-gray-300 rounded-lg font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Module Modal */}
      <AnimatePresence>
        {showCreateModuleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModuleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span>📚</span> Create New Learning Module
              </h2>
              <ModuleForm 
                onSubmit={handleCreateModule}
                onCancel={() => setShowCreateModuleModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Module Modal */}
      <AnimatePresence>
        {showAssignModuleModal && selectedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAssignModuleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                📚 Assign: {selectedModule.title}
              </h3>
              <p className="text-gray-400 text-sm mb-6">{selectedModule.description}</p>
              
              <h4 className="text-lg font-semibold text-white mb-4">Select Students:</h4>
              
              <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                {students.length > 0 ? students.map((student) => (
                  <motion.div
                    key={student._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleToggleStudent(student._id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedStudents.includes(student._id)
                        ? 'bg-purple-500/20 border-purple-400/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedStudents.includes(student._id)
                          ? 'bg-purple-500 border-purple-400'
                          : 'border-white/30'
                      }`}>
                        {selectedStudents.includes(student._id) && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{student.name}</p>
                        <p className="text-gray-400 text-sm">{student.email}</p>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <p className="text-gray-400 text-center py-4">No students available</p>
                )}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmAssignment}
                  disabled={selectedStudents.length === 0}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold shadow-lg transition-all ${
                    selectedStudents.length === 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/50'
                  }`}
                >
                  Assign to {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAssignModuleModal(false);
                    setSelectedModule(null);
                    setSelectedStudents([]);
                  }}
                  className="px-4 py-3 bg-white/5 text-gray-300 rounded-lg font-semibold hover:bg-white/10 transition-all"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowVirtualDrillModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-lg w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                🎮 {editingVirtualDrill ? 'Edit Virtual Drill' : 'Create Virtual Drill'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={virtualDrillForm.title}
                    onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Earthquake Drill"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                  <textarea
                    value={virtualDrillForm.description}
                    onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
                    placeholder="Virtual simulation description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Disaster Type</label>
                    <select
                      value={virtualDrillForm.disasterType}
                      onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, disasterType: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="earthquake" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Earthquake</option>
                      <option value="fire" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Fire</option>
                      <option value="flood" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Flood</option>
                      <option value="cyclone" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>Cyclone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Icon</label>
                    <input
                      type="text"
                      value={virtualDrillForm.icon}
                      onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, icon: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-2xl text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={virtualDrillForm.date}
                      onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, date: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Time</label>
                    <input
                      type="time"
                      value={virtualDrillForm.time}
                      onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, time: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={virtualDrillForm.isActive}
                    onChange={(e) => setVirtualDrillForm({ ...virtualDrillForm, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Active for students
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveVirtualDrill}
                  disabled={savingVirtualDrill}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50"
                >
                  {savingVirtualDrill ? 'Saving...' : (editingVirtualDrill ? 'Update Virtual Drill' : 'Create Virtual Drill')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowVirtualDrillModal(false)}
                  className="px-4 py-3 bg-white/5 text-gray-300 rounded-lg font-semibold hover:bg-white/10 transition-all"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDrillModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                🧪 Schedule Drill
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Drill Title</label>
                  <input
                    type="text"
                    value={newDrill.title}
                    onChange={(e) => setNewDrill({ ...newDrill, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Fire Drill"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Disaster Type</label>
                  <select
                    value={newDrill.disasterType}
                    onChange={(e) => setNewDrill({ ...newDrill, disasterType: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fire" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🔥 Fire</option>
                    <option value="earthquake" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🌍 Earthquake</option>
                    <option value="flood" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🌊 Flood</option>
                    <option value="cyclone" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🌪️ Cyclone</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={newDrill.date}
                      onChange={(e) => setNewDrill({ ...newDrill, date: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Time</label>
                    <input
                      type="time"
                      value={newDrill.time}
                      onChange={(e) => setNewDrill({ ...newDrill, time: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Class</label>
                  <input
                    type="text"
                    value={newDrill.class}
                    onChange={(e) => setNewDrill({ ...newDrill, class: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10A, 9B"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScheduleDrill}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  Schedule Drill
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDrillModal(false)}
                  className="px-4 py-3 bg-white/5 text-gray-300 rounded-lg font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showQuizModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowQuizModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">📝 Create Quiz</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Quiz Title</label><input type="text" value={newQuiz.title} onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Fire Safety Quiz" /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Disaster Type</label><select value={newQuiz.disasterType} onChange={(e) => setNewQuiz({ ...newQuiz, disasterType: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"><option value="general" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>📝 General</option><option value="fire" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🔥 Fire</option><option value="earthquake" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🌍 Earthquake</option><option value="flood" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🌊 Flood</option><option value="cyclone" style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>🌪️ Cyclone</option></select></div>
                </div>
                <div><label className="block text-sm font-semibold text-gray-300 mb-2">Description</label><textarea value={newQuiz.description} onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" rows="2" placeholder="Brief description" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Time Limit (min)</label><input type="number" value={newQuiz.timeLimit} onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: parseInt(e.target.value) })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Passing Score (%)</label><input type="number" value={newQuiz.passingScore} onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: parseInt(e.target.value) })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-4"><h4 className="text-lg font-bold text-white">Questions</h4><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAddQuestion} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-semibold hover:bg-green-500/30">+ Add Question</motion.button></div>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {newQuiz.questions.map((q, qIndex) => (
                      <div key={qIndex} className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-3"><span className="text-sm font-semibold text-gray-300">Question {qIndex + 1}</span>{newQuiz.questions.length > 1 && (<button onClick={() => handleRemoveQuestion(qIndex)} className="text-red-400 hover:text-red-300 text-sm">🗑️</button>)}</div>
                        <input type="text" value={q.question} onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3" placeholder="Enter question" />
                        <div className="space-y-2 mb-3">{q.options.map((option, oIndex) => (<div key={oIndex} className="flex items-center gap-2"><input type="radio" name={`correct-${qIndex}`} checked={q.correctAnswer === oIndex} onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)} /><input type="text" value={option} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder={`Option ${oIndex + 1}`} /></div>))}</div>
                        <input type="text" value={q.explanation} onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Explanation (optional)" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSaveQuiz} className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-lg">Create Quiz</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowQuizModal(false)} className="px-4 py-3 bg-white/5 text-gray-300 rounded-lg font-semibold hover:bg-white/10">Cancel</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showQuizResultsModal && selectedQuizForResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowQuizResultsModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedQuizForResults.title}</h3>
              <p className="text-gray-400 mb-6">Quiz Results & Statistics</p>
              {quizResults.stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10"><p className="text-gray-400 text-xs mb-1">Total</p><p className="text-2xl font-bold text-white">{quizResults.stats.totalAttempts}</p></div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10"><p className="text-gray-400 text-xs mb-1">Avg Score</p><p className="text-2xl font-bold text-green-400">{quizResults.stats.averageScore.toFixed(1)}%</p></div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10"><p className="text-gray-400 text-xs mb-1">Pass Rate</p><p className="text-2xl font-bold text-blue-400">{quizResults.stats.passRate.toFixed(1)}%</p></div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10"><p className="text-gray-400 text-xs mb-1">Highest</p><p className="text-2xl font-bold text-purple-400">{quizResults.stats.highestScore.toFixed(1)}%</p></div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10"><p className="text-gray-400 text-xs mb-1">Lowest</p><p className="text-2xl font-bold text-orange-400">{quizResults.stats.lowestScore.toFixed(1)}%</p></div>
                </div>
              )}
              <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full"><thead className="bg-white/5"><tr><th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Student</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Score</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Status</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Date</th></tr></thead>
                  <tbody className="divide-y divide-white/5">{quizResults.results && quizResults.results.length > 0 ? quizResults.results.map((result, idx) => (<tr key={idx} className="hover:bg-white/5"><td className="px-4 py-3 text-gray-300">{result.userId?.name || 'Unknown'}</td><td className="px-4 py-3 text-gray-300">{result.score}/{result.totalPoints} ({result.percentage.toFixed(1)}%)</td><td className="px-4 py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${result.passed ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{result.passed ? 'Passed' : 'Failed'}</span></td><td className="px-4 py-3 text-gray-400 text-sm">{new Date(result.completedAt).toLocaleDateString()}</td></tr>)) : (<tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400">No attempts yet</td></tr>)}</tbody>
                </table>
              </div>
              <div className="flex justify-end mt-6"><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowQuizResultsModal(false)} className="px-6 py-3 bg-white/5 text-gray-300 rounded-lg font-semibold hover:bg-white/10">Close</motion.button></div>
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
              onClick={(e) => e.stopPropagation()}
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
const DashboardHome = ({ statsCards, performanceData, COLORS, students, drills, scheduledDrills, quizzes, modules }) => {
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

  // Generate real activity data
  const generateRecentActivity = () => {
    const activities = [];
    
    // Add recent students
    if (students && students.length > 0) {
      students.slice(0, 2).forEach(student => {
        activities.push({
          action: 'Student Added',
          detail: `${student.name} added to class`,
          time: getRelativeTime(student.createdAt || new Date()),
          icon: '👨‍🎓',
          timestamp: new Date(student.createdAt || new Date())
        });
      });
    }
    
    // Add scheduled drills
    if (scheduledDrills && scheduledDrills.length > 0) {
      scheduledDrills.slice(0, 2).forEach(drill => {
        activities.push({
          action: 'Drill Scheduled',
          detail: `${drill.disasterType} drill on ${new Date(drill.scheduledDate).toLocaleDateString()}`,
          time: getRelativeTime(drill.createdAt || new Date()),
          icon: '🧪',
          timestamp: new Date(drill.createdAt || new Date())
        });
      });
    }
    
    // Add recent drills
    if (drills && drills.length > 0) {
      drills.slice(0, 1).forEach(drill => {
        activities.push({
          action: 'Drill Available',
          detail: `${drill.title} created`,
          time: getRelativeTime(drill.createdAt || new Date()),
          icon: '✅',
          timestamp: new Date(drill.createdAt || new Date())
        });
      });
    }
    
    // Add recent quizzes
    if (quizzes && quizzes.length > 0) {
      quizzes.slice(0, 1).forEach(quiz => {
        activities.push({
          action: 'Quiz Created',
          detail: `${quiz.title} - ${quiz.questions?.length || 0} questions`,
          time: getRelativeTime(quiz.createdAt || new Date()),
          icon: '📝',
          timestamp: new Date(quiz.createdAt || new Date())
        });
      });
    }
    
    // Add recent modules
    if (modules && modules.length > 0) {
      modules.slice(0, 1).forEach(module => {
        activities.push({
          action: 'Module Available',
          detail: `${module.title}`,
          time: getRelativeTime(module.createdAt || new Date()),
          icon: '📚',
          timestamp: new Date(module.createdAt || new Date())
        });
      });
    }
    
    // Sort by timestamp (most recent first) and limit to 4
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4);
  };

  const recentActivity = generateRecentActivity();

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 text-7xl opacity-10">{stat.icon}</div>
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-semibold mb-2">{stat.title}</p>
              <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
              <p className="text-white/60 text-xs">{stat.change} from last month</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            📊 Student Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            ⚡ Recent Activity
          </h3>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.detail}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Students Page
const StudentsPage = ({ students, onAddStudent, onViewStudent, onEditStudent, onDeleteStudent, calculateProgress }) => {
  return (
    <motion.div
      key="students"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Students Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddStudent}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold shadow-lg"
        >
          + Add Student
        </motion.button>
      </div>

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Progress</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.length > 0 ? students.map((student, idx) => (
                <motion.tr
                  key={student._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/5 transition-all"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{student.name}</p>
                        <p className="text-gray-400 text-sm">{student.school || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{student.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-teal-500" style={{ width: `${calculateProgress(student)}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-300">{calculateProgress(student)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onViewStudent(student)}
                        className="text-blue-400 hover:text-blue-300"
                        title="View student details"
                      >
                        👁️
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEditStudent(student)}
                        className="text-yellow-400 hover:text-yellow-300"
                        title="Edit student"
                      >
                        ✏️
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDeleteStudent(student)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete student"
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No students found. Add your first student!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

// Modules Page
const ModulesPage = ({ modules, onAssignModule, onCreateModule }) => {
  return (
    <motion.div
      key="modules"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Learning Modules</h2>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateModule}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg"
          >
            + Create Module
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Bulk assign feature: Select a module below and click "Assign" to assign it to students')}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg"
          >
            Assign Module
          </motion.button>
        </div>
      </div>

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
            <div className="text-4xl mb-4">{module.icon || '📚'}</div>
            <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{module.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{module.duration || '30 min'}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAssignModule(module)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold"
              >
                Assign →
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Drills Page
const DrillsPage = ({
  scheduledDrills,
  virtualDrills,
  onScheduleDrill,
  onEditScheduledDrill,
  onDeleteScheduledDrill,
  onCreateVirtualDrill,
  onEditVirtualDrill,
  onDeleteVirtualDrill,
}) => {
  return (
    <motion.div
      key="drills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Drill Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onScheduleDrill}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg"
        >
          + Schedule Drill
        </motion.button>
      </div>

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Scheduled Drills</h3>
          <div className="text-sm text-gray-400">{scheduledDrills.length} scheduled</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Drill</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Class</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scheduledDrills.length > 0 ? scheduledDrills.map((drill, idx) => (
                <motion.tr
                  key={drill._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/5 transition-all"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{drill.disasterType === 'fire' ? '🔥' : drill.disasterType === 'earthquake' ? '🌍' : '🌊'}</div>
                      <div>
                        <p className="text-white font-semibold">{drill.title}</p>
                        <p className="text-gray-400 text-sm">{drill.disasterType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(drill.scheduledDate).toLocaleDateString()}<br/>
                    <span className="text-sm text-gray-500">
                      {new Date(drill.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{drill.class || 'All Classes'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      new Date(drill.scheduledDate) > new Date()
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {new Date(drill.scheduledDate) > new Date() ? 'Upcoming' : 'Completed'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditScheduledDrill(drill)}
                        className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteScheduledDrill(drill._id)}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No drills scheduled. Schedule your first drill!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Virtual Drills</h3>
            <p className="text-sm text-gray-400">Create and manage the drill cards shown to students</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateVirtualDrill}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-lg"
          >
            + Create Virtual Drill
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {virtualDrills && virtualDrills.length > 0 ? virtualDrills.map((drill, idx) => {
            const scheduledDate = new Date(drill.scheduledDate);
            const isUpcoming = scheduledDate > new Date();

            return (
              <motion.div
                key={drill._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{drill.icon || '🧪'}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${drill.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                    {drill.isActive ? (isUpcoming ? 'Upcoming' : 'Available') : 'Inactive'}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-white mb-2">{drill.title}</h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{drill.description || 'Virtual simulation'}</p>

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
};

// Assessments Page
const AssessmentsPage = ({ quizzes, onCreateQuiz, onViewResults, onDeleteQuiz }) => {
  return (
    <motion.div
      key="assessments"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Assessments & Quizzes</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateQuiz}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-lg"
        >
          + Create Quiz
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes && quizzes.length > 0 ? quizzes.map((quiz, idx) => {
          const icon = quiz.disasterType === 'fire' ? '🔥' : 
                      quiz.disasterType === 'earthquake' ? '🌍' : 
                      quiz.disasterType === 'flood' ? '🌊' : 
                      quiz.disasterType === 'cyclone' ? '🌪️' : '📝';
          
          return (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{quiz.questions?.length || 0} Questions • {quiz.timeLimit} min</p>
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Passing Score</span>
                  <span>{quiz.passingScore}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Type</span>
                  <span className="capitalize">{quiz.disasterType}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewResults(quiz)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold"
                >
                  View Results →
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDeleteQuiz(quiz._id)}
                  className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg text-sm font-semibold hover:bg-red-500/30"
                >
                  🗑️
                </motion.button>
              </div>
            </motion.div>
          );
        }) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No quizzes created yet. Create your first quiz!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Alerts Page
const AlertsPage = ({ alerts }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-500/20 text-green-300',
      medium: 'bg-yellow-500/20 text-yellow-300',
      high: 'bg-orange-500/20 text-orange-300',
      critical: 'bg-red-500/20 text-red-300'
    };
    return colors[severity] || 'bg-blue-500/20 text-blue-300';
  };

  const getDisasterIcon = (type) => {
    const icons = {
      earthquake: '🌍',
      fire: '🔥',
      flood: '🌊',
      cyclone: '🌪️',
      other: '📋'
    };
    return icons[type] || '📢';
  };

  return (
    <motion.div
      key="alerts"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">All Alerts</h2>

      {alerts.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 text-center">
          <p className="text-gray-400">No alerts available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <motion.div
              key={alert._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`text-3xl ${alert.severity === 'critical' ? 'animate-bounce' : ''}`}>
                    {getDisasterIcon(alert.disasterType)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{alert.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>📅 {new Date(alert.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{alert.disasterType}</span>
                      {alert.regions && alert.regions.length > 0 && (
                        <>
                          <span>•</span>
                          <span>📍 {alert.regions.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Reports Page
const ReportsPage = ({ students, performanceData, onExport }) => {
  return (
    <motion.div
      key="reports"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExport}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-shadow"
        >
          📥 Export Report
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Performance */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Overall Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="subject" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="score" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Top Performers</h3>
          <div className="space-y-3">
            {students.slice(0, 5).map((student, idx) => (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{student.name}</p>
                    <p className="text-gray-400 text-xs">{student.school || 'N/A'}</p>
                  </div>
                </div>
                <span className="text-green-400 font-bold">{90 - idx * 2}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
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
      <h2 className="text-2xl font-bold text-white">Profile Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              👩‍🏫
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{user?.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{user?.email}</p>
            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
              Teacher
            </span>
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

// Safety Guide Page - same as Student Dashboard
const SafetyGuidePage = ({ disasterTypes, selectedDisaster, setSelectedDisaster, onAddDisaster, onEditDisaster }) => {
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">🌍 Disaster Safety Guide</h2>
              <p className="text-gray-400">Access comprehensive safety information for different types of disasters</p>
            </div>
            <button
              onClick={onAddDisaster}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span>+</span> Add Disaster Type
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disasterTypes.map((disaster, idx) => (
              <motion.div
                key={disaster._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all"
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

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDisaster(disaster)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold"
                  >
                    View Guide →
                  </button>
                  <button
                    onClick={() => onEditDisaster(disaster)}
                    className="px-4 py-2 bg-green-500/20 text-green-300 hover:bg-green-500/30 rounded-lg text-sm font-semibold"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {disasterTypes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-gray-400 mb-4">No disaster information available yet.</p>
              <button
                onClick={onAddDisaster}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:shadow-xl transition-all"
              >
                Add Your First Disaster Type
              </button>
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
