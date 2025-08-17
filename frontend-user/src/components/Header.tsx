import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, X } from 'lucide-react'

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  // Detectar scroll para comportamento sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fechar menu mobile ao clicar em um item
  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  // Fechar menu mobile ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Skip Links para acessibilidade */}
      <nav aria-label="Skip navigation">
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <a href="#bandas" className="skip-link">
          Pular para Bandas da Cena
        </a>
      </nav>

      {/* Live Region para anúncios */}
      <div aria-live="polite" aria-atomic="true" className="live-region">
        {announcement}
      </div>

      <header className={`header ${isScrolled ? 'scrolled backdrop-blur-sm bg-black/40 border-b border-metal-light-gray/14' : ''}`}>
        <div className="header-content">
          {/* Logo */}
          <motion.a
            href="/"
            className="header-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Página inicial Metalcore"
          >
            <Music className="header-logo-icon" />
            <span className="font-display">METALCORE</span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="header-nav">
            <a href="#bandas" className="header-nav-item active">
              Bandas da Cena
            </a>
            <a href="#programas" className="header-nav-item">
              Programas
            </a>
            <a href="#filmes" className="header-nav-item">
              Filmaço
            </a>
            <a href="#noticias" className="header-nav-item">
              Notícias
            </a>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Primary CTA */}
            <motion.a
              href="#listen-live"
              className="btn-accent-base touch-target"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Ouvir rádio ao vivo"
              onFocus={() => setAnnouncement('Botão Listen Live focado')}
            >
              🎧 Listen Live Now
            </motion.a>

            {/* Mini Player Icon */}
            <motion.button
              className="header-player touch-target"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Abrir player de música"
              onFocus={() => setAnnouncement('Player de música focado')}
            >
              <Music size={20} />
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle touch-target"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menu de navegação"
              aria-expanded={isMobileMenuOpen}
              onFocus={() => setAnnouncement('Menu de navegação focado')}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-over Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu */}
            <motion.div
              className="mobile-menu"
              initial={{ right: '-100%' }}
              animate={{ right: 0 }}
              exit={{ right: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Menu Header */}
              <div className="mobile-menu-header">
                <div className="header-logo">
                  <Music className="header-logo-icon" />
                  <span>METALCORE</span>
                </div>
                <button
                  className="mobile-menu-close"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Fechar menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="mobile-nav">
                <a
                  href="#bandas"
                  className="mobile-nav-item active"
                  onClick={handleNavClick}
                >
                  🎸 Bandas da Cena
                </a>
                <a
                  href="#programas"
                  className="mobile-nav-item"
                  onClick={handleNavClick}
                >
                  📻 Programas
                </a>
                <a
                  href="#filmes"
                  className="mobile-nav-item"
                  onClick={handleNavClick}
                >
                  🎬 Filmaço
                </a>
                <a
                  href="#noticias"
                  className="mobile-nav-item"
                  onClick={handleNavClick}
                >
                  📰 Notícias
                </a>
              </nav>

              {/* Mobile CTA */}
              <div className="mt-8 pt-6 border-t border-metal-edge">
                <motion.a
                  href="#listen-live"
                  className="header-cta w-full text-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNavClick}
                >
                  🎧 Listen Live Now
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header 