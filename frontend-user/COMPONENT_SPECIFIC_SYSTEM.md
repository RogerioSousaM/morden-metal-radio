# Sistema de Instruções Específicas por Componente

## Visão Geral

Este documento detalha as implementações específicas para cada componente conforme as instruções fornecidas, criando uma linguagem UX consistente em todo o projeto.

## Header.tsx

### Implementações Realizadas

#### 1. Backdrop Blur e Background Sticky
```tsx
<header className={`header ${isScrolled ? 'scrolled backdrop-blur-sm bg-black/40 border-b border-metal-light-gray/14' : ''}`}>
```
- **Backdrop blur**: `backdrop-blur-sm` para efeito de desfoque sutil
- **Background**: `bg-black/40` com 40% de opacidade
- **Border**: `border-metal-light-gray/14` com 14% de opacidade

#### 2. CTA Primário
```tsx
className="btn-primary touch-target"
```
- Substituído `header-cta` por `btn-primary`
- Mapeado para estilo accent-crimson
- Mantido `touch-target` para acessibilidade

#### 3. Logo com Orbitron e Alt Acessível
```tsx
<span className="font-display">METALCORE</span>
aria-label="Página inicial Metalcore"
```
- Fonte Orbitron aplicada via `font-display`
- `aria-label` descritivo para screen readers

## Hero.tsx

### Implementações Realizadas

#### 1. Escala de Heading Aumentada
```tsx
className="hero-headline text-display-hero"
```
- Aplicada classe `text-display-hero` para escala maior
- Mantida responsividade com clamp

#### 2. Subline com Cor Secundária
```tsx
className="hero-strapline text-metal-text-secondary"
```
- Cor aplicada via `text-metal-text-secondary`
- Mantém hierarquia visual clara

#### 3. Card Feature Grande à Direita
```tsx
className="card card-feature hero-feature"
```
- Layout `card-feature` com proporção 16:9
- Imagem com overlay e CTA primário
- Hover effects e transições suaves

## MosaicGallery.tsx

### Implementações Realizadas

#### 1. Cards Pequenos para Cada Banda
```tsx
className={`card ${isLargeCard ? 'card-feature' : 'card-small'} card-hover stagger-item`}
```
- `card-small` para bandas individuais
- `card-feature` para bandas em destaque
- `card-hover` para efeitos de hover

#### 2. Comportamento de Thumbnail
```css
.card-hover .card-media img {
  transition: transform 300ms ease;
}

.card-hover:hover .card-media img {
  transform: scale(1.05);
}
```
- Hover: `scale(1.05)` com transição suave
- `transition-transform` para performance

#### 3. Badges para Tags de Gênero
```tsx
<span className="genre-badge bg-metal-light-gray/14 rounded-full px-2 py-0.5 text-xs">
```
- Background: `bg-metal-light-gray/14` (14% opacidade)
- Formato: `rounded-full` com padding responsivo
- Tamanho: `text-xs` para legibilidade

#### 4. Ícone Play Overlay Centralizado
```tsx
<div className="play-icon-container">
  <svg className="play-icon">...</svg>
</div>
```
- Container circular de 64x64px
- Background `accent-crimson` com drop-shadow
- Centralizado no card

## Filmaço.tsx

### Implementações Realizadas

#### 1. Proporções de Imagem Padronizadas
```tsx
className="w-full h-48 object-cover rounded-t-lg"
```
- Altura fixa: `h-48` (192px)
- `object-fit: cover` para consistência
- Aspect ratio mantido em todos os cards

#### 2. Ícone Play Overlay
```tsx
<motion.button
  className="bg-black/70 hover:bg-metal-orange/80 text-white p-2 rounded-full"
  aria-label={`Assistir ${movie.titulo}`}
>
```
- Background semi-transparente
- Hover com cor accent
- `aria-label` descritivo

#### 3. Links Externos com Aria-Label
```tsx
aria-label={`Ver detalhes de ${movie.titulo}`}
```
- Labels específicos para cada filme
- Melhora acessibilidade para screen readers

## ProgramGrid.tsx

### Implementações Realizadas

#### 1. Layout Compact
```tsx
className={`card card-compact group ${program.isLive ? 'live' : ''}`}
```
- `card-compact` para layout horizontal
- Thumbnail pequeno (80x60px)
- Conteúdo alinhado à esquerda

#### 2. Metadados de Tempo Alinhados
```tsx
<div className="flex items-center gap-2 mb-2">
  <Clock className="w-4 h-4 text-metal-orange" />
  <span className="text-sm font-mono text-metal-orange">
    {program.startTime} - {program.endTime}
  </span>
</div>
```
- Ícone de relógio com cor accent
- Fonte monospace para horários
- Alinhamento à esquerda

#### 3. Título do Programa Prominente
```tsx
<h3 className="text-xl font-bold text-metal-text mb-2 group-hover:text-metal-orange transition-colors">
  {program.title}
</h3>
```
- Tamanho: `text-xl` para destaque
- Hover effect com cor accent
- Transição suave de cores

## Footer.tsx

### Implementações Realizadas

#### 1. Ícones Sociais em Monocromático
```tsx
<Icon className="w-5 h-5 footer-social-icon" />
```
- Cor padrão: `text-metal-text-secondary`
- Hover: `color: var(--accent-crimson)`
- Transição suave de 200ms

#### 2. Copyright Menor e Mais Escuro
```tsx
<p className="footer-copyright">
  © 2024 Morden Metal. Todos os direitos reservados.
</p>
```
- Classe `footer-copyright` aplicada
- Tamanho: `0.75rem`
- Opacidade: `0.7` para sutileza

## CSS Classes Implementadas

### Hero Feature Card
```css
.hero-feature {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 16/9;
  overflow: hidden;
  position: relative;
}
```

### Enhanced Play Icon
```css
.play-icon-container {
  width: 64px;
  height: 64px;
  background: var(--accent-crimson);
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(211, 47, 47, 0.4);
}
```

### Genre Badge
```css
.genre-badge {
  background: rgba(182, 182, 182, 0.14);
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
}
```

### Button Primary
```css
.btn-primary {
  background: var(--accent-crimson);
  border-radius: 9999px;
  box-shadow: var(--shadow-metal-md);
}
```

### Compact Card Layout
```css
.card-compact {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  align-items: center;
}
```

## Benefícios da Implementação

### 1. Consistência Visual
- Todos os componentes seguem o mesmo padrão de design
- Cores, espaçamentos e tipografia unificados
- Hover effects e transições consistentes

### 2. Acessibilidade Melhorada
- `aria-label` em todos os elementos interativos
- Touch targets adequados (44x44px mínimo)
- Skip links para navegação por teclado

### 3. Performance Otimizada
- Animações baseadas em `transform` e `opacity`
- CSS transitions para efeitos simples
- Framer Motion para animações complexas

### 4. UX Consistente
- Comportamento previsível em todos os componentes
- Feedback visual claro para interações
- Estados de loading e error padronizados

## Manutenção

### Adicionar Novos Componentes
1. Seguir o padrão de classes estabelecido
2. Implementar `aria-label` para acessibilidade
3. Usar as classes CSS existentes quando possível

### Modificar Estilos Existentes
1. Atualizar as variáveis CSS no `design-system.css`
2. Manter consistência com o sistema de cores
3. Testar em diferentes resoluções

### Ajustar Animações
1. Usar as classes de motion existentes
2. Manter duração e easing consistentes
3. Respeitar preferências de `prefers-reduced-motion`
