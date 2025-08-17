# 🎨 Sistema de Tipografia - Morden Metal

## 📋 Visão Geral

Este documento descreve o sistema de tipografia padronizado implementado nos frontends Admin e User da aplicação Morden Metal Radio.

## 🔤 Fontes Selecionadas

### **Display Font: Orbitron**
- **Propósito**: Títulos, headings e elementos de destaque
- **Características**: 
  - Futurista e tecnológica
  - Perfeita para o tema "dark metal modern + horror"
  - Excelente legibilidade em tamanhos grandes
  - Suporte a múltiplos pesos (400, 700, 900)

### **Body Font: Inter**
- **Propósito**: Texto corrido, parágrafos e interface
- **Características**:
  - Altamente legível
  - Otimizada para interfaces digitais
  - Suporte a múltiplos pesos (300, 400, 500, 600, 700)
  - Excelente para leitura em telas

## 🎯 Classes CSS Disponíveis

### **Heading Classes**
```css
.heading-display    /* Título principal - 72px */
.heading-hero       /* Título hero - 60px */
.heading-1          /* Heading 1 - 48px */
.heading-2          /* Heading 2 - 36px */
.heading-3          /* Heading 3 - 30px */
.heading-4          /* Heading 4 - 24px */
.heading-5          /* Heading 5 - 20px */
.heading-6          /* Heading 6 - 18px */
```

### **Body Text Classes**
```css
.text-body-large    /* Texto grande - 18px */
.text-body          /* Texto padrão - 16px */
.text-body-small    /* Texto pequeno - 14px */
.text-caption       /* Legenda - 12px */
```

### **Special Classes**
```css
.text-metal         /* Estilo metal para títulos */
.text-accent        /* Estilo de destaque */
.font-display        /* Aplica fonte display */
.font-body          /* Aplica fonte body */
```

## 🎨 CSS Custom Properties

### **Font Families**
```css
--font-display: 'Orbitron', 'Courier New', monospace;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### **Font Sizes**
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
--text-7xl: 4.5rem;      /* 72px */
```

### **Font Weights**
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;
```

### **Letter Spacing**
```css
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

## 🚀 Como Usar

### **1. Importar o Design System**
```css
@import './styles/design-system.css';
```

### **2. Aplicar Classes**
```jsx
// Título principal
<h1 className="heading-hero text-metal-text">
  Morden Metal
</h1>

// Texto corrido
<p className="text-body text-metal-text-secondary">
  Descrição da rádio
</p>

// Título de seção
<h2 className="heading-3 text-metal-text">
  Programação
</h2>
```

### **3. Tailwind CSS**
```jsx
// Usando classes Tailwind customizadas
<h1 className="text-7xl font-display tracking-widest text-metal-text">
  Título
</h1>

<p className="text-lg font-body text-metal-text-secondary">
  Parágrafo
</p>
```

## 📱 Responsividade

O sistema inclui breakpoints responsivos que ajustam automaticamente os tamanhos de fonte em dispositivos móveis:

```css
@media (max-width: 768px) {
  .heading-display { font-size: var(--text-5xl); }
  .heading-hero { font-size: var(--text-4xl); }
  .heading-1 { font-size: var(--text-3xl); }
  .heading-2 { font-size: var(--text-2xl); }
}
```

## 🔧 Configuração Tailwind

### **Font Families**
```js
fontFamily: {
  'metal': ['Orbitron', 'Courier New', 'monospace'],
  'display': ['Orbitron', 'Courier New', 'monospace'],
  'body': ['Inter', 'system-ui', 'sans-serif'],
  'sans': ['Inter', 'system-ui', 'sans-serif'],
}
```

### **Font Sizes**
```js
fontSize: {
  'xs': ['0.75rem', { lineHeight: '1.25' }],
  'sm': ['0.875rem', { lineHeight: '1.5' }],
  'base': ['1rem', { lineHeight: '1.5' }],
  'lg': ['1.125rem', { lineHeight: '1.75' }],
  'xl': ['1.25rem', { lineHeight: '1.25' }],
  '2xl': ['1.5rem', { lineHeight: '1.25' }],
  '3xl': ['1.875rem', { lineHeight: '1.25' }],
  '4xl': ['2.25rem', { lineHeight: '1.25' }],
  '5xl': ['3rem', { lineHeight: '1.25' }],
  '6xl': ['3.75rem', { lineHeight: '1' }],
  '7xl': ['4.5rem', { lineHeight: '1' }],
}
```

## 📁 Estrutura de Arquivos

```
frontend-admin/
├── src/
│   ├── styles/
│   │   └── design-system.css    # Sistema de tipografia
│   └── index.css                # Importa design-system.css
└── tailwind.config.js           # Configuração Tailwind

frontend-user/
├── src/
│   ├── styles/
│   │   └── design-system.css    # Sistema de tipografia
│   └── index.css                # Importa design-system.css
└── tailwind.config.js           # Configuração Tailwind
```

## ✅ Benefícios

1. **Consistência**: Tipografia uniforme em toda a aplicação
2. **Manutenibilidade**: Mudanças centralizadas em um arquivo
3. **Performance**: Fontes otimizadas e com fallbacks
4. **Acessibilidade**: Contraste e legibilidade otimizados
5. **Responsividade**: Adaptação automática para diferentes dispositivos
6. **Tema**: Fontes que refletem a identidade "dark metal modern + horror"

## 🎯 Exemplos de Uso

### **Hero Section**
```jsx
<section className="hero">
  <h1 className="heading-hero text-metal-text">
    Morden Metal
  </h1>
  <p className="text-body-large text-metal-text-secondary">
    Rádio online 24h • Metal moderno sem limites
  </p>
</section>
```

### **Card Component**
```jsx
<Card>
  <CardHeader>
    <CardTitle>Nome do Card</CardTitle>
    <CardSubtitle>Descrição do card</CardSubtitle>
  </CardHeader>
  <CardContent>
    <p className="text-body">Conteúdo do card</p>
  </CardContent>
</Card>
```

### **Navigation**
```jsx
<nav>
  <h2 className="heading-6 text-metal-text">Menu</h2>
  <ul className="text-body text-metal-text-secondary">
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</nav>
```

---

**Nota**: Este sistema de tipografia está implementado e funcionando em ambos os frontends (Admin e User) da aplicação Morden Metal Radio.
