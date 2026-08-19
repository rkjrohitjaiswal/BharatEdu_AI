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
import { StudentGoalsPage } from './pages/StudentGoalsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ExamPreparationPage } from './pages/ExamPreparationPage';
import { ExamReadinessPage } from './pages/ExamReadinessPage';
import { CareerRoadmapPage } from './pages/CareerRoadmapPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { TeacherStudentsPage } from './pages/TeacherStudentsPage';
import { TeacherAnalyticsPage } from './pages/TeacherAnalyticsPage';
import { TeacherInterventionsPage } from './pages/TeacherInterventionsPage';
import { ParentDashboardPage } from './pages/ParentDashboardPage';
import { ParentStudentOverviewPage } from './pages/ParentStudentOverviewPage';
import { ParentLinkPage } from './pages/ParentLinkPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
import { RiskPredictionDashboardPage } from './pages/RiskPredictionDashboardPage';

export const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="risk" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><RiskPredictionDashboardPage /></ProtectedRoute>} />
          <Route path="parent/risk/:studentId" element={<ProtectedRoute allowedRoles={['parent']}><RiskPredictionDashboardPage /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><AnalyticsDashboardPage /></ProtectedRoute>} />
          <Route path="parent/analytics/:studentId" element={<ProtectedRoute allowedRoles={['parent']}><AnalyticsDashboardPage /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute allowedRoles={['student', 'teacher', 'parent']}><NotificationsPage /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['student']}><DashboardPage /></ProtectedRoute>} />
          <Route path="learning-coach" element={<ProtectedRoute allowedRoles={['student']}><LearningCoachPage /></ProtectedRoute>} />
          <Route path="career" element={<ProtectedRoute allowedRoles={['student']}><CareerRoadmapPage /></ProtectedRoute>} />
          <Route path="tutor" element={<ProtectedRoute allowedRoles={['student']}><TutorPage /></ProtectedRoute>} />
          <Route path="practice" element={<ProtectedRoute allowedRoles={['student']}><PracticePage /></ProtectedRoute>} />
          <Route path="learning-path" element={<ProtectedRoute allowedRoles={['student']}><LearningPathPage /></ProtectedRoute>} />
          <Route path="progress" element={<ProtectedRoute allowedRoles={['student']}><ProgressPage /></ProtectedRoute>} />
          <Route path="scholarships" element={<ProtectedRoute allowedRoles={['student']}><ScholarshipsPage /></ProtectedRoute>} />
          <Route path="scholarships/saved" element={<ProtectedRoute allowedRoles={['student']}><SavedScholarshipsPage /></ProtectedRoute>} />
          <Route path="mistakes" element={<ProtectedRoute allowedRoles={['student']}><MistakeReviewPage /></ProtectedRoute>} />
          <Route path="practice-history" element={<ProtectedRoute allowedRoles={['student']}><PracticeHistoryPage /></ProtectedRoute>} />
          <Route path="interventions" element={<ProtectedRoute allowedRoles={['student']}><StudentInterventionsPage /></ProtectedRoute>} />
          <Route path="goals" element={<ProtectedRoute allowedRoles={['student']}><StudentGoalsPage /></ProtectedRoute>} />
          <Route path="achievements" element={<ProtectedRoute allowedRoles={['student']}><AchievementsPage /></ProtectedRoute>} />
          <Route path="exam-prep" element={<ProtectedRoute allowedRoles={['student']}><ExamPreparationPage /></ProtectedRoute>} />
          <Route path="exam-prep/:id/readiness" element={<ProtectedRoute allowedRoles={['student']}><ExamReadinessPage /></ProtectedRoute>} />
          <Route path="teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboardPage /></ProtectedRoute>} />
          <Route path="teacher/interventions" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherInterventionsPage /></ProtectedRoute>} />
          <Route path="teacher/students" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherStudentsPage /></ProtectedRoute>} />
          <Route path="teacher/analytics" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAnalyticsPage /></ProtectedRoute>} />
          <Route path="parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboardPage user={null} /></ProtectedRoute>} />
          <Route path="parent/overview/:studentId" element={<ProtectedRoute allowedRoles={['parent']}><ParentStudentOverviewPage /></ProtectedRoute>} />
          <Route path="parent-link" element={<ProtectedRoute allowedRoles={['student', 'parent']}><ParentLinkPage user={null} /></ProtectedRoute>} />
          <Route path="*" element={<LandingPage />} />
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
