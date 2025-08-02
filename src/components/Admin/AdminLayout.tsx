import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Music, 
  Clock, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Music, label: 'Bandas', href: '/admin/bands' },
    { icon: Clock, label: 'Programação', href: '/admin/schedule' },
    { icon: Users, label: 'Usuários', href: '/admin/users' },
    { icon: Settings, label: 'Configurações', href: '/admin/settings' }
  ]

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (token && user) {
      setIsAuthenticated(true)
      setCurrentUser(JSON.parse(user))
    } else {
      // Redirecionar para login se não autenticado
      navigate('/admin/login')
    }
    
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-metal-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-metal-orange/30 border-t-metal-orange rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-metal-text-secondary">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-metal-dark text-metal-text">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-full w-64 bg-metal-card border-r border-metal-light-gray/20 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={{ x: -256 }}
        animate={{ x: isSidebarOpen ? 0 : -256 }}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-metal-orange to-metal-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MM</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-widest uppercase">Morden Metal</h1>
              <p className="text-xs text-metal-text-secondary">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <motion.button
                  key={item.label}
                  onClick={() => {
                    navigate(item.href)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-metal-orange/20 text-metal-orange border border-metal-orange/30' 
                      : 'text-metal-text-secondary hover:text-metal-orange hover:bg-metal-gray/50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-metal-gray/50 rounded-lg border border-metal-light-gray/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-metal-orange/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-metal-orange" />
                </div>
                <div>
                  <p className="text-sm font-medium">{currentUser?.username}</p>
                  <p className="text-xs text-metal-text-secondary capitalize">{currentUser?.role}</p>
                </div>
              </div>
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-metal-text-secondary hover:text-metal-red transition-colors rounded-lg hover:bg-metal-red/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" />
                Sair
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <motion.div
          className="bg-metal-card border-b border-metal-light-gray/20 px-4 py-4 lg:px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-metal-text-secondary hover:text-metal-orange transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="hidden lg:block">
                <h2 className="text-lg font-medium">Painel Administrativo</h2>
                <p className="text-sm text-metal-text-secondary">
                  Bem-vindo, {currentUser?.username}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-metal-text-secondary">
                <div className="w-2 h-2 bg-metal-orange rounded-full animate-pulse"></div>
                Sistema Online
              </div>
            </div>
          </div>
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminLayout 