import { motion } from 'framer-motion'
import { Radio, Instagram, Twitter, Youtube, Music } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

interface SocialLinksData {
  instagram: string
  youtube: string
  twitter: string
  tiktok: string
}

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>({
    instagram: '',
    youtube: '',
    twitter: '',
    tiktok: ''
  })

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const data = await apiService.getSocialLinks()
        setSocialLinks(data)
      } catch (error) {
        console.error('Erro ao carregar links sociais:', error)
      }
    }

    loadSocialLinks()
  }, [])

  const socialPlatforms = [
    { icon: Instagram, href: socialLinks.instagram, label: 'Instagram' },
    { icon: Youtube, href: socialLinks.youtube, label: 'YouTube' },
    { icon: Twitter, href: socialLinks.twitter, label: 'Twitter' },
    { icon: Music, href: socialLinks.tiktok, label: 'TikTok' }
  ].filter(platform => platform.href) // Only show platforms with valid URLs

  return (
    <footer className="bg-metal-gray/50 border-t border-metal-light-gray/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Radio className="w-8 h-8 text-metal-orange" />
            <div>
              <h3 className="heading-6 text-metal-text">
                Morden Metal
              </h3>
              <p className="text-caption text-metal-text-secondary">
                Rádio online 24h
              </p>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {socialPlatforms.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-metal-light-gray/50 rounded-lg flex items-center justify-center text-metal-text-secondary hover:text-metal-orange hover:bg-metal-light-gray transition-all duration-300"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Visitar ${social.label}`}
                >
                  <Icon className="w-5 h-5 footer-social-icon" />
                </motion.a>
              )
            })}
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="text-center mt-6 pt-6 border-t border-metal-light-gray/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="footer-copyright">
            © 2024 Morden Metal. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer 