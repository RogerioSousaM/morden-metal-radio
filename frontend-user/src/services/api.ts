const API_BASE_URL = '/api'

interface Banner {
  id: number
  title: string
  description?: string
  image_url: string
  target_url?: string
  location?: string
  priority: number
  active: boolean
  start_at?: string
  end_at?: string
  created_at: string
  updated_at: string
}

interface CarouselSlide {
  id: number
  title: string
  description: string
  imageUrl: string
  videoUrl?: string
  order: number
  isActive: boolean
  type: 'image' | 'video'
  createdAt: string
}

interface SocialLinks {
  instagram: string
  youtube: string
  twitter: string
  tiktok: string
}

interface Filme {
  id: number
  titulo: string
  descricao: string
  ano: number
  nota: number
  imagem: string | null
  indicacao_do_mes: boolean
  created_at: string
  updated_at: string
}

interface Destaque {
  id: number
  titulo: string
  descricao: string
  imagem: string
  link: string | null
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

interface ApiResponse<T> {
  data: T
  message?: string
}

interface Band {
  id: number
  name: string
  slug: string
  description: string
  official_url: string
  image_url: string
  genre_tags: string
  featured: boolean
  created_at: string
  updated_at: string
}

interface Program {
  id: number
  title: string
  startTime: string
  endTime: string
  host: string
  genre: string
  description: string
  isLive: boolean
  listeners: string
}

interface ProgramRequest {
  programId: number
  songName?: string
  artistName?: string
  message?: string
  contactEmail?: string
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // ===== MÉTODOS EXISTENTES =====

  // Buscar banners por localização
  async getBanners(location: string, limit: number = 1): Promise<Banner[]> {
    try {
      const response = await this.request<ApiResponse<Banner[]>>(
        `/banners?location=${encodeURIComponent(location)}&limit=${limit}`
      )
      return response.data || []
    } catch (error) {
      console.error('Erro ao buscar banners:', error)
      return []
    }
  }

  // Buscar banners ativos para uma localização específica
  async getActiveBanners(location: string): Promise<Banner[]> {
    try {
      const response = await this.request<ApiResponse<Banner[]>>(
        `/banners?location=${encodeURIComponent(location)}&active=1&limit=5`
      )
      return response.data || []
    } catch (error) {
      console.error('Erro ao buscar banners ativos:', error)
      return []
    }
  }

  // Buscar banner principal para uma localização (maior prioridade)
  async getMainBanner(location: string): Promise<Banner | null> {
    try {
      const banners = await this.getBanners(location, 1)
      return banners.length > 0 ? banners[0] : null
    } catch (error) {
      console.error('Erro ao buscar banner principal:', error)
      return null
    }
  }

  // Buscar slides do carrossel ativos
  async getActiveCarouselSlides(): Promise<CarouselSlide[]> {
    try {
      const response = await this.request<CarouselSlide[]>('/carousel/active')
      return response || []
    } catch (error) {
      console.error('Erro ao buscar slides do carrossel:', error)
      return []
    }
  }

  // Buscar links sociais
  async getSocialLinks(): Promise<SocialLinks> {
    try {
      const response = await this.request<SocialLinks>('/social-links')
      return response
    } catch (error) {
      console.error('Erro ao buscar links sociais:', error)
      return {
        instagram: '',
        youtube: '',
        twitter: '',
        tiktok: ''
      }
    }
  }

  // Buscar filmes
  async getFilmes(): Promise<Filme[]> {
    try {
      const response = await this.request<{ filmes: Filme[] }>('/filmes')
      return response.filmes || []
    } catch (error) {
      console.error('Erro ao buscar filmes:', error)
      return []
    }
  }

  // Buscar filme em destaque
  async getFilmeDestaque(): Promise<Filme | null> {
    try {
      const response = await this.request<{ filme: Filme }>('/filmes/destaque')
      return response.filme || null
    } catch (error) {
      console.error('Erro ao buscar filme em destaque:', error)
      return null
    }
  }

  // Buscar bandas da cena (para o MosaicGallery)
  async getDestaques(): Promise<Band[]> {
    try {
      const response = await this.request<{ data: Band[] }>('/bandas')
      return response?.data || []
    } catch (error) {
      console.error('Erro ao buscar bandas:', error)
      return []
    }
  }

  // Buscar bandas em destaque (para o MosaicGallery)
  async getDestaquesPublicos(): Promise<Band[]> {
    try {
      const response = await this.request<{ data: Band[] }>('/bandas?featured=1')
      return response?.data || []
    } catch (error) {
      console.error('Erro ao buscar bandas em destaque:', error)
      return []
    }
  }

  // Buscar notícias públicas
  async getNoticiasPublicas(): Promise<any[]> {
    try {
      const response = await this.request<any[]>('/news/public')
      return response || []
    } catch (error) {
      console.error('Erro ao buscar notícias públicas:', error)
      return []
    }
  }

  // Buscar programas públicos
  async getProgramasPublicos(): Promise<Program[]> {
    try {
      const response = await this.request<Program[]>('/programs/public')
      return response || []
    } catch (error) {
      console.error('Erro ao buscar programas públicos:', error)
      return []
    }
  }

  // Buscar informações do stream
  async getStreamInfo(): Promise<any> {
    try {
      const response = await this.request<any>('/stream/info')
      return response
    } catch (error) {
      console.error('Erro ao buscar informações do stream:', error)
      return {
        status: 'offline',
        currentSong: 'N/A',
        listeners: 0,
        bitrate: 'N/A',
        server: 'Morden Metal Radio',
        genre: 'Metal/Alternative'
      }
    }
  }

  // Buscar estatísticas públicas
  async getStatsPublicas(): Promise<any> {
    try {
      const response = await this.request<any>('/stats')
      return response
    } catch (error) {
      console.error('Erro ao buscar estatísticas públicas:', error)
      return {
        listeners: 0,
        nextProgram: 'N/A',
        systemAlerts: 0,
        totalPrograms: 0
      }
    }
  }

  // Buscar bandas
  async getBands(): Promise<Band[]> {
    try {
      const response = await this.request<Band[]>('/bandas')
      return response || []
    } catch (error) {
      console.error('Erro ao buscar bandas:', error)
      return []
    }
  }

  // Buscar bandas em destaque
  async getFeaturedBands(): Promise<Band[]> {
    try {
      const response = await this.request<Band[]>('/bandas?featured=1')
      return response || []
    } catch (error) {
      console.error('Erro ao buscar bandas em destaque:', error)
      return []
    }
  }

  // ===== NOVOS MÉTODOS PARA AÇÕES DOS BOTÕES =====

  // Registrar clique em banner
  async registerBannerClick(bannerId: number): Promise<boolean> {
    try {
      await this.request(`/banners/${bannerId}/click`, {
        method: 'POST'
      })
      return true
    } catch (error) {
      console.error('Erro ao registrar clique no banner:', error)
      return false
    }
  }

  // Favoritar/desfavoritar filme
  async toggleFilmeFavorite(filmeId: number): Promise<boolean> {
    try {
      const response = await this.request<{ isFavorite: boolean }>(`/filmes/${filmeId}/favorite`, {
        method: 'POST'
      })
      return response.isFavorite
    } catch (error) {
      console.error('Erro ao favoritar filme:', error)
      throw error
    }
  }

  // Solicitar música para programa
  async requestProgramSong(request: ProgramRequest): Promise<boolean> {
    try {
      await this.request('/programs/request', {
        method: 'POST',
        body: JSON.stringify(request)
      })
      return true
    } catch (error) {
      console.error('Erro ao solicitar música:', error)
      throw error
    }
  }

  // Buscar detalhes de um filme específico
  async getFilmeDetails(filmeId: number): Promise<Filme | null> {
    try {
      const response = await this.request<Filme>(`/filmes/${filmeId}`)
      return response
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error)
      return null
    }
  }

  // Buscar detalhes de uma banda específica
  async getBandDetails(bandId: number): Promise<Band | null> {
    try {
      const response = await this.request<Band>(`/bandas/${bandId}`)
      return response
    } catch (error) {
      console.error('Erro ao buscar detalhes da banda:', error)
      return null
    }
  }

  // Buscar detalhes de um programa específico
  async getProgramDetails(programId: number): Promise<Program | null> {
    try {
      const response = await this.request<Program>(`/programs/${programId}`)
      return response
    } catch (error) {
      console.error('Erro ao buscar detalhes do programa:', error)
      return null
    }
  }

  // Reproduzir música da banda
  async playBandMusic(bandId: number): Promise<boolean> {
    try {
      await this.request(`/bands/${bandId}/play`, {
        method: 'POST'
      })
      return true
    } catch (error) {
      console.error('Erro ao reproduzir música da banda:', error)
      return false
    }
  }

  // Reproduzir programa
  async playProgram(programId: number): Promise<boolean> {
    try {
      await this.request(`/programs/${programId}/play`, {
        method: 'POST'
      })
      return true
    } catch (error) {
      console.error('Erro ao reproduzir programa:', error)
      return false
    }
  }
}

export const apiService = new ApiService()
export type { 
  Banner, 
  CarouselSlide, 
  SocialLinks, 
  Filme, 
  Destaque, 
  ApiResponse,
  Band,
  Program,
  ProgramRequest
}
