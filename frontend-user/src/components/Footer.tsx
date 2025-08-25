import { motion } from 'framer-motion'
import { Music, Heart, Volume2 } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Modern Metal</h3>
            <p>
              A rádio mais pesada do Brasil, trazendo 24 horas de metal ininterrupto. 
              Do metalcore ao death metal, sempre com a melhor qualidade e seleção.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3>Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/bandas" className="hover:text-primary transition-colors">
                  Bandas da Cena
                </a>
              </li>
              <li>
                <a href="/programs" className="hover:text-primary transition-colors">
                  Programação
                </a>
              </li>
              <li>
                <a href="/filmes" className="hover:text-primary transition-colors">
                  Filmaço
                </a>
              </li>
              <li>
                <a href="#listen-live" className="hover:text-primary transition-colors">
                  Ouvir ao Vivo
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3>Conecte-se</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary" />
                <span>24/7 Ao Vivo</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                <span>Feito com ❤️ para o Metal</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                <span>Música Sem Limites</span>
              </div>
            </div>
            
            <div className="mt-4">
              <a 
                href="mailto:contato@modernmetal.com.br" 
                className="text-primary hover:text-primary-light transition-colors"
              >
                contato@modernmetal.com.br
              </a>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p>
            © 2024 Modern Metal. Todos os direitos reservados. 
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer 