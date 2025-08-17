# Sistema de Imagens e Thumbnails

## Visão Geral

O sistema de imagens padronizado garante consistência visual em todos os cards do projeto, aplicando overlays, filtros e fallbacks SVG para manter a identidade metalcore.

## Componente StandardizedImage

### Props

- `src`: URL da imagem
- `alt`: Texto alternativo para acessibilidade
- `fallbackText`: Texto exibido no fallback SVG
- `variant`: Tamanho do thumbnail ('small', 'feature', 'compact', 'standard')
- `filter`: Filtro aplicado à imagem ('subtle', 'moderate', 'heavy', 'none')
- `showOverlay`: Exibe overlay para consistência de paleta
- `showVignette`: Exibe vinheta crimson sutil
- `className`: Classes CSS adicionais
- `onLoad`: Callback quando imagem carrega
- `onError`: Callback quando imagem falha

### Variantes de Thumbnail

#### `thumbnail-small` (4:3)
- Proporção: 4:3
- Uso: Cards pequenos em grid
- Aplicação: Bandas em lista, filmes em grid

#### `thumbnail-feature` (16:9)
- Proporção: 16:9
- Uso: Cards hero/feature
- Aplicação: Bandas em destaque, filmes principais

#### `thumbnail-compact` (4:3)
- Proporção: 4:3
- Dimensões: 80x60px
- Uso: Programas de rádio, horários
- Aplicação: ScheduleManagement

#### `thumbnail-standard`
- Proporção: 1:1 (quadrado)
- Uso: Cards padrão
- Aplicação: Uso geral

### Filtros de Imagem

#### `image-filter-subtle`
- Grayscale: 15%
- Contrast: 1.05
- Uso: Imagens com cores suaves

#### `image-filter-moderate`
- Grayscale: 25%
- Contrast: 1.1
- Brightness: 0.95
- Uso: Imagens coloridas (padrão)

#### `image-filter-heavy`
- Grayscale: 40%
- Contrast: 1.15
- Brightness: 0.9
- Uso: Imagens muito coloridas

### Overlays e Vinhetas

#### `image-overlay`
- Gradiente linear: preto transparente para preto 55%
- Propósito: Consistência de paleta
- Z-index: 1

#### `image-vignette`
- Gradiente radial: transparente para crimson 6%
- Propósito: Vinheta sutil metalcore
- Z-index: 2

## Estados da Imagem

### Loading
- Spinner animado com cor accent-crimson
- Duração: 2s com easing cubic-bezier
- Opacidade: 0.6 → 0.3 → 0.6

### Error
- Fallback SVG com wordmark Orbitron
- Fundo gradient-metal-surface-2
- Texto personalizado via fallbackText

### Loaded
- Animação fade-in: 500ms ease-out
- Escala: 0.95 → 1.0
- Opacidade: 0 → 1

## Fallback SVG

### Estrutura
- Ícone de checkmark em círculo
- Wordmark "Orbitron" para tipografia
- Cores metal-text-2 para contraste

### Estilo
- Font-family: Orbitron
- Text-transform: uppercase
- Letter-spacing: 0.1em
- Tamanho: 48x48px para ícone

## Acessibilidade

### Alt Attributes
- Sempre presentes e descritivos
- Formato: "Imagem da banda [Nome]"
- Contexto específico para cada uso

### Focus States
- Outline: 2px solid accent-crimson
- Offset: 2px
- Visível apenas com navegação por teclado

### Loading States
- Indicadores visuais claros
- Não bloqueiam interação
- Feedback imediato para usuário

## Grid de Imagens

### `image-grid-uniform`
- Aspect ratio: 4:3 para todos os cards
- Consistência visual perfeita
- Uso: MosaicGallery, BandasDaCena

### `image-grid-feature`
- Aspect ratio: 16:9 para cards hero
- Destaque para conteúdo principal
- Uso: Filmaço, ProgramGrid principal

### `image-grid-compact`
- Aspect ratio: 4:3 em tamanho reduzido
- Layout horizontal para listas
- Uso: ScheduleManagement, UsersManagement

## Otimizações

### Image Rendering
- `-webkit-optimize-contrast`
- `crisp-edges`
- Melhora qualidade em displays de alta densidade

### Lazy Loading
- Suporte para carregamento sob demanda
- Transição suave: opacity 0 → 1
- Duração: 300ms ease

### Responsive Scaling
- Hover: scale(1.05)
- Transição: 300ms ease
- Mantém proporções originais

## Uso nos Componentes

### MosaicGallery
```tsx
<StandardizedImage
  src={banda.image_url}
  alt={`Imagem da banda ${banda.name}`}
  fallbackText={banda.name}
  variant={isLargeCard ? 'feature' : 'small'}
  filter="moderate"
  showOverlay={true}
  showVignette={true}
/>
```

### ProgramGrid
```tsx
<StandardizedImage
  src={program.image_url}
  alt={`Imagem do programa ${program.title}`}
  fallbackText={program.title}
  variant="compact"
  filter="subtle"
  showOverlay={false}
  showVignette={true}
/>
```

### Filmaço
```tsx
<StandardizedImage
  src={filme.poster_url}
  alt={`Poster do filme ${filme.title}`}
  fallbackText={filme.title}
  variant="feature"
  filter="heavy"
  showOverlay={true}
  showVignette={true}
/>
```

## Manutenção

### Adicionar Novas Variantes
1. Definir proporções no CSS
2. Adicionar ao componente StandardizedImage
3. Documentar uso e aplicação

### Ajustar Filtros
1. Modificar valores no CSS
2. Testar em diferentes tipos de imagem
3. Manter consistência com paleta metalcore

### Atualizar Fallbacks
1. Modificar SVG no componente
2. Ajustar estilos CSS
3. Testar em diferentes tamanhos

## Benefícios

1. **Consistência Visual**: Todas as imagens seguem o mesmo padrão
2. **Identidade de Marca**: Paleta metalcore aplicada uniformemente
3. **Acessibilidade**: Alt attributes e estados de foco padronizados
4. **Performance**: Lazy loading e otimizações de renderização
5. **Manutenibilidade**: Sistema centralizado e documentado
6. **UX**: Estados de loading e error consistentes
7. **Responsividade**: Adaptação automática a diferentes telas
