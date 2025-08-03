import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Instagram, Youtube, Twitter, Music, Save, RotateCcw,
  ExternalLink, CheckCircle, AlertCircle, Loader2, Share2
} from 'lucide-react'
import { apiService } from '../services/api'
import PageLayout from '../components/PageLayout'
import Card from '../components/ui/Card'

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
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/20',
      textColor: 'text-pink-500'
    },
    {
      key: 'youtube' as keyof SocialLinks,
      label: 'YouTube',
      icon: Youtube,
      placeholder: 'https://youtube.com/@mordenmetal',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-500'
    },
    {
      key: 'twitter' as keyof SocialLinks,
      label: 'Twitter/X',
      icon: Twitter,
      placeholder: 'https://twitter.com/mordenmetal',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      key: 'tiktok' as keyof SocialLinks,
      label: 'TikTok',
      icon: Music,
      placeholder: 'https://tiktok.com/@mordenmetal',
      color: 'from-black to-gray-800',
      bgColor: 'bg-gray-500/20',
      textColor: 'text-gray-600'
    }
  ]

  const stats = [
    {
      title: 'Links Configurados',
      value: Object.values(socialLinks).filter(link => link.trim() !== '').length.toString(),
      icon: Share2,
      color: 'from-metal-orange to-orange-600'
    },
    {
      title: 'Instagram',
      value: socialLinks.instagram ? 'Configurado' : 'Não configurado',
      icon: Instagram,
      color: socialLinks.instagram ? 'from-pink-500 to-pink-600' : 'from-gray-500 to-gray-600'
    },
    {
      title: 'YouTube',
      value: socialLinks.youtube ? 'Configurado' : 'Não configurado',
      icon: Youtube,
      color: socialLinks.youtube ? 'from-red-500 to-red-600' : 'from-gray-500 to-gray-600'
    },
    {
      title: 'Twitter/X',
      value: socialLinks.twitter ? 'Configurado' : 'Não configurado',
      icon: Twitter,
      color: socialLinks.twitter ? 'from-blue-400 to-blue-600' : 'from-gray-500 to-gray-600'
    }
  ]

  const actions = (
    <div className="flex gap-3">
      <motion.button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save className="w-4 h-4" />
        {saving ? 'Salvando...' : 'Salvar'}
      </motion.button>
      <motion.button
        onClick={handleReset}
        disabled={saving}
        className="btn-secondary flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RotateCcw className="w-4 h-4" />
        Resetar
      </motion.button>
    </div>
  )

  return (
    <PageLayout
      title="Gestão de Links Sociais"
      subtitle="Configure os links das redes sociais do site"
      actions={actions}
      loading={loading}
    >
      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border ${
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              delay={index * 0.1}
              className="p-6"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-metal-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-metal-text-secondary">{stat.title}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Social Links Form */}
      <Card delay={0.2} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialPlatforms.map((platform, index) => {
            const Icon = platform.icon
            return (
              <motion.div
                key={platform.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-metal-text">{platform.label}</h3>
                    <p className="text-sm text-metal-text-secondary">URL do perfil</p>
                  </div>
                </div>
                
                <div className="relative">
                  <input
                    type="url"
                    value={socialLinks[platform.key]}
                    onChange={(e) => handleInputChange(platform.key, e.target.value)}
                    placeholder={platform.placeholder}
                    className="form-input pr-10"
                  />
                  {socialLinks[platform.key] && (
                    <a
                      href={socialLinks[platform.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-metal-text-secondary hover:text-metal-orange transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                
                {socialLinks[platform.key] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-3 rounded-lg ${platform.bgColor} border border-current/20`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${platform.textColor}`} />
                      <span className={`text-sm font-medium ${platform.textColor}`}>
                        Link configurado
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* Preview Section */}
      <Card delay={0.3} className="mt-6 p-6">
        <h3 className="text-lg font-semibold text-metal-text mb-4">Preview dos Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon
            const hasLink = socialLinks[platform.key] && socialLinks[platform.key].trim() !== ''
            
            return (
              <div
                key={platform.key}
                className={`p-4 rounded-lg border transition-all ${
                  hasLink
                    ? 'border-metal-orange/30 bg-metal-orange/5'
                    : 'border-metal-light-gray/20 bg-metal-gray/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    hasLink ? `bg-gradient-to-br ${platform.color}` : 'bg-metal-gray'
                  }`}>
                    <Icon className={`w-4 h-4 ${hasLink ? 'text-white' : 'text-metal-text-secondary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-metal-text text-sm">{platform.label}</p>
                    <p className={`text-xs truncate ${
                      hasLink ? 'text-metal-orange' : 'text-metal-text-secondary'
                    }`}>
                      {hasLink ? 'Link ativo' : 'Não configurado'}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </PageLayout>
  )
}

export default SocialLinksManagement 