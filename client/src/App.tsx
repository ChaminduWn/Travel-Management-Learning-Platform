import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './components/auth/Register'; // New import
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import LearningPlanPage from './pages/LearningPlanPage';
import LearningPlanListPage from './pages/LearningPlanListPage';
import TestLearningPlanPage from './pages/TestLearningPlanPage';
import CreateLearningPlanPage from './pages/CreateLearningPlanPage';
import EditLearningPlanPage from './pages/EditLearningPlanPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/oauth2/redirect" element={<OAuthCallbackPage />} />
              
              {/* Protected routes with layout */}
              <Route element={<Layout />}>
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profile/:username" element={<ProfilePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/learning-plan/:id" element={<LearningPlanPage />} />
                  <Route path="/my-plans" element={<LearningPlanListPage />} />
                  <Route path="/test-learning-plans" element={<TestLearningPlanPage />} />
                  <Route path="/create-learning-plan" element={<CreateLearningPlanPage />} />
                  <Route path="/edit-learning-plan/:id" element={<EditLearningPlanPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                </Route>
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;