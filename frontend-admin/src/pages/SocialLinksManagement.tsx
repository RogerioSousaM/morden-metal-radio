import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Instagram, Youtube, Twitter, Music, Save, RotateCcw,
  ExternalLink, CheckCircle, AlertCircle, Loader2
} from 'lucide-react'
import { apiService } from '../services/api'

interface SocialLinks {
  instagram: string
  youtube: string
  twitter: string
  tiktok: string
}

const SocialLinksManagement = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    instagram: '',
    youtube: '',
    twitter: '',
    tiktok: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadSocialLinks()
  }, [])

  const loadSocialLinks = async () => {
    try {
      setLoading(true)
      const data = await apiService.getSocialLinks()
      setSocialLinks(data)
    } catch (error) {
      console.error('Erro ao carregar links sociais:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar links sociais' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)
      
      await apiService.updateSocialLinks(socialLinks)
      setMessage({ type: 'success', text: 'Links sociais atualizados com sucesso!' })
      
      // Auto-hide success message
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Erro ao salvar links sociais:', error)
      setMessage({ type: 'error', text: 'Erro ao salvar links sociais' })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    try {
      setSaving(true)
      setMessage(null)
      
      await apiService.resetSocialLinks()
      await loadSocialLinks()
      setMessage({ type: 'success', text: 'Links sociais resetados para valores padrão!' })
      
      // Auto-hide success message
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Erro ao resetar links sociais:', error)
      setMessage({ type: 'error', text: 'Erro ao resetar links sociais' })
    } finally {
      setSaving(false)
    }
  }

  const socialPlatforms = [
    {
      key: 'instagram' as keyof SocialLinks,
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'https://instagram.com/mordenmetal',
      color: 'text-pink-500'
    },
    {
      key: 'youtube' as keyof SocialLinks,
      label: 'YouTube',
      icon: Youtube,
      placeholder: 'https://youtube.com/@mordenmetal',
      color: 'text-red-500'
    },
    {
      key: 'twitter' as keyof SocialLinks,
      label: 'Twitter/X',
      icon: Twitter,
      placeholder: 'https://twitter.com/mordenmetal',
      color: 'text-blue-400'
    },
    {
      key: 'tiktok' as keyof SocialLinks,
      label: 'TikTok',
      icon: Music,
      placeholder: 'https://tiktok.com/@mordenmetal',
      color: 'text-black'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-metal-orange animate-spin" />
        <span className="ml-3 text-metal-text">Carregando links sociais...</span>
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
              Gestão de Links Sociais
            </h1>
            <p className="text-metal-text-secondary">
              Configure os links das redes sociais
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
            className={`p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Links Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-metal-gray/30 rounded-lg p-6 border border-metal-light-gray/30"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialPlatforms.map((platform, index) => {
            const Icon = platform.icon
            return (
              <motion.div
                key={platform.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-metal-text">
                  <Icon className={`w-5 h-5 ${platform.color}`} />
                  {platform.label}
                </label>
                
                <div className="relative">
                  <input
                    type="url"
                    value={socialLinks[platform.key]}
                    onChange={(e) => handleInputChange(platform.key, e.target.value)}
                    placeholder={platform.placeholder}
                    className="w-full px-4 py-3 bg-metal-dark border border-metal-light-gray/30 rounded-lg text-metal-text placeholder-metal-text-secondary focus:outline-none focus:ring-2 focus:ring-metal-orange focus:border-transparent transition-all duration-300"
                  />
                  
                  {socialLinks[platform.key] && (
                    <motion.a
                      href={socialLinks[platform.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-metal-text-secondary hover:text-metal-orange transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  )}
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
          className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-metal-light-gray/30"
        >
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-metal-orange text-white rounded-lg font-medium hover:bg-metal-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </motion.button>

          <motion.button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-metal-light-gray/50 text-metal-text rounded-lg font-medium hover:bg-metal-light-gray/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-5 h-5" />
            Resetar para Padrão
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-metal-dark/50 rounded-lg p-4 border border-metal-light-gray/20"
      >
        <h3 className="text-lg font-semibold text-metal-text mb-2">ℹ️ Informações</h3>
        <ul className="text-sm text-metal-text-secondary space-y-1">
          <li>• Os links configurados aparecem no header e footer do site principal</li>
          <li>• Facebook foi excluído conforme solicitado</li>
          <li>• Todos os links devem ser URLs válidas (https://)</li>
          <li>• Use "Resetar para Padrão" para restaurar os valores iniciais</li>
        </ul>
      </motion.div>
    </div>
  )
}

export default SocialLinksManagement 