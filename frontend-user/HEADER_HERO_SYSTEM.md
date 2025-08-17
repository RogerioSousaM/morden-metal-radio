# Sistema de Header e Hero

## Visão Geral

O sistema de header e hero implementa uma navegação minimalista com comportamento sticky e uma seção hero impactante usando tipografia Orbitron e animações Framer Motion.

## Header & Navegação

### Características Principais

- **Minimalista**: Logo à esquerda, navegação centralizada, CTA à direita
- **Sticky**: Comportamento de colagem ao topo com transições suaves
- **Responsivo**: Menu hamburger para mobile com slide-over
- **Acessível**: Navegação por teclado e ARIA labels

### Estrutura do Header

#### Desktop Layout
```
[Logo METALCORE] [Nav Items] [Listen Live] [Player Icon] [Menu Toggle]
```

#### Mobile Layout
```
[Logo METALCORE] [Listen Live] [Player Icon] [Menu Toggle]
```

### Componentes do Header

#### Logo
- **Fonte**: Orbitron (monospace)
- **Estilo**: Uppercase, letter-spacing 0.1em
- **Ícone**: Music (Lucide React)
- **Cor**: accent-crimson para o ícone

#### Navegação Desktop
- **Itens**: Bandas da Cena, Programas, Filmaço, Notícias
- **Estilo**: Hover effects, underline ativo
- **Posicionamento**: Centralizado entre logo e ações

#### Header Actions
- **Primary CTA**: "Listen Live" com accent-crimson
- **Mini Player**: Ícone circular com hover effects
- **Menu Toggle**: Apenas visível em mobile

### Comportamento Sticky

#### Estado Normal
- Background: `--metal-bg-900`
- Padding: `var(--space-3) var(--space-4)`
- Transição: 300ms ease

#### Estado Scrolled
- Background: `rgba(0, 0, 0, 0.95)` com backdrop-filter
- Padding: `var(--space-2) 0`
- Efeito: Blur de 10px

### Menu Mobile

#### Slide-over Menu
- **Posição**: Direita para esquerda
- **Largura**: 100% (max 400px)
- **Background**: `--metal-bg-900`
- **Transição**: 300ms ease

#### Estrutura Mobile
```
[Logo] [X Close]
[Bandas da Cena]
[Programas]
[Filmaço]
[Notícias]
[---]
[Listen Live - Full Width]
```

#### Interações Mobile
- **ESC**: Fecha o menu
- **Click fora**: Fecha o menu
- **Scroll**: Bloqueado quando aberto
- **Animações**: Framer Motion com AnimatePresence

## Hero Section

### Características Principais

- **Layout**: Grid 2 colunas (desktop) / 1 coluna (mobile)
- **Tipografia**: Orbitron para headline, Inter para body
- **Animações**: Partículas flutuantes, CTA pulsante
- **Responsivo**: Adaptação automática para diferentes telas

### Estrutura do Hero

#### Left Side - Conteúdo
```
METALCORE (Headline)
A cena mais pesada do Brasil (Strapline)
Descrição detalhada... (Subheading)
[Começar a Ouvir] (CTA Button)
```

#### Right Side - Live Player
```
[AO VIVO] (Live Indicator)
Metalcore Show (Title)
As melhores bandas... (Subtitle)
[Ouvir Agora] (Player CTA)
```

### Tipografia Hero

#### Headline
- **Fonte**: Orbitron, monospace
- **Tamanho**: `clamp(3rem, 8vw, 5rem)`
- **Peso**: 900 (black)
- **Estilo**: Uppercase, letter-spacing 0.05em
- **Cor**: `--metal-text`

#### Strapline
- **Fonte**: Inter, sans-serif
- **Tamanho**: `clamp(1.25rem, 3vw, 1.75rem)`
- **Peso**: 600 (semibold)
- **Cor**: `--metal-text`
- **Max-width**: 24ch

#### Subheading
- **Fonte**: Inter, sans-serif
- **Tamanho**: `clamp(1rem, 2vw, 1.125rem)`
- **Peso**: 400 (normal)
- **Cor**: `--metal-text-2`
- **Max-width**: 32ch

### Hero CTA

#### Estilo
- **Background**: `--accent-crimson`
- **Forma**: Pill (border-radius: 9999px)
- **Padding**: `1rem 2rem`
- **Sombra**: `--shadow-metal-lg`

#### Animações
- **Hover**: `translateY(-4px) scale(1.02)`
- **Pulse**: `scale([1, 1.02, 1])` infinito
- **Shine**: Overlay deslizante da esquerda para direita

#### Estados
- **Normal**: accent-crimson
- **Hover**: #b71c1c (mais escuro)
- **Focus**: Outline 3px com offset

### Live Player Card

#### Design
- **Background**: `--metal-surface`
- **Borda**: `--metal-edge`
- **Top Border**: accent-crimson (4px)
- **Sombra**: `--shadow-metal-lg`

#### Live Indicator
- **Background**: accent-crimson
- **Dot**: Animação pulse 2s infinito
- **Texto**: "AO VIVO" em branco

#### Player CTA
- **Background**: accent-crimson
- **Hover**: #b71c1c
- **Ícone**: Radio (Lucide React)

### Elementos Animados

#### Partículas Flutuantes
- **Quantidade**: 3 partículas
- **Tamanho**: 4x4px
- **Cor**: accent-crimson
- **Opacidade**: 0.3 → 0.6
- **Animação**: `particle-float` 6s infinito

#### Scroll Indicator
- **Posição**: Bottom center
- **Forma**: Retângulo arredondado com borda
- **Animação**: Movimento vertical suave
- **Cor**: `--metal-text-2`

### Responsividade

#### Desktop (>1024px)
- **Grid**: 2 colunas (1fr 1fr)
- **Gap**: `var(--space-12)`
- **Padding**: `var(--space-8) var(--space-4)`

#### Tablet (768px - 1024px)
- **Grid**: 1 coluna
- **Gap**: `var(--space-8)`
- **Text-align**: Center
- **Padding**: `var(--space-6) var(--space-3)`

#### Mobile (<768px)
- **Grid**: 1 coluna
- **Gap**: `var(--space-6)`
- **Min-height**: 70vh
- **Padding**: `var(--space-6) var(--space-3)`

## Animações Framer Motion

### Header Animations
```tsx
// Logo hover
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// CTA hover
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Mobile menu
initial={{ right: '-100%' }}
animate={{ right: 0 }}
exit={{ right: '-100%' }}
```

### Hero Animations
```tsx
// Headline
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, ease: "easeOut" }}

// CTA pulse
animate={{ scale: [1, 1.02, 1] }}
transition={{ 
  duration: 2, 
  repeat: Infinity, 
  repeatType: "reverse"
}}

// Live player
initial={{ opacity: 0, x: 50, scale: 0.9 }}
animate={{ opacity: 1, x: 0, scale: 1 }}
```

## CSS Classes Principais

### Header
- `.header`: Container principal
- `.header.scrolled`: Estado sticky
- `.header-logo`: Logo com ícone
- `.header-nav`: Navegação desktop
- `.header-cta`: Botão CTA primário
- `.header-player`: Ícone do player
- `.mobile-menu-toggle`: Toggle mobile
- `.mobile-menu`: Menu slide-over

### Hero
- `.hero`: Container principal
- `.hero-content`: Grid de conteúdo
- `.hero-left`: Lado esquerdo (texto)
- `.hero-right`: Lado direito (player)
- `.hero-headline`: Título principal
- `.hero-strapline`: Subtítulo
- `.hero-subheading`: Descrição
- `.hero-cta`: Botão de ação
- `.hero-live-player`: Card do player
- `.hero-particles`: Partículas animadas

## Acessibilidade

### Header
- **ARIA labels**: Para botões e navegação
- **Keyboard navigation**: Tab, Enter, Escape
- **Focus states**: Outline visível para navegação por teclado
- **Screen readers**: Estrutura semântica adequada

### Hero
- **Contraste**: Alto contraste (branco sobre preto)
- **Tamanhos**: Texto responsivo e legível
- **Animações**: Reduzidas para usuários com preferências
- **Semântica**: H1 para headline principal

## Performance

### Otimizações
- **Lazy loading**: Componentes carregados sob demanda
- **CSS transitions**: Para animações simples
- **Framer Motion**: Para animações complexas
- **Responsive images**: Otimizadas para diferentes telas

### Bundle Size
- **Tree shaking**: Apenas componentes necessários
- **Code splitting**: Rotas separadas
- **Optimized imports**: Lucide React icons

## Manutenção

### Adicionar Novos Itens de Menu
1. Adicionar ao array de navegação
2. Atualizar mobile menu
3. Adicionar rota correspondente

### Modificar Animações
1. Ajustar valores no Framer Motion
2. Testar em diferentes dispositivos
3. Manter consistência visual

### Ajustar Responsividade
1. Modificar breakpoints no CSS
2. Testar em diferentes resoluções
3. Manter UX consistente

## Benefícios

1. **UX/UX**: Navegação clara e intuitiva
2. **Performance**: Animações otimizadas
3. **Acessibilidade**: Navegação por teclado e screen readers
4. **Responsividade**: Adaptação automática para mobile
5. **Consistência**: Design system unificado
6. **Manutenibilidade**: Código modular e documentado
7. **Branding**: Identidade visual forte com Orbitron
