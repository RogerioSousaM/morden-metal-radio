import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import BandsManagement from './pages/BandsManagement'
import ScheduleManagement from './pages/ScheduleManagement'
import FileManagement from './pages/FileManagement'
import NewsManagement from './pages/NewsManagement'
import UsersManagement from './pages/UsersManagement'
import CarouselManagement from './pages/CarouselManagement'
import TopMonthManagement from './pages/TopMonthManagement'
import SocialLinksManagement from './pages/SocialLinksManagement'
import SettingsManagement from './pages/SettingsManagement'
import AdminLayout from './components/AdminLayout'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token válido
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-metal-dark flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
          {/* Rota pública - Login */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login onLogin={() => setIsAuthenticated(true)} />
            } 
          />
          
          {/* Rota pública - Login Admin (alternativa) */}
          <Route 
            path="/admin/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/admin/dashboard" replace /> : 
                <Login onLogin={() => setIsAuthenticated(true)} />
            } 
          />
          
          {/* Rotas protegidas */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/admin/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              isAuthenticated ? 
                <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                  <Dashboard />
                </AdminLayout> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/bands" 
            element={
              isAuthenticated ? 
                <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                  <BandsManagement />
                </AdminLayout> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/schedule" 
            element={
              isAuthenticated ? 
                <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                  <ScheduleManagement />
                </AdminLayout> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/files" 
            element={
              isAuthenticated ? 
                <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                  <FileManagement />
                </AdminLayout> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/news" 
            element={
              isAuthenticated ? 
                <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                  <NewsManagement />
                </AdminLayout> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/users" 
            element={
              isAuthenticated ? 
                <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                  <UsersManagement />
                </AdminLayout> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/carousel" 
            element={
              isAuthenticated ? 
                <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                  <CarouselManagement />
                </AdminLayout> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/top-month" 
            element={
              isAuthenticated ? 
                <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                  <TopMonthManagement />
                </AdminLayout> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/social-links" 
            element={
              isAuthenticated ? 
                <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                  <SocialLinksManagement />
                </AdminLayout> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/admin/settings" 
            element={
              isAuthenticated ? 
                <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                  <SettingsManagement />
                </AdminLayout> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Rota 404 */}
          <Route 
            path="*" 
            element={
              isAuthenticated ? 
                <Navigate to="/admin/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
    </ErrorBoundary>
  )
}

export default App 