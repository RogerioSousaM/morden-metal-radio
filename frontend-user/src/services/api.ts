const API_BASE_URL = '/api'

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
      const response = await this.request<Filme[]>('/filmes')
      return response || []
    } catch (error) {
      console.error('Erro ao buscar filmes:', error)
      return []
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
  SocialLinks, 
  Filme, 
  Band,
  Program,
  ProgramRequest
}
