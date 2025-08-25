import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'

import BandasManagement from '../pages/BandasManagement'

// Mock the API service
vi.mock('../services/api', () => ({
  apiService: {
    getBands: vi.fn(),
    createBand: vi.fn(),
    updateBand: vi.fn(),
    deleteBand: vi.fn()
  }
}))

// Mock the router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/bandas' })
}))

describe('BandasManagement Component', () => {
  const mockBandas = [
    {
      id: 1,
      name: 'Sleep Token',
      slug: 'sleep-token',
      description: 'Metal alternativo com elementos experimentais',
      official_url: 'https://sleeptoken.com',
      image_url: 'https://example.com/sleep-token.jpg',
      genre_tags: '["metal alternativo", "experimental"]',
      featured: true,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the component with title', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasManagement />)

    expect(screen.getByText(/Gerenciamento de Bandas/i)).toBeInTheDocument()
  })

  it('should render bandas list when data is loaded', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasManagement />)

    await waitFor(() => {
      expect(screen.getByText('Sleep Token')).toBeInTheDocument()
    })
  })

  it('should open create modal when add button is clicked', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasManagement />)

    await waitFor(() => {
      const addButton = screen.getByText(/Adicionar Banda/i)
      fireEvent.click(addButton)
    })

    expect(screen.getByText(/Criar Nova Banda/i)).toBeInTheDocument()
  })

  it('should display form fields in create modal', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasManagement />)

    await waitFor(() => {
      const addButton = screen.getByText(/Adicionar Banda/i)
      fireEvent.click(addButton)
    })

    // Check form fields
    expect(screen.getByLabelText(/Nome da Banda/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Slug/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/URL Oficial/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/URL da Imagem/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tags de Gênero/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Banda em Destaque/i)).toBeInTheDocument()
  })

  it('should auto-generate slug from name', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasManagement />)

    await waitFor(() => {
      const addButton = screen.getByText(/Adicionar Banda/i)
      fireEvent.click(addButton)
    })

    const nameInput = screen.getByLabelText(/Nome da Banda/i)
    fireEvent.change(nameInput, { target: { value: 'Test Band Name' } })

    const slugInput = screen.getByLabelText(/Slug/i)
    expect(slugInput).toHaveValue('test-band-name')
  })

  it('should validate required fields', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasManagement />)

    await waitFor(() => {
      const addButton = screen.getByText(/Adicionar Banda/i)
      fireEvent.click(addButton)
    })

    const submitButton = screen.getByText(/Criar Banda/i)
    fireEvent.click(submitButton)

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/Slug é obrigatório/i)).toBeInTheDocument()
    })
  })

  it('should create new banda successfully', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)
    vi.mocked(apiService.createBand).mockResolvedValue({ ...mockBandas[0], id: 2 })

    render(<BandasManagement />)

    await waitFor(() => {
      const addButton = screen.getByText(/Adicionar Banda/i)
      fireEvent.click(addButton)
    })

    // Fill form
    fireEvent.change(screen.getByLabelText(/Nome da Banda/i), { target: { value: 'New Band' } })
    fireEvent.change(screen.getByLabelText(/Slug/i), { target: { value: 'new-band' } })
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'A new band' } })

    const submitButton = screen.getByText(/Criar Banda/i)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(apiService.createBand).toHaveBeenCalledWith({
        name: 'New Band',
        slug: 'new-band',
        description: 'A new band',
        official_url: '',
        image_url: '',
        genre_tags: '[]',
        featured: false
      })
    })
  })

  it('should edit existing banda', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasManagement />)

    await waitFor(() => {
      expect(screen.getByText('Sleep Token')).toBeInTheDocument()
    })

    // Click edit button
    const editButton = screen.getByLabelText(/Editar Sleep Token/i)
    fireEvent.click(editButton)

    // Should show edit modal
    expect(screen.getByText(/Editar Banda/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Sleep Token')).toBeInTheDocument()
  })

  it('should delete banda with confirmation', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)
    vi.mocked(apiService.deleteBand).mockResolvedValue(undefined)

    render(<BandasManagement />)

    await waitFor(() => {
      expect(screen.getByText('Sleep Token')).toBeInTheDocument()
    })

    // Click delete button
    const deleteButton = screen.getByLabelText(/Excluir Sleep Token/i)
    fireEvent.click(deleteButton)

    // Should show confirmation modal
    expect(screen.getByText(/Confirmar Exclusão/i)).toBeInTheDocument()
    expect(screen.getByText(/Tem certeza que deseja excluir a banda Sleep Token?/i)).toBeInTheDocument()

    // Confirm deletion
    const confirmButton = screen.getByText(/Excluir/i)
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(apiService.deleteBand).toHaveBeenCalledWith(1)
    })
  })

  it('should filter bandas by search term', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasManagement />)

    await waitFor(() => {
      expect(screen.getByText('Sleep Token')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Buscar bandas/i)
    fireEvent.change(searchInput, { target: { value: 'Sleep' } })

    // Should filter to show only Sleep Token
    expect(screen.getByText('Sleep Token')).toBeInTheDocument()
  })

  it('should filter bandas by featured status', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasManagement />)

    await waitFor(() => {
      expect(screen.getByText('Sleep Token')).toBeInTheDocument()
    })

    const featuredFilter = screen.getByLabelText(/Filtrar por destaque/i)
    fireEvent.change(featuredFilter, { target: { value: 'featured' } })

    // Should show only featured bandas
    expect(screen.getByText('Sleep Token')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockRejectedValue(new Error('API Error'))

    render(<BandasManagement />)

    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar bandas/i)).toBeInTheDocument()
    })
  })

  it('should show loading state', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<BandasManagement />)

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument()
  })
})
