import { motion } from 'framer-motion'
import { 
  Users, Calendar, FileText, 
  Radio, Settings, Image,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card'

const Dashboard = () => {
  const stats = [
    {
      title: 'Programas Ativos',
      value: '8',
      change: '+3%',
      changeType: 'increase' as const,
      icon: Calendar,
      color: 'from-metal-accent to-blue-600'
    },
    {
      title: 'Arquivos',
      value: '156',
      change: '+8%',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'from-metal-green to-green-600'
    },
    {
      title: 'Usuários',
      value: '1.2k',
      change: '-2%',
      changeType: 'decrease' as const,
      icon: Users,
      color: 'from-metal-blue to-blue-600'
    },
    {
      title: 'Carrosséis',
      value: '3',
      change: '+1%',
      changeType: 'increase' as const,
      icon: Image,
      color: 'from-metal-purple to-purple-600'
    }
  ]

  const quickActions = [
    {
      title: 'Programação',
      description: 'Configurar horários e programas',
      icon: Calendar,
      href: '/admin/schedule',
      color: 'bg-gradient-to-br from-metal-accent/20 to-blue-600/20'
    },
    {
      title: 'Upload de Arquivos',
      description: 'Fazer upload de músicas e documentos',
      icon: FileText,
      href: '/admin/files',
      color: 'bg-gradient-to-br from-metal-green/20 to-green-600/20'
    },
  ]

  const recentActivity = [
    {
      action: 'Programa atualizado',
      target: 'Metal Show',
      time: '15 minutos atrás',
      type: 'update' as const
    },
    {
      action: 'Arquivo removido',
      target: 'musica_antiga.mp3',
      time: '1 hora atrás',
      type: 'delete' as const
    },
    {
      action: 'Usuário adicionado',
      target: 'Novo Admin',
      time: '3 horas atrás',
      type: 'add' as const
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Visão geral do sistema e estatísticas em tempo real"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Stats Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.title} variants={itemVariants}>
                <Card className="relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-metal-text-secondary mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-metal-text">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {stat.changeType === 'increase' ? (
                          <ArrowUpRight className="w-4 h-4 text-metal-green" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-metal-red" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'increase' ? 'text-metal-green' : 'text-metal-red'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-metal-text-secondary">vs mês passado</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-fr min-h-[120px]">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <motion.a
                        key={action.title}
                        href={action.href}
                        className={`h-full p-2.5 rounded-lg border border-metal-border hover:border-metal-orange/30 transition-all duration-200 group ${action.color}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-2.5 h-full">
                          <div className="w-10 h-10 bg-metal-card rounded-lg flex items-center justify-center group-hover:bg-metal-orange/20 transition-colors flex-shrink-0">
                            <Icon className="w-5 h-5 text-metal-orange" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-start">
                                                         <h3 className="font-semibold text-metal-text group-hover:text-metal-orange transition-colors leading-tight text-xs truncate">
                               {action.title}
                             </h3>
                            <p className="text-xs text-metal-text-secondary mt-1 leading-relaxed flex-1">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </motion.a>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-metal-gray/30 transition-colors"
                    >
                      <div className="w-8 h-8 bg-metal-gray rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-metal-orange" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-metal-text">
                          <span className="font-medium">{activity.action}</span>
                          <span className="text-metal-text-secondary">: {activity.target}</span>
                        </p>
                        <p className="text-xs text-metal-text-secondary mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-metal-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Radio className="w-8 h-8 text-metal-green" />
                  </div>
                  <h3 className="font-semibold text-metal-text">Transmissão</h3>
                  <p className="text-sm text-metal-green">Online</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-metal-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Settings className="w-8 h-8 text-metal-accent" />
                  </div>
                  <h3 className="font-semibold text-metal-text">Sistema</h3>
                  <p className="text-sm text-metal-accent">Operacional</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-metal-orange/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-8 h-8 text-metal-orange" />
                  </div>
                  <h3 className="font-semibold text-metal-text">Performance</h3>
                  <p className="text-sm text-metal-orange">Excelente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageLayout>
  )
}

export default Dashboard 