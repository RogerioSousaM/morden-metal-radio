import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import BandasDaCena from '../components/BandasDaCena'

// Mock the API service
vi.mock('../services/api', () => ({
  apiService: {
    getBands: vi.fn()
  }
}))

describe('BandasDaCena Component', () => {
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
    },
    {
      id: 2,
      name: 'Lorna Shore',
      slug: 'lorna-shore',
      description: 'Deathcore técnico e brutal',
      official_url: 'https://lornashore.com',
      image_url: 'https://example.com/lorna-shore.jpg',
      genre_tags: '["deathcore", "technical"]',
      featured: false,
      created_at: '2024-01-02T00:00:00.000Z',
      updated_at: '2024-01-02T00:00:00.000Z'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the component with title', () => {
    render(<BandasDaCena />)
    
    expect(screen.getByText(/Bandas da Cena/i)).toBeInTheDocument()
  })

  it('should render loading state initially', () => {
    render(<BandasDaCena />)
    
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('should render bandas list when data is loaded', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasDaCena />)

    await waitFor(() => {
      expect(screen.getByText('Sleep Token')).toBeInTheDocument()
      expect(screen.getByText('Lorna Shore')).toBeInTheDocument()
    })
  })

  it('should display banda information correctly', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasDaCena />)

    await waitFor(() => {
      // Check banda names
      expect(screen.getByText('Sleep Token')).toBeInTheDocument()
      expect(screen.getByText('Lorna Shore')).toBeInTheDocument()

      // Check descriptions
      expect(screen.getByText(/Metal alternativo com elementos experimentais/)).toBeInTheDocument()
      expect(screen.getByText(/Deathcore técnico e brutal/)).toBeInTheDocument()

      // Check slugs
      expect(screen.getByText('sleep-token')).toBeInTheDocument()
      expect(screen.getByText('lorna-shore')).toBeInTheDocument()
    })
  })

  it('should display featured badge for featured bandas', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasDaCena />)

    await waitFor(() => {
      // Sleep Token should have featured badge
      expect(screen.getByText(/em destaque/i)).toBeInTheDocument()
    })
  })

  it('should handle empty bandas list', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue([])

    render(<BandasDaCena />)

    await waitFor(() => {
      expect(screen.getByText(/nenhuma banda encontrada/i)).toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockRejectedValue(new Error('API Error'))

    render(<BandasDaCena />)

    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar bandas/i)).toBeInTheDocument()
    })
  })

  it('should display genre tags when available', async () => {
    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(mockBandas)

    render(<BandasDaCena />)

    await waitFor(() => {
      expect(screen.getByText('metal alternativo')).toBeInTheDocument()
      expect(screen.getByText('experimental')).toBeInTheDocument()
      expect(screen.getByText('deathcore')).toBeInTheDocument()
      expect(screen.getByText('technical')).toBeInTheDocument()
    })
  })

  it('should handle bandas without images gracefully', async () => {
    const bandasWithoutImages = mockBandas.map(banda => ({
      ...banda,
      image_url: ''
    }))

    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(bandasWithoutImages)

    render(<BandasDaCena />)

    await waitFor(() => {
      // Should still render the bandas
      expect(screen.getByText('Sleep Token')).toBeInTheDocument()
      expect(screen.getByText('Lorna Shore')).toBeInTheDocument()
    })
  })

  it('should handle bandas without official URLs gracefully', async () => {
    const bandasWithoutUrls = mockBandas.map(banda => ({
      ...banda,
      official_url: ''
    }))

    const { apiService } = await import('../services/api')
    vi.mocked(apiService.getBands).mockResolvedValue(bandasWithoutUrls)

    render(<BandasDaCena />)

    await waitFor(() => {
      // Should still render the bandas
      expect(screen.getByText('Sleep Token')).toBeInTheDocument()
      expect(screen.getByText('Lorna Shore')).toBeInTheDocument()
    })
  })
})
