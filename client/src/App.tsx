import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { DashboardPage } from './pages/DashboardPage';
import { LearningCoachPage } from './pages/LearningCoachPage';
import { TutorPage } from './pages/TutorPage';
import { PracticePage } from './pages/PracticePage';
import { LearningPathPage } from './pages/LearningPathPage';
import { ProgressPage } from './pages/ProgressPage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { SavedScholarshipsPage } from './pages/SavedScholarshipsPage';
import { MistakeReviewPage } from './pages/MistakeReviewPage';
import { PracticeHistoryPage } from './pages/PracticeHistoryPage';
import { StudentInterventionsPage } from './pages/StudentInterventionsPage';

import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { TeacherStudentsPage } from './pages/TeacherStudentsPage';
import { TeacherAnalyticsPage } from './pages/TeacherAnalyticsPage';
import { TeacherInterventionsPage } from './pages/TeacherInterventionsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Student Protected Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="learning-coach"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <LearningCoachPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="tutor"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <TutorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="practice"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <PracticePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="learning-path"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <LearningPathPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="progress"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="scholarships"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ScholarshipsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="scholarships/saved"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <SavedScholarshipsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="mistakes"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MistakeReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="practice-history"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <PracticeHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="interventions"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentInterventionsPage />
                </ProtectedRoute>
              }
            />

            {/* Teacher Protected Routes */}
            <Route
              path="teacher"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="teacher/interventions"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherInterventionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="teacher/students"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="teacher/analytics"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherAnalyticsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<LandingPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
