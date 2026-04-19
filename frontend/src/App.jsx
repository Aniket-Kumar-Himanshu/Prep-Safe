import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { Header, Footer } from './components/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { ModuleDetailPage } from './pages/ModuleDetailPage';
import { EmergencyContactsPage } from './pages/EmergencyContactsPage';
import { VirtualDrillPage } from './pages/VirtualDrillPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { QuizTakingPage } from './pages/QuizTakingPage';
import QuizReview from './components/QuizReview';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Header user={user} onLogout={logout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/modules/:id"
              element={
                <ProtectedRoute>
                  <ModuleDetailPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <EmergencyContactsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/drills"
              element={
                <ProtectedRoute>
                  <VirtualDrillPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/quiz/:id"
              element={
                <ProtectedRoute>
                  <QuizTakingPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/quiz/review/:resultId"
              element={
                <ProtectedRoute>
                  <QuizReview />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
