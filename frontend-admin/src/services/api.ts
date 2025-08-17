const API_BASE_URL = '/api'

interface LoginCredentials {
  username: string
  password: string
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

interface Banner {
  id: number
  title: string
  image_url: string
  target_url?: string
  start_at: string
  end_at: string
  priority: number
  locations: string
  active: boolean
  impressions: number
  clicks: number
  created_at: string
  updated_at: string
}



interface SocialLinks {
  instagram: string
  youtube: string
  twitter: string
  tiktok: string
}

interface Destaque {
  id: number
  titulo: string
  descricao: string
  imagem: string | null
  link: string | null
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
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
      const response = await fetch(`${API_BASE_URL}/bandas`, {
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
      const response = await fetch(`${API_BASE_URL}/bandas`, {
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
      const response = await fetch(`${API_BASE_URL}/bandas/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/bandas/${id}`, {
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

  // Schedule/Agenda
  async getSchedule(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar agenda')
      }

      const data = await response.json()
      // Garantir que sempre retorne um array
      return Array.isArray(data) ? data : (data.schedules || data.schedule || [])
    } catch (error) {
      console.error('Erro ao buscar agenda:', error)
      throw error
    }
  }

  async createSchedule(schedule: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(schedule)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar evento na agenda')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar evento na agenda:', error)
      throw error
    }
  }

  async updateSchedule(id: number, schedule: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(schedule)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar evento na agenda')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar evento na agenda:', error)
      throw error
    }
  }

  async deleteSchedule(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir evento da agenda')
      }
    } catch (error) {
      console.error('Erro ao excluir evento da agenda:', error)
      throw error
    }
  }

  async toggleScheduleStatus(id: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/${id}/toggle`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao alternar status do evento')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao alternar status do evento:', error)
      throw error
    }
  }

  async getScheduleStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/stats`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas da agenda')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar estatísticas da agenda:', error)
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
  async getTopMonthConfig(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/top-month`, {
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

  async updateTopMonthConfig(config: any): Promise<any> {
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
  async getTopMonthBands(): Promise<any[]> {
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

  async createTopMonthBand(band: any): Promise<any> {
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

  async updateTopMonthBand(id: number, band: any): Promise<any> {
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

  // Métodos para Banners
  async getBanners(): Promise<Banner[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/banners`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar banners')
      }

      const data = await response.json()
      return data.banners || []
    } catch (error) {
      console.error('Erro ao buscar banners:', error)
      throw error
    }
  }

  async createBanner(banner: Omit<Banner, 'id' | 'created_at' | 'updated_at' | 'impressions' | 'clicks'>): Promise<Banner> {
    try {
      const response = await fetch(`${API_BASE_URL}/banners`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(banner)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar banner')
      }

      const data = await response.json()
      return data.banner
    } catch (error) {
      console.error('Erro ao criar banner:', error)
      throw error
    }
  }

  async updateBanner(id: number, banner: Partial<Banner>): Promise<Banner> {
    try {
      const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(banner)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar banner')
      }

      const data = await response.json()
      return data.banner
    } catch (error) {
      console.error('Erro ao atualizar banner:', error)
      throw error
    }
  }

  async deleteBanner(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir banner')
      }
    } catch (error) {
      console.error('Erro ao excluir banner:', error)
      throw error
    }
  }

  // Métodos para Destaques
  async getDestaques(): Promise<Destaque[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/destaques/admin`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar destaques')
      }

      const data = await response.json()
      return data.destaques || []
    } catch (error) {
      console.error('Erro ao buscar destaques:', error)
      throw error
    }
  }

  async createDestaque(destaque: Omit<Destaque, 'id' | 'created_at' | 'updated_at'>): Promise<Destaque> {
    try {
      const response = await fetch(`${API_BASE_URL}/destaques`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(destaque)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar destaque')
      }

      const data = await response.json()
      return data.destaque
    } catch (error) {
      console.error('Erro ao criar destaque:', error)
      throw error
    }
  }

  async updateDestaque(id: number, destaque: Partial<Destaque>): Promise<Destaque> {
    try {
      const response = await fetch(`${API_BASE_URL}/destaques/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(destaque)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar destaque')
      }

      const data = await response.json()
      return data.destaque
    } catch (error) {
      console.error('Erro ao atualizar destaque:', error)
      throw error
    }
  }

  async deleteDestaque(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/destaques/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir destaque')
      }
    } catch (error) {
      console.error('Erro ao excluir destaque:', error)
      throw error
    }
  }
}

export const apiService = new ApiService()
export type { Band, Program, Stats, LoginCredentials, News, User, CarouselSlide, SocialLinks, Filme, Banner, Destaque } 