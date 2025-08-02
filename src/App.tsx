import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import ProgramGrid from './components/ProgramGrid'
import FeaturedBands from './components/FeaturedBands'
import Footer from './components/Footer'
import AudioPlayer from './components/AudioPlayer'
import TopMonthPopup from './components/TopMonthPopup'
import Login from './components/Admin/Login'
import Dashboard from './components/Admin/Dashboard'
import BandsManagement from './components/Admin/BandsManagement'
import ScheduleManagement from './components/Admin/ScheduleManagement'
import AdminLayout from './components/Admin/AdminLayout'

// Componente para o site principal
const MainSite = () => {
  return (
    <div className="min-h-screen bg-metal-dark">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        <main>
          <Hero />
          <ProgramGrid />
          <FeaturedBands />
        </main>
        <Footer />
        <div className="h-20"></div>
        <AudioPlayer />
        <TopMonthPopup />
      </motion.div>
    </div>
  )
}

// Componente para rotas protegidas do admin
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken')
  
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  
  return <AdminLayout>{children}</AdminLayout>
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal do site */}
        <Route path="/" element={<MainSite />} />
        
        {/* Rotas do painel administrativo */}
        <Route path="/admin/login" element={<Login />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/bands" 
          element={
            <ProtectedRoute>
              <BandsManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/schedule" 
          element={
            <ProtectedRoute>
              <ScheduleManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirecionamento padrão para admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App 