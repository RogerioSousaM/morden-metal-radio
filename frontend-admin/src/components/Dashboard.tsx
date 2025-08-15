import { motion } from 'framer-motion'
import { Users, Music, Clock, TrendingUp, Plus, Edit, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    listeners: 1234,
    topSong: 'Sleep Token - Take Me Back to Eden',
    nextProgram: 'Metal Noturno - 00:00',
    systemAlerts: 2
  })

  const [recentActivity] = useState([
    { id: 1, action: 'Programa editado', target: 'Metal Noturno', time: '15 min atrás' },
    { id: 2, action: 'Usuário logado', target: 'admin', time: '1 hora atrás' },
    { id: 3, action: 'Arquivo enviado', target: 'nova_musica.mp3', time: '2 horas atrás' }
  ])

  useEffect(() => {
    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        listeners: prev.listeners + Math.floor(Math.random() * 10) - 5
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-widest uppercase mb-2">
              Dashboard
            </h1>
            <p className="text-metal-text-secondary">
              Visão geral do sistema
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-metal-text-secondary">Última atualização: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Cards de Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Ouvintes Online */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Ouvintes Online</p>
              <p className="text-3xl font-bold text-white">{stats.listeners.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+12% hoje</span>
          </div>
        </div>

        {/* Top do Mês */}
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm font-medium">Top do Mês</p>
              <p className="text-lg font-semibold text-white truncate">{stats.topSong}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-orange-400 text-sm">1.2M reproduções</span>
          </div>
        </div>

        {/* Próximo Programa */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">Próximo Programa</p>
              <p className="text-lg font-semibold text-white">{stats.nextProgram}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-purple-400 text-sm">AO VIVO em 15 min</span>
          </div>
        </div>

        {/* Alertas do Sistema */}
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm font-medium">Alertas do Sistema</p>
              <p className="text-3xl font-bold text-white">{stats.systemAlerts}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-red-400 text-sm">Requer atenção</span>
          </div>
        </div>
      </motion.div>

      {/* Ações Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 hover:text-green-200 transition-all duration-300">
              <Plus className="w-5 h-5" />
              <span>Upload de Arquivo</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-300">
              <Edit className="w-5 h-5" />
              <span>Editar Programação</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-300">
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </button>
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.target}</p>
                  </div>
                </div>
                <span className="text-gray-500 text-xs">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gráfico de Ouvintes (Simulado) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Ouvintes nas Últimas 24h</h3>
        <div className="h-32 bg-gray-700/30 rounded-lg flex items-end justify-between p-4">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="w-3 bg-gradient-to-t from-orange-500 to-red-500 rounded-t"
              style={{ height: `${Math.random() * 80 + 20}%` }}
            ></div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:59</span>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard 