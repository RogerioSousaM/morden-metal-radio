import { motion } from 'framer-motion'
import { Users, Music, Clock, TrendingUp, Plus, Edit, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService, type Stats } from '@/services/api'

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    listeners: 0,
    topBand: '',
    nextProgram: '',
    systemAlerts: 0,
    totalBands: 0,
    totalPrograms: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await apiService.getStats()
      setStats(data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
      // Definir valores padrão em caso de erro
      setStats({
        listeners: 0,
        topBand: 'N/A',
        nextProgram: 'N/A',
        systemAlerts: 0,
        totalBands: 0,
        totalPrograms: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { icon: Plus, label: 'Adicionar Banda', href: '/admin/bands' },
    { icon: Edit, label: 'Editar Programação', href: '/admin/schedule' },
    { icon: Music, label: 'Gerenciar Bandas', href: '/admin/bands' },
    { icon: Settings, label: 'Dashboard', href: '/admin/dashboard' }
  ]

  return (
    <div className="min-h-screen bg-metal-dark text-metal-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold tracking-widest uppercase mb-2">
            Painel Administrativo
          </h1>
          <p className="text-metal-text-secondary">
            Gerencie o conteúdo da Rádio Morden Metal
          </p>
        </motion.div>

                 {/* Loading State */}
         {loading && (
           <motion.div
             className="flex items-center justify-center py-12 mb-8"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
           >
             <div className="flex items-center gap-3">
               <div className="w-6 h-6 border-2 border-metal-orange border-t-transparent rounded-full animate-spin"></div>
               <span className="text-metal-text-secondary">Carregando estatísticas...</span>
             </div>
           </motion.div>
         )}

         {/* Stats Grid */}
         {!loading && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-metal-card rounded-lg p-6 border border-metal-light-gray/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-metal-text-secondary text-sm">Ouvintes Online</p>
                <p className="text-2xl font-bold text-metal-orange">{stats.listeners}</p>
              </div>
              <Users className="w-8 h-8 text-metal-orange" />
            </div>
          </motion.div>

          <motion.div
            className="bg-metal-card rounded-lg p-6 border border-metal-light-gray/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-metal-text-secondary text-sm">Top do Mês</p>
                <p className="text-lg font-bold">{stats.topBand}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-metal-orange" />
            </div>
          </motion.div>

          <motion.div
            className="bg-metal-card rounded-lg p-6 border border-metal-light-gray/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-metal-text-secondary text-sm">Próximo Programa</p>
                <p className="text-lg font-bold">{stats.nextProgram}</p>
              </div>
              <Clock className="w-8 h-8 text-metal-orange" />
            </div>
          </motion.div>

          <motion.div
            className="bg-metal-card rounded-lg p-6 border border-metal-light-gray/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-metal-text-secondary text-sm">Alertas do Sistema</p>
                <p className="text-2xl font-bold text-metal-red">{stats.systemAlerts}</p>
              </div>
              <div className="w-8 h-8 bg-metal-red/20 rounded-full flex items-center justify-center">
                <span className="text-metal-red text-sm font-bold">!</span>
              </div>
                         </div>
           </motion.div>
           </div>
         )}

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4 tracking-wider uppercase">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.a
                  key={action.label}
                  href={action.href}
                  className="bg-metal-card rounded-lg p-4 border border-metal-light-gray/20 hover:border-metal-orange/30 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon className="w-8 h-8 text-metal-orange mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </div>
                </motion.a>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-metal-card rounded-lg p-6 border border-metal-light-gray/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-xl font-bold mb-4 tracking-wider uppercase">
            Atividade Recente
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-metal-gray/50 rounded-lg">
              <div className="w-2 h-2 bg-metal-orange rounded-full"></div>
              <span className="text-sm">Nova banda "Lorna Shore" adicionada</span>
              <span className="text-xs text-metal-text-secondary ml-auto">2 min atrás</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-metal-gray/50 rounded-lg">
              <div className="w-2 h-2 bg-metal-orange rounded-full"></div>
              <span className="text-sm">Programação atualizada para hoje</span>
              <span className="text-xs text-metal-text-secondary ml-auto">15 min atrás</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-metal-gray/50 rounded-lg">
              <div className="w-2 h-2 bg-metal-red rounded-full"></div>
              <span className="text-sm">Alerta: Servidor de streaming instável</span>
              <span className="text-xs text-metal-text-secondary ml-auto">1 hora atrás</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard 