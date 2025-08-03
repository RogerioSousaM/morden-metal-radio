import { motion, AnimatePresence } from 'framer-motion'
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
  Lock,
  AlertCircle
} from 'lucide-react'
import { apiService } from '@/services/api'
import PageLayout from '../components/PageLayout'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

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
  const [saving, setSaving] = useState(false)

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
    setSaving(true)
    
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
    } finally {
      setSaving(false)
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

  const handleAddNew = () => {
    setEditingUser(null)
    resetForm()
    setShowForm(true)
  }

  const handleCloseModal = () => {
    setShowForm(false)
    setEditingUser(null)
    resetForm()
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    {
      title: 'Total de Usuários',
      value: users.length.toString(),
      icon: User,
      color: 'from-metal-orange to-orange-600'
    },
    {
      title: 'Administradores',
      value: users.filter(u => u.role === 'admin').length.toString(),
      icon: Shield,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Usuários Comuns',
      value: users.filter(u => u.role === 'user').length.toString(),
      icon: User,
      color: 'from-metal-accent to-blue-600'
    },
    {
      title: 'Este Mês',
      value: users.filter(u => {
        const createdAt = new Date(u.createdAt)
        const now = new Date()
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
      }).length.toString(),
      icon: Lock,
      color: 'from-green-500 to-green-600'
    }
  ]

  return (
    <PageLayout
      title="Gestão de Usuários"
      subtitle="Gerencie os usuários e permissões do sistema"
      showAddButton={true}
      onAddClick={handleAddNew}
      addButtonLabel="Novo Usuário"
      loading={loading}
    >
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg border bg-red-500/10 border-red-500/30 text-red-400"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
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

      {/* Busca */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-metal-text-secondary" />
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input pl-10"
        />
      </div>

      {/* Lista de Usuários */}
      <div className="bg-metal-card rounded-lg border border-metal-light-gray/20 overflow-hidden">
        <div className="p-6 border-b border-metal-light-gray/20">
          <h3 className="text-lg font-semibold text-metal-text">Usuários</h3>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-16 h-16 text-metal-text-secondary mx-auto mb-4" />
            <p className="text-metal-text-secondary">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-metal-light-gray/20">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-metal-gray/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-metal-gray rounded-lg flex items-center justify-center">
                      {user.role === 'admin' ? (
                        <Shield className="w-6 h-6 text-metal-orange" />
                      ) : (
                        <User className="w-6 h-6 text-metal-accent" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-metal-text">{user.username}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-metal-accent/20 text-metal-accent border border-metal-accent/30'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </div>
                        <span className="text-xs text-metal-text-secondary">
                          Criado em {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-metal-text-secondary hover:text-metal-orange transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-metal-text-secondary hover:text-metal-red transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Formulário Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseModal}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Nome de Usuário</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="form-input"
              placeholder="Digite o nome de usuário"
              required
            />
          </div>

          <div>
            <label className="form-label">
              {editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input pr-10"
                placeholder={editingUser ? 'Nova senha (opcional)' : 'Digite a senha'}
                required={!editingUser}
              />
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
            <label className="form-label">Tipo de Usuário</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="form-select"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-metal-border">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Salvando...' : (editingUser ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

export default UsersManagement 