import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react'

interface Program {
  id: string
  title: string
  time: string
  day: string
  host: string
  genre: string
  status: 'active' | 'inactive'
  description: string
}

const ScheduleManagement: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)

  // Mock data - replace with API call
  useEffect(() => {
    const loadPrograms = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPrograms([
        {
          id: '1',
          title: 'Metal da Noite',
          time: '22:00',
          day: 'Segunda',
          host: 'DJ Metal',
          genre: 'Heavy Metal',
          status: 'active',
          description: 'Os melhores clássicos do heavy metal'
        },
        {
          id: '2',
          title: 'Deathcore Brasil',
          time: '20:00',
          day: 'Terça',
          host: 'MC Death',
          genre: 'Deathcore',
          status: 'active',
          description: 'Música pesada nacional'
        },
        {
          id: '3',
          title: 'Metalcore Internacional',
          time: '21:00',
          day: 'Quarta',
          host: 'DJ Core',
          genre: 'Metalcore',
          status: 'inactive',
          description: 'Bandas internacionais de metalcore'
        }
      ])
      setIsLoading(false)
    }

    loadPrograms()
  }, [])

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.host.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || program.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const handleAddProgram = () => {
    setShowAddModal(true)
    setEditingProgram(null)
  }

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program)
    setShowAddModal(true)
  }

  const handleDeleteProgram = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este programa?')) {
      setPrograms(programs.filter(p => p.id !== id))
    }
  }

  const handleSaveProgram = (programData: Omit<Program, 'id'>) => {
    if (editingProgram) {
      // Update existing program
      setPrograms(programs.map(p => 
        p.id === editingProgram.id 
          ? { ...programData, id: editingProgram.id }
          : p
      ))
    } else {
      // Add new program
      const newProgram = {
        ...programData,
        id: Date.now().toString()
      }
      setPrograms([...programs, newProgram])
    }
    
    setShowAddModal(false)
    setEditingProgram(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Gerenciar Programação</h1>
          <p className="text-muted">Configure horários, programas e locutores da rádio</p>
        </div>
        <button
          onClick={handleAddProgram}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Adicionar Programa
        </button>
      </div>

      {/* Extra spacing after header */}
      <div className="h-8"></div>

      {/* Search and Filters */}
      <div className="search-filter-container">
        <div className="search-input">
          <input
            type="text"
            placeholder="Buscar programas ou locutores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="filter-select">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </div>

      {/* Spacing between search and table */}
      <div className="h-4"></div>

      {/* Programs Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Programas da Semana</h2>
          <span className="text-sm text-muted">
            {filteredPrograms.length} programa(s) encontrado(s)
          </span>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Programa</th>
                <th>Horário</th>
                <th>Dia</th>
                <th>Locutor</th>
                <th>Gênero</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map((program) => (
                <tr key={program.id}>
                  <td>
                    <div>
                      <div className="font-medium">{program.title}</div>
                      <div className="text-xs text-muted">{program.description}</div>
                    </div>
                  </td>
                  <td className="font-mono">{program.time}</td>
                  <td>{program.day}</td>
                  <td>{program.host}</td>
                  <td>{program.genre}</td>
                  <td>
                    <span className={`badge ${program.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {program.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleEditProgram(program)}
                        className="btn btn-secondary btn-sm"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProgram(program.id)}
                        className="btn btn-danger btn-sm"
                        title="Excluir"
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

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted mb-2">Nenhum programa encontrado</h3>
            <p className="text-muted">
              {searchTerm || filterStatus !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando seu primeiro programa'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Program Modal */}
      {showAddModal && (
        <ProgramModal
          program={editingProgram}
          onSave={handleSaveProgram}
          onClose={() => {
            setShowAddModal(false)
            setEditingProgram(null)
          }}
        />
      )}
    </div>
  )
}

// Program Modal Component
interface ProgramModalProps {
  program: Program | null
  onSave: (data: Omit<Program, 'id'>) => void
  onClose: () => void
}

const ProgramModal: React.FC<ProgramModalProps> = ({ program, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: program?.title || '',
    time: program?.time || '',
    day: program?.day || 'Segunda',
    host: program?.host || '',
    genre: program?.genre || '',
    status: program?.status || 'active' as const,
    description: program?.description || ''
  })

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  const genres = ['Heavy Metal', 'Death Metal', 'Black Metal', 'Metalcore', 'Deathcore', 'Thrash Metal', 'Power Metal']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {program ? 'Editar Programa' : 'Adicionar Programa'}
          </h2>
          <button onClick={onClose} className="modal-close">
            <span className="sr-only">Fechar</span>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome do Programa</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                placeholder="Ex: Metal da Noite"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Horário</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Dia da Semana</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="form-select"
                required
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Locutor</label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                className="form-input"
                placeholder="Ex: DJ Metal"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gênero Musical</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="form-select"
                required
              >
                <option value="">Selecione um gênero</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="form-select"
                required
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              placeholder="Descreva o programa..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {program ? 'Atualizar' : 'Adicionar'} Programa
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScheduleManagement