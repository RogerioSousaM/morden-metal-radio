import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Home, 
  Clock, 
  Film, 
  Music, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/login')
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navItems = [
    {
      path: '/admin',
      icon: Home,
      label: 'Dashboard',
      description: 'Visão geral do sistema'
    },
    {
      path: '/admin/programs',
      icon: Clock,
      label: 'Programação',
      description: 'Gerenciar horários e programas'
    },
    {
      path: '/admin/movies',
      icon: Film,
      label: 'Filmaço',
      description: 'Gerenciar filmes e eventos'
    },
    {
      path: '/admin/bands',
      icon: Music,
      label: 'Bandas da Cena',
      description: 'Gerenciar bandas e descrições'
    }
  ]

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {!isSidebarCollapsed && 'Modern Metal Admin'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Administração</div>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActiveRoute(item.path) ? 'active' : ''}`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="nav-item-icon" />
                  {!isSidebarCollapsed && (
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted">{item.description}</div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Settings Section */}
          <div className="nav-section">
            <div className="nav-section-title">Sistema</div>
            <Link
              to="/admin/settings"
              className={`nav-item ${isActiveRoute('/admin/settings') ? 'active' : ''}`}
              title={isSidebarCollapsed ? 'Configurações' : undefined}
            >
              <Settings className="nav-item-icon" />
              {!isSidebarCollapsed && 'Configurações'}
            </Link>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-6 mt-auto">
          <button
            onClick={handleLogout}
            className="nav-item w-full text-left"
            title={isSidebarCollapsed ? 'Sair' : undefined}
          >
            <LogOut className="nav-item-icon" />
            {!isSidebarCollapsed && 'Sair'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <header className="admin-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="mobile-menu-toggle lg:hidden"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Desktop Sidebar Toggle */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg bg-surface-light hover:bg-surface-lighter transition-colors"
                aria-label="Toggle sidebar"
              >
                {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>

              {/* Page Title */}
              <h1 className="text-xl font-semibold text-primary">
                {navItems.find(item => isActiveRoute(item.path))?.label || 'Admin'}
              </h1>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">Administrador</div>
                <div className="text-xs text-muted">admin@modernmetal.com</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout 