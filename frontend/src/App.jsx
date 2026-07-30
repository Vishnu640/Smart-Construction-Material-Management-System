import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import Usage from './pages/Usage';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Projects from './pages/Projects';
import SiteImages from './pages/SiteImages';
import AiPredict from './pages/AiPredict';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="materials" element={<Materials />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="usage" element={<Usage />} />
            <Route path="expenses" element={<ProtectedRoute roles={['ADMIN', 'STORE_MANAGER']}><Expenses /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute roles={['ADMIN', 'STORE_MANAGER']}><Reports /></ProtectedRoute>} />
            <Route path="projects" element={<Projects />} />
            <Route path="site-images" element={<SiteImages />} />
            <Route path="ai-predict" element={<ProtectedRoute roles={['ADMIN']}><AiPredict /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
