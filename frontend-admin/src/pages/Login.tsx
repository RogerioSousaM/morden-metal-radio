import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { apiService } from '../services/api'

interface LoginProps {
  onLogin?: () => void
}

const Login = ({ onLogin }: LoginProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Usar a API real de autenticação
      const response = await apiService.login({
        username: formData.username,
        password: formData.password
      })
      
      // Login bem-sucedido
      console.log('Login bem-sucedido:', response)
      
      // Chamar callback de login se fornecido
      if (onLogin) {
        onLogin()
      } else {
        // Redirecionar para o dashboard
        window.location.href = '/admin/dashboard'
      }
    } catch (err: any) {
      console.error('Erro no login:', err)
      setError(err.message || 'Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-metal-dark flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-metal-orange to-metal-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">MM</span>
            </div>
            <h1 className="text-2xl font-bold text-metal-text tracking-widest uppercase">
              Morden Metal
            </h1>
          </motion.div>
          <p className="text-metal-text-secondary">
            Painel Administrativo
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          className="bg-metal-card rounded-lg p-8 border border-metal-light-gray/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-center mb-6 tracking-wider uppercase">
            Acesso Administrativo
          </h2>

          {error && (
            <motion.div
              className="mb-4 p-3 bg-metal-red/10 border border-metal-red/30 rounded-lg flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4 text-metal-red" />
              <span className="text-sm text-metal-red">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-metal-text-secondary" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg pl-10 pr-4 py-3 text-metal-text focus:border-metal-orange focus:outline-none"
                  placeholder="Digite seu usuário"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-metal-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg pl-10 pr-12 py-3 text-metal-text focus:border-metal-orange focus:outline-none"
                  placeholder="Digite sua senha"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-metal-text-secondary hover:text-metal-orange transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full btn-primary py-3 mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-metal-gray/50 rounded-lg border border-metal-light-gray/20">
            <h3 className="text-sm font-medium text-metal-text mb-2">Credenciais de Demonstração:</h3>
            <div className="text-xs text-metal-text-secondary space-y-1">
              <p><strong>Usuário:</strong> admin</p>
              <p><strong>Senha:</strong> mordenmetal2024</p>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-xs text-metal-text-secondary">
            🔒 Acesso restrito a administradores autorizados
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login 