import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import ProgramGrid from './components/ProgramGrid'
import Filmaço from './components/Filmaço'
import BandasDaCena from './components/BandasDaCena'
import Footer from './components/Footer'
import ToastContainer, { useToast } from './components/ui/Toast'

// Componente para o site principal (landing page)
const MainSite = () => {
  const { toasts, removeToast } = useToast()
  
  return (
    <div className="main-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        <main className="main-content">
          <Hero />
          <ProgramGrid />
          <Filmaço />
          <BandasDaCena />
        </main>
        <Footer />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </div>
  )
}

// Página dedicada para Bandas da Cena
const BandasPage = () => {
  const { toasts, removeToast } = useToast()
  
  return (
    <div className="main-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        <main className="main-content">
          <div className="section section-hero">
            <div className="container">
              <motion.h1 
                className="heading-1 text-center text-gradient mb-8"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                🎸 BANDAS DA CENA
              </motion.h1>
              <BandasDaCena />
            </div>
          </div>
        </main>
        <Footer />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </div>
  )
}

// Página dedicada para Programas
const ProgramsPage = () => {
  const { toasts, removeToast } = useToast()
  
  return (
    <div className="main-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        <main className="main-content">
          <div className="section section-hero">
            <div className="container">
              <motion.h1 
                className="heading-1 text-center text-gradient mb-8"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                📻 PROGRAMAÇÃO
              </motion.h1>
              <ProgramGrid />
            </div>
          </div>
        </main>
        <Footer />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </div>
  )
}

// Página dedicada para Filmaço
const FilmesPage = () => {
  const { toasts, removeToast } = useToast()
  
  return (
    <div className="main-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        <main className="main-content">
          <div className="section section-hero">
            <div className="container">
              <motion.h1 
                className="heading-1 text-center text-gradient mb-8"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                🎬 FILMAÇO
              </motion.h1>
              <Filmaço />
            </div>
          </div>
        </main>
        <Footer />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal do site (landing page) */}
        <Route path="/" element={<MainSite />} />
        
        {/* Rotas específicas */}
        <Route path="/bandas" element={<BandasPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/filmes" element={<FilmesPage />} />
        
        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App 