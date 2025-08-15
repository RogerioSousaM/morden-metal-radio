const API_BASE_URL = '/api'

interface LoginCredentials {
  username: string
  password: string
}

interface Band {
  id: number
  name: string
  genre: string
  description: string
  listeners: string
  rating: number
  isFeatured: boolean
  image: string
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

interface Stats {
  listeners: number
  topBand: string
  nextProgram: string
  systemAlerts: number
  totalBands: number
  totalPrograms: number
}

interface News {
  id: number
  title: string
  content: string
  image: string
  author: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  bandName?: string
  mediaUrls?: string
  newsSummary?: string
  sourceLink?: string
}

interface User {
  id: number
  username: string
  role: string
  createdAt: string
  updatedAt: string
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

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      console.warn('Token não encontrado no localStorage')
      return {
        'Content-Type': 'application/json'
      }
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }





  // Autenticação
  async login(credentials: LoginCredentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Credenciais inválidas')
      }

      const data = await response.json()
      localStorage.setItem('adminToken', data.token)
      // Salvar dados do usuário também
      if (data.user) {
        localStorage.setItem('adminUser', JSON.stringify(data.user))
      }
      return data
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  logout() {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
  }

  // Bandas
  async getBands(): Promise<Band[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/bands`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar bandas')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar bandas:', error)
      throw error
    }
  }

  async createBand(band: Omit<Band, 'id'>): Promise<Band> {
    try {
      const response = await fetch(`${API_BASE_URL}/bands`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(band)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar banda')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar banda:', error)
      throw error
    }
  }

  async updateBand(id: number, band: Partial<Band>): Promise<Band> {
    try {
      const response = await fetch(`${API_BASE_URL}/bands/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(band)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar banda')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar banda:', error)
      throw error
    }
  }

  async deleteBand(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/bands/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar banda')
      }
    } catch (error) {
      console.error('Erro ao deletar banda:', error)
      throw error
    }
  }

  // Programas
  async getPrograms(): Promise<Program[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/programs`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar programas')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar programas:', error)
      throw error
    }
  }

  async createProgram(program: Omit<Program, 'id'>): Promise<Program> {
    try {
      const response = await fetch(`${API_BASE_URL}/programs`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(program)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar programa')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar programa:', error)
      throw error
    }
  }

  // Estatísticas
  async getStats(): Promise<Stats> {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }
  }

  // Informações do stream
  async getStreamInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/stream/info`)
      if (!response.ok) {
        throw new Error('Erro ao buscar informações do stream')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar informações do stream:', error)
      throw error
    }
  }

  // Upload de arquivos
  async uploadFiles(
    mediaType: string, 
    formData: FormData, 
    onProgress?: (progress: number) => void
  ) {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        throw new Error('Token de autenticação não encontrado')
      }

      const xhr = new XMLHttpRequest()
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress(progress)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              resolve(response)
            } catch (error) {
              reject(new Error('Resposta inválida do servidor'))
            }
          } else {
            reject(new Error(`Erro ${xhr.status}: ${xhr.statusText}`))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Erro de rede'))
        })

        xhr.open('POST', `${API_BASE_URL}/files/upload/${mediaType}`)
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.send(formData)
      })
    } catch (error) {
      console.error('Erro no upload:', error)
      throw error
    }
  }

  // Listar arquivos
  async getFiles(mediaType: string = 'all', page: number = 1, limit: number = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/files/files/${mediaType}?page=${page}&limit=${limit}`,
        {
          headers: this.getAuthHeaders()
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao buscar arquivos')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error)
      throw error
    }
  }

  // Deletar arquivo
  async deleteFile(fileId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/files/files/${fileId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar arquivo')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      throw error
    }
  }

  // Estatísticas de arquivos
  async getFileStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/files/stats`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }
  }

  // Notícias
  async getNews(): Promise<News[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/news`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar notícias')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar notícias:', error)
      throw error
    }
  }

  async createNews(news: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<News> {
    try {
      const response = await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(news)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar notícia')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar notícia:', error)
      throw error
    }
  }

  async updateNews(id: number, news: Partial<News>): Promise<News> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(news)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar notícia')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar notícia:', error)
      throw error
    }
  }

  async deleteNews(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar notícia')
      }
    } catch (error) {
      console.error('Erro ao deletar notícia:', error)
      throw error
    }
  }

  // Usuários
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar usuários')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw error
    }
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(user)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar usuário')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      throw error
    }
  }

  async updateUser(id: number, user: Partial<User> & { password?: string }): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(user)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar usuário')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar usuário')
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      throw error
    }
  }

  // Carrossel
  async getCarouselSlides(): Promise<CarouselSlide[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/carousel`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar slides')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar slides:', error)
      throw error
    }
  }

  async createCarouselSlide(slide: Omit<CarouselSlide, 'id' | 'order' | 'createdAt'>): Promise<CarouselSlide> {
    try {
      const response = await fetch(`${API_BASE_URL}/carousel`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(slide)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar slide')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar slide:', error)
      throw error
    }
  }

  async updateCarouselSlide(id: number, slide: Partial<CarouselSlide>): Promise<CarouselSlide> {
    try {
      const response = await fetch(`${API_BASE_URL}/carousel/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(slide)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar slide')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar slide:', error)
      throw error
    }
  }

  async deleteCarouselSlide(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/carousel/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir slide')
      }
    } catch (error) {
      console.error('Erro ao excluir slide:', error)
      throw error
    }
  }

  async toggleCarouselSlideStatus(id: number): Promise<CarouselSlide> {
    try {
      const response = await fetch(`${API_BASE_URL}/carousel/${id}/toggle`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao alternar status do slide')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao alternar status do slide:', error)
      throw error
    }
  }

  async reorderCarouselSlides(slideIds: number[]): Promise<CarouselSlide[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/carousel/reorder`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ slideIds })
      })

      if (!response.ok) {
        throw new Error('Erro ao reordenar slides')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao reordenar slides:', error)
      throw error
    }
  }

  async getCarouselStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/carousel/stats`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }
  }

  // Top do Mês - Configuração
  /*
  async getTopMonthConfig(): Promise<TopMonthConfig> {
    try {
      const response = await fetch(`${API_BASE_URL}/top-month/config`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar configuração do Top do Mês')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar configuração do Top do Mês:', error)
      throw error
    }
  }

  async updateTopMonthConfig(config: Partial<TopMonthConfig>): Promise<TopMonthConfig> {
    try {
      const response = await fetch(`${API_BASE_URL}/top-month/config`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar configuração do Top do Mês')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar configuração do Top do Mês:', error)
      throw error
    }
  }

  // Top do Mês - Bandas
  async getTopMonthBands(): Promise<TopMonthBand[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/top-month/bands`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar bandas')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar bandas:', error)
      throw error
    }
  }

  async createTopMonthBand(band: Omit<TopMonthBand, 'id'>): Promise<TopMonthBand> {
    try {
      const response = await fetch(`${API_BASE_URL}/top-month/bands`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(band)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar banda')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar banda:', error)
      throw error
    }
  }

  async updateTopMonthBand(id: number, band: Partial<TopMonthBand>): Promise<TopMonthBand> {
    try {
      const response = await fetch(`${API_BASE_URL}/top-month/bands/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(band)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar banda')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar banda:', error)
      throw error
    }
  }

  async deleteTopMonthBand(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/top-month/bands/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir banda')
      }
    } catch (error) {
      console.error('Erro ao excluir banda:', error)
      throw error
    }
  }

  // Top do Mês - Estatísticas
  async getTopMonthStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/top-month/stats`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas do Top do Mês')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar estatísticas do Top do Mês:', error)
      throw error
    }
  }
  */

  // Links Sociais
  async getSocialLinks(): Promise<SocialLinks> {
    try {
      const response = await fetch(`${API_BASE_URL}/social-links/admin`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar links sociais')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar links sociais:', error)
      throw error
    }
  }

  async updateSocialLinks(socialLinks: SocialLinks): Promise<SocialLinks> {
    try {
      const response = await fetch(`${API_BASE_URL}/social-links`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(socialLinks)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar links sociais')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar links sociais:', error)
      throw error
    }
  }

  async resetSocialLinks(): Promise<SocialLinks> {
    try {
      const response = await fetch(`${API_BASE_URL}/social-links/reset`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao resetar links sociais')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao resetar links sociais:', error)
      throw error
    }
  }

  // Métodos para Filmes
  async getFilmes(): Promise<Filme[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/filmes`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar filmes')
      }

      const data = await response.json()
      return data.filmes || []
    } catch (error) {
      console.error('Erro ao buscar filmes:', error)
      throw error
    }
  }

  async createFilme(filme: Omit<Filme, 'id' | 'created_at' | 'updated_at'>): Promise<Filme> {
    try {
      const response = await fetch(`${API_BASE_URL}/filmes`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(filme)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar filme')
      }

      const data = await response.json()
      return data.filme
    } catch (error) {
      console.error('Erro ao criar filme:', error)
      throw error
    }
  }

  async updateFilme(id: number, filme: Partial<Filme>): Promise<Filme> {
    try {
      console.log('Enviando requisição PUT para:', `${API_BASE_URL}/filmes/${id}`)
      console.log('Dados sendo enviados:', filme)
      
      const response = await fetch(`${API_BASE_URL}/filmes/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(filme)
      })

      console.log('Status da resposta:', response.status)
      console.log('Headers da resposta:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Resposta de erro do servidor:', errorText)
        throw new Error(`Erro ao atualizar filme: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('Resposta de sucesso:', data)
      return data.filme || data
    } catch (error) {
      console.error('Erro ao atualizar filme:', error)
      throw error
    }
  }

  async deleteFilme(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/filmes/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir filme')
      }
    } catch (error) {
      console.error('Erro ao excluir filme:', error)
      throw error
    }
  }

  async getFilmeDestaque(): Promise<Filme | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/filmes/destaque`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error('Erro ao buscar filme em destaque')
      }

      const data = await response.json()
      return data.filme
    } catch (error) {
      console.error('Erro ao buscar filme em destaque:', error)
      throw error
    }
  }
}

export const apiService = new ApiService()
export type { Band, Program, Stats, LoginCredentials, News, User, CarouselSlide, SocialLinks, Filme } 