import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Shield, Server, Bell, 
  Save, RotateCcw, CheckCircle, AlertCircle, Loader2
} from 'lucide-react'

interface SettingsConfig {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  debugMode: boolean
  emailNotifications: boolean
  autoBackup: boolean
  sessionTimeout: number
  maxUploadSize: number
}

const SettingsManagement = () => {
  const [settings, setSettings] = useState<SettingsConfig>({
    siteName: 'Morden Metal',
    siteDescription: 'Rádio Metal 24/7',
    maintenanceMode: false,
    debugMode: false,
    emailNotifications: true,
    autoBackup: true,
    sessionTimeout: 30,
    maxUploadSize: 10
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Simular carregamento de configurações
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof SettingsConfig, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1500))
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      // Simular reset
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSettings({
        siteName: 'Morden Metal',
        siteDescription: 'Rádio Metal 24/7',
        maintenanceMode: false,
        debugMode: false,
        emailNotifications: true,
        autoBackup: true,
        sessionTimeout: 30,
        maxUploadSize: 10
      })
      setMessage({ type: 'success', text: 'Configurações resetadas para padrão!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao resetar configurações' })
    } finally {
      setSaving(false)
    }
  }

  const settingsSections = [
    {
      title: 'Configurações Gerais',
      icon: Settings,
      fields: [
        {
          label: 'Nome do Site',
          type: 'text' as const,
          field: 'siteName' as keyof SettingsConfig,
          placeholder: 'Digite o nome do site'
        },
        {
          label: 'Descrição do Site',
          type: 'textarea' as const,
          field: 'siteDescription' as keyof SettingsConfig,
          placeholder: 'Digite a descrição do site'
        }
      ]
    },
    {
      title: 'Sistema',
      icon: Server,
      fields: [
        {
          label: 'Modo Manutenção',
          type: 'checkbox' as const,
          field: 'maintenanceMode' as keyof SettingsConfig,
          description: 'Ativar modo de manutenção'
        },
        {
          label: 'Modo Debug',
          type: 'checkbox' as const,
          field: 'debugMode' as keyof SettingsConfig,
          description: 'Ativar logs de debug'
        },
        {
          label: 'Timeout de Sessão (minutos)',
          type: 'number' as const,
          field: 'sessionTimeout' as keyof SettingsConfig,
          min: 5,
          max: 120
        }
      ]
    },
    {
      title: 'Notificações',
      icon: Bell,
      fields: [
        {
          label: 'Notificações por Email',
          type: 'checkbox' as const,
          field: 'emailNotifications' as keyof SettingsConfig,
          description: 'Receber notificações por email'
        }
      ]
    },
    {
      title: 'Backup e Segurança',
      icon: Shield,
      fields: [
        {
          label: 'Backup Automático',
          type: 'checkbox' as const,
          field: 'autoBackup' as keyof SettingsConfig,
          description: 'Realizar backup automático'
        },
        {
          label: 'Tamanho Máximo de Upload (MB)',
          type: 'number' as const,
          field: 'maxUploadSize' as keyof SettingsConfig,
          min: 1,
          max: 100
        }
      ]
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-metal-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-metal-orange mx-auto mb-4" />
          <p className="text-metal-text-secondary">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
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
              Gestão de Configurações
            </h1>
            <p className="text-metal-text-secondary">
              Gerencie as configurações do sistema
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-5 h-5" />
              Salvar
            </motion.button>
            <motion.button
              onClick={handleReset}
              disabled={saving}
              className="btn-secondary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-5 h-5" />
              Resetar
            </motion.button>
          </div>
        </div>
      </motion.div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {settingsSections.map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-metal-card border border-metal-light-gray/20 rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-metal-orange/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-metal-orange" />
                  </div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.field} className="space-y-2">
                      <label className="text-sm font-medium text-metal-text-secondary">
                        {field.label}
                      </label>
                      
                      {field.type === 'text' && 'placeholder' in field && (
                        <input
                          type="text"
                          value={settings[field.field] as string}
                          onChange={(e) => handleInputChange(field.field, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-3 text-metal-text focus:border-metal-orange focus:outline-none transition-colors"
                        />
                      )}
                      
                      {field.type === 'textarea' && 'placeholder' in field && (
                        <textarea
                          value={settings[field.field] as string}
                          onChange={(e) => handleInputChange(field.field, e.target.value)}
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-3 text-metal-text focus:border-metal-orange focus:outline-none transition-colors resize-none"
                        />
                      )}
                      
                      {field.type === 'number' && 'min' in field && 'max' in field && (
                        <input
                          type="number"
                          value={settings[field.field] as number}
                          onChange={(e) => handleInputChange(field.field, parseInt(e.target.value))}
                          min={field.min}
                          max={field.max}
                          className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-3 text-metal-text focus:border-metal-orange focus:outline-none transition-colors"
                        />
                      )}
                      
                      {field.type === 'checkbox' && 'description' in field && (
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={settings[field.field] as boolean}
                            onChange={(e) => handleInputChange(field.field, e.target.checked)}
                            className="w-4 h-4 text-metal-orange bg-metal-gray border-metal-light-gray/30 rounded focus:ring-metal-orange"
                          />
                          <span className="text-sm text-metal-text-secondary">
                            {field.description}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-end"
        >
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-metal-gray hover:bg-metal-light-gray text-metal-text border border-metal-light-gray/30 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Resetar
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-metal-orange hover:bg-orange-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default SettingsManagement 