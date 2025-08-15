import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import ProgramGrid from './components/ProgramGrid'
import Filmaço from './components/Filmaço'
import MosaicGallery from './components/MosaicGallery'
import Footer from './components/Footer'


// Componente para o site principal
const MainSite = () => {
  return (
    <div className="min-h-screen bg-metal-dark">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        <main>
          <Hero />
          <ProgramGrid />
          <Filmaço />
          <MosaicGallery />
        </main>
        <Footer />

      </motion.div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal do site */}
        <Route path="/" element={<MainSite />} />
        
        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App 