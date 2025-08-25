import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Dashboard'
import ScheduleManagement from './pages/ScheduleManagement'
import FilmesManagement from './pages/FilmesManagement'
import BandasManagement from './pages/BandasManagement'
import SettingsManagement from './pages/SettingsManagement'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes - Protected by AdminLayout */}
        <Route path="/admin" element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        } />
        
        <Route path="/admin/programs" element={
          <AdminLayout>
            <ScheduleManagement />
          </AdminLayout>
        } />
        
        <Route path="/admin/movies" element={
          <AdminLayout>
            <FilmesManagement />
          </AdminLayout>
        } />
        
        <Route path="/admin/bands" element={
          <AdminLayout>
            <BandasManagement />
          </AdminLayout>
        } />
        
        <Route path="/admin/settings" element={
          <AdminLayout>
            <SettingsManagement />
          </AdminLayout>
        } />
        
        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Catch all - redirect to admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  )
}

export default App 