# MosaicGallery Component - Destaques da Cena

## Descrição
O componente `MosaicGallery` agora exibe os **Destaques da Cena** integrado com a aba Filmaço do painel Admin. Ele consome dados da API `/api/filmes/public` e exibe filmes em um layout de cards responsivo.

## Localização
- **Componente**: `src/components/MosaicGallery.tsx`
- **Dados**: `src/data/featuredGallery.ts`
- **Integração**: `src/App.tsx` (página principal)
- **API**: `/api/destaques/all`

## Funcionalidades
- **Integração com API**: Consome dados de `/api/filmes/public`
- **Fallback local**: Usa dados locais se API não estiver disponível
- **Layout responsivo**: Grid adaptativo (1 coluna mobile, 2 tablet, 4 desktop)
- **Cards de filme**: Exibe título, ano, nota, descrição e imagem
- **Badge de destaque**: Para filmes marcados como `indicacao_do_mes`
- **Animações**: Framer Motion com entrada progressiva
- **Loading state**: Spinner durante carregamento
- **Placeholder**: Mensagem quando não há filmes disponíveis

## Schema de Dados
```typescript
interface MovieItem {
  id: number
  titulo: string          // Título do filme (obrigatório)
  descricao: string       // Descrição/sinopse (obrigatório)
  ano: number            // Ano de lançamento (obrigatório)
  nota: number           // Avaliação (obrigatório)
  imagem: string | null  // URL da imagem (opcional)
  indicacao_do_mes: boolean // Se é destaque (obrigatório)
  created_at: string     // Data de criação
  updated_at: string     // Data de atualização
}
```

## Fluxo de Dados

### 1. **Prioridade da API**
```typescript
// O componente sempre tenta buscar da API primeiro
const apiMovies = await fetchFeaturedMovies()
```

### 2. **Fallback Local**
```typescript
// Se API falhar, usa dados locais vazios
return featuredMovies // Array vazio por enquanto
```

### 3. **Props Opcionais**
```typescript
// Pode receber filmes via props (útil para testes)
<MosaicGallery movies={arrayDeFilmes} />
```

## Integração com Admin

### **Painel Admin (Aba Filmaço)**
- **CRUD completo**: Criar, editar, excluir filmes
- **Validação**: Campos obrigatórios (título, descrição, ano, nota)
- **Imagens**: Upload e gerenciamento de thumbnails
- **Destaques**: Marcar filmes como `indicacao_do_mes`

### **API Endpoint**
- **GET** `/api/destaques` - Lista apenas filmes destacados
- **GET** `/api/destaques/all` - Lista todos os filmes para o frontend (ordenados por destaque)
- **POST** `/api/filmes` - Criar novo filme (Admin - via aba Filmaço)
- **PUT** `/api/filmes/:id` - Atualizar filme (Admin - via aba Filmaço)
- **DELETE** `/api/filmes/:id` - Excluir filme (Admin - via aba Filmaço)

## Estados do Componente

### **Loading**
```tsx
if (loading) {
  return <LoadingSpinner />
}
```

### **Vazio**
```tsx
if (!loading && movies.length === 0) {
  return <Placeholder />
}
```

### **Com Dados**
```tsx
return <GridDeFilmes movies={movies} />
```

## Estilização
- **Cores**: Usa as cores do tema metal (`metal-orange`, `metal-text-secondary`, `metal-black`)
- **Grid**: Responsivo com breakpoints (1 → 2 → 4 colunas)
- **Cards**: Hover effects, scale, ring de destaque
- **Animações**: Transições suaves e efeitos hover
- **Consistência**: Mesmo estilo visual da seção Filmaço

## Acessibilidade
- Atributos `alt` para imagens
- `aria-label` para botões
- Navegação por teclado
- Contraste adequado
- Loading states informativos

## Dependências
- React 18+
- TypeScript
- Framer Motion
- Tailwind CSS
- Lucide React (ícones)

## Como Testar

### **1. Sem API (Estado Atual)**
- Componente exibe placeholder "Nenhum Destaque Disponível"
- Mensagem: "Será populado pelo painel de administração via aba Filmaço"

### **2. Com API Funcionando**
- Componente busca dados de `/api/destaques/all`
- Exibe grid de filmes com informações completas
- Badge "Destaque" para filmes marcados

### **3. Com Props**
```tsx
const filmesTeste = [
  {
    id: 1,
    titulo: "Filme de Teste",
    descricao: "Descrição de teste",
    ano: 2024,
    nota: 4.5,
    imagem: "url-da-imagem",
    indicacao_do_mes: true
  }
]

<MosaicGallery movies={filmesTeste} />
```

## Próximos Passos

1. **Implementar endpoint** `/api/filmes/public` no backend
2. **Configurar CRUD** na aba Filmaço do painel Admin
3. **Testar integração** completa entre Admin e Frontend
4. **Validar campos** obrigatórios no Admin
5. **Implementar ordenação** por campo `order`
