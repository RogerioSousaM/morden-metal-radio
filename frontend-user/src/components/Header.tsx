import { motion } from 'framer-motion'
import { Radio, Instagram, Youtube, Twitter, Music } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SocialLinks {
  instagram: string
  youtube: string
  twitter: string
  tiktok: string
}

const Header = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    instagram: '',
    youtube: '',
    twitter: '',
    tiktok: ''
  })

  const navItems = [
    { label: 'Programação', href: '#programacao' },
    { label: 'Filmaço', href: '#filmaço' },
    { label: 'Destaques', href: '#destaques' },
  ]

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const response = await fetch('/api/social-links')
        if (response.ok) {
          const data = await response.json()
          setSocialLinks(data)
        }
      } catch (error) {
        console.error('Erro ao carregar links sociais:', error)
      }
    }

    loadSocialLinks()
  }, [])

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-metal-dark/90 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Radio className="w-8 h-8 text-metal-orange" />
            <h1 className="text-xl font-bold text-metal-text tracking-widest uppercase">
              Morden Metal
            </h1>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="nav-link"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* Social Links (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {socialLinks.instagram && (
              <motion.a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-metal-text-secondary hover:text-metal-orange transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
            )}
            {socialLinks.youtube && (
              <motion.a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-metal-text-secondary hover:text-metal-orange transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Youtube className="w-5 h-5" />
              </motion.a>
            )}
            {socialLinks.twitter && (
              <motion.a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-metal-text-secondary hover:text-metal-orange transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            )}
            {socialLinks.tiktok && (
              <motion.a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-metal-text-secondary hover:text-metal-orange transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Music className="w-5 h-5" />
              </motion.a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-metal-text hover:text-metal-orange transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header 