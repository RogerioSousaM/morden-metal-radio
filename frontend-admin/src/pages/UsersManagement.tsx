import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Shield, 
  Search,
  Save,
  X,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react'
import { apiService } from '@/services/api'

interface User {
  id: number
  username: string
  role: string
  createdAt: string
  updatedAt: string
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await apiService.getUsers()
      setUsers(data)
    } catch (error) {
      setError('Erro ao carregar usuários')
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await apiService.updateUser(editingUser.id, formData)
      } else {
        await apiService.createUser(formData)
      }
      setShowForm(false)
      setEditingUser(null)
      resetForm()
      loadUsers()
    } catch (error) {
      setError('Erro ao salvar usuário')
      console.error('Erro ao salvar usuário:', error)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: '',
      role: user.role
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await apiService.deleteUser(id)
        loadUsers()
      } catch (error) {
        setError('Erro ao excluir usuário')
        console.error('Erro ao excluir usuário:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'user'
    })
    setShowPassword(false)
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-metal-orange/30 border-t-metal-orange rounded-full animate-spin"></div>
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
              Gestão de Usuários
            </h1>
            <p className="text-metal-text-secondary">
              Gerencie os usuários do sistema
            </p>
          </div>
          <motion.button
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setShowForm(true)
              setEditingUser(null)
              resetForm()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Novo Usuário
          </motion.button>
        </div>
      </motion.div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-metal-text-secondary" />
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-metal-card border border-metal-light-gray/20 rounded-lg text-metal-text placeholder-metal-text-secondary focus:outline-none focus:ring-2 focus:ring-metal-orange"
        />
      </div>

      {/* Formulário */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-metal-card border border-metal-light-gray/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-metal-text">
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingUser(null)
                resetForm()
              }}
              className="text-metal-text-secondary hover:text-metal-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-metal-text-secondary mb-2">
                Nome de Usuário
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 bg-metal-dark border border-metal-light-gray/20 rounded-lg text-metal-text focus:outline-none focus:ring-2 focus:ring-metal-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-metal-text-secondary mb-2">
                Senha {editingUser && '(deixe em branco para manter a atual)'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2 bg-metal-dark border border-metal-light-gray/20 rounded-lg text-metal-text focus:outline-none focus:ring-2 focus:ring-metal-orange"
                  required={!editingUser}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-metal-text-secondary" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-metal-text-secondary hover:text-metal-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-metal-text-secondary mb-2">
                Função
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 bg-metal-dark border border-metal-light-gray/20 rounded-lg text-metal-text focus:outline-none focus:ring-2 focus:ring-metal-orange"
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
                <option value="moderator">Moderador</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-metal-orange hover:bg-metal-orange/90 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingUser ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingUser(null)
                  resetForm()
                }}
                className="px-4 py-2 bg-metal-light-gray/20 hover:bg-metal-light-gray/30 text-metal-text rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de Usuários */}
      <div className="bg-metal-card border border-metal-light-gray/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-metal-dark/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-metal-text-secondary uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-metal-text-secondary uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-metal-text-secondary uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-metal-text-secondary uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-metal-light-gray/20">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-metal-dark/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-metal-orange to-metal-accent rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-metal-text">{user.username}</div>
                        <div className="text-sm text-metal-text-secondary">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === 'moderator'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {user.role === 'admin' ? 'Administrador' : 
                       user.role === 'moderator' ? 'Moderador' : 'Usuário'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-metal-text-secondary">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-metal-orange hover:text-metal-orange/80 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                        disabled={user.role === 'admin'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-metal-text-secondary mx-auto mb-4" />
            <p className="text-metal-text-secondary">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}

export default UsersManagement 