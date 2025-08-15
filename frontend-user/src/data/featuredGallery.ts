// Este arquivo será populado pelo painel de administração via API
// Contém os filmes/destaques que serão exibidos na seção "Destaques da cena"

export interface DestaqueItem {
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

// Array vazio por enquanto - será populado via API /api/destaques
export const featuredDestaques: DestaqueItem[] = []

// Função para buscar dados da API
export const fetchFeaturedDestaques = async (): Promise<DestaqueItem[]> => {
  try {
    // URL base da API (ajustar conforme ambiente)
    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'
    const response = await fetch(`${API_BASE}/api/destaques`)
    
    if (!response.ok) {
      console.warn('API /api/destaques não disponível, usando dados locais')
      return featuredDestaques
    }
    
    const data = await response.json()
    console.log('🎬 Dados recebidos da API de destaques da cena:', data)
    return data.destaques || data || []
  } catch (error) {
    console.warn('Erro ao buscar dados da API de destaques da cena, usando dados locais:', error)
    return featuredDestaques
  }
}
