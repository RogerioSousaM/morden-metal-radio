import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Volume2 } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="text-gradient">MODERN METAL</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-menu hidden md:flex">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Início
            </Link>
            <Link
              to="/bandas"
              className={`nav-link ${isActive('/bandas') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Bandas
            </Link>
            <Link
              to="/programs"
              className={`nav-link ${isActive('/programs') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Programação
            </Link>
            <Link
              to="/filmes"
              className={`nav-link ${isActive('/filmes') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Filmaço
            </Link>
          </nav>

          {/* Live Radio Indicator */}
          <div className="live-radio hidden md:flex">
            <div className="live-dot"></div>
            <span className="text-sm font-medium">AO VIVO</span>
            <Volume2 className="w-4 h-4 ml-2" />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="mobile-nav md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-nav-content">
                <Link
                  to="/"
                  className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Início
                </Link>
                <Link
                  to="/bandas"
                  className={`mobile-nav-link ${isActive('/bandas') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Bandas
                </Link>
                <Link
                  to="/programs"
                  className={`mobile-nav-link ${isActive('/programs') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Programação
                </Link>
                <Link
                  to="/filmes"
                  className={`mobile-nav-link ${isActive('/filmes') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Filmaço
                </Link>
                
                {/* Mobile Live Radio */}
                <div className="mobile-live-radio">
                  <div className="live-dot"></div>
                  <span className="text-sm font-medium">AO VIVO</span>
                  <Volume2 className="w-4 h-4 ml-2" />
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header 