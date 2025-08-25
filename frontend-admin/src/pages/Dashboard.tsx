import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  Film, 
  Music, 
  TrendingUp, 
  Users, 
  Calendar,
  Play,
  Eye
} from 'lucide-react'

interface DashboardStats {
  totalPrograms: number
  totalMovies: number
  totalBands: number
  activeUsers: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPrograms: 0,
    totalMovies: 0,
    totalBands: 0,
    activeUsers: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading stats
    const loadStats = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalPrograms: 24,
        totalMovies: 15,
        totalBands: 32,
        activeUsers: 128
      })
      setIsLoading(false)
    }

    loadStats()
  }, [])

  const quickActions = [
    {
      title: 'Adicionar Programa',
      description: 'Criar novo horário de programação',
      icon: Clock,
      path: '/admin/programs',
      color: 'bg-blue-500'
    },
    {
      title: 'Adicionar Filme',
      description: 'Cadastrar novo filme ou evento',
      icon: Film,
      path: '/admin/movies',
      color: 'bg-purple-500'
    },
    {
      title: 'Adicionar Banda',
      description: 'Cadastrar nova banda da cena',
      icon: Music,
      path: '/admin/bands',
      color: 'bg-green-500'
    }
  ]

  const recentActivity = [
    {
      type: 'program',
      title: 'Programa "Metal da Noite" atualizado',
      time: '2 horas atrás',
      icon: Clock
    },
    {
      type: 'movie',
      title: 'Filme "Terrifier 3" adicionado',
      time: '4 horas atrás',
      icon: Film
    },
    {
      type: 'band',
      title: 'Banda "Deathcore Brasil" cadastrada',
      time: '6 horas atrás',
      icon: Music
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Bem-vindo ao Painel Administrativo
        </h1>
        <p className="text-muted">
          Gerencie sua rádio Modern Metal com eficiência e controle total
        </p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-lg mb-4 mx-auto">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div className="stat-number">{stats.totalPrograms}</div>
          <div className="stat-label">Programas</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-lg mb-4 mx-auto">
            <Film className="w-6 h-6 text-purple-500" />
          </div>
          <div className="stat-number">{stats.totalMovies}</div>
          <div className="stat-label">Filmes</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-lg mb-4 mx-auto">
            <Music className="w-6 h-6 text-green-500" />
          </div>
          <div className="stat-number">{stats.totalBands}</div>
          <div className="stat-label">Bandas</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-500/10 rounded-lg mb-4 mx-auto">
            <Users className="w-6 h-6 text-orange-500" />
          </div>
          <div className="stat-number">{stats.activeUsers}</div>
          <div className="stat-label">Usuários Ativos</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Ações Rápidas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={index}
                to={action.path}
                className="group p-6 border border-surface-lighter rounded-xl hover:border-primary/30 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary group-hover:text-primary-light transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Atividade Recente</h2>
            <Link to="/admin/activity" className="text-sm text-primary hover:text-primary-light">
              Ver todas
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-light transition-colors">
                  <div className="w-8 h-8 bg-surface-light rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Resumo Rápido</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm">Programas ao vivo hoje</span>
              </div>
              <span className="text-lg font-semibold text-green-500">8</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Próximos eventos</span>
              </div>
              <span className="text-lg font-semibold text-blue-500">12</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5 text-purple-500" />
                <span className="text-sm">Filmes em destaque</span>
              </div>
              <span className="text-lg font-semibold text-purple-500">5</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Status do Sistema</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium">API Backend</p>
            <p className="text-xs text-muted">Online</p>
          </div>
          <div className="text-center p-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium">Banco de Dados</p>
            <p className="text-xs text-muted">Conectado</p>
          </div>
          <div className="text-center p-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium">Upload de Arquivos</p>
            <p className="text-xs text-muted">Funcionando</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 