# 🎸 Metalcore Aesthetic - Sistema de Design

## 🌟 **VISÃO GERAL**
Sistema de design que implementa a estética metalcore com gradientes diagonais sutis, texturas de grão, bordas metálicas e tratamento monocromático de imagens.

## 🎨 **PALETA DE CORES**

### **Cores Primárias**
- `--metal-bg-900`: #000000 (Preto profundo)
- `--metal-surface`: #0f0f10 (Superfície escura)
- `--metal-surface-2`: #151515 (Superfície secundária)

### **Cores de Texto**
- `--metal-text`: #FFFFFF (Texto principal)
- `--metal-text-2`: #b6b6b6 (Texto secundário)

### **Cores de Destaque**
- `--accent-crimson`: #d32f2f (Vermelho sangue - CTAs primários)
- `--accent-amber`: #ffb300 (Âmbar - Destaques secundários)

## 🌊 **GRADIENTES METÁLICOS**

### **Background Principal**
```css
.bg-metalcore {
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #000000 50%, #0a0a0a 75%, #000000 100%);
}
```

### **Superfícies**
```css
.bg-metal-surface-rim {
  background: linear-gradient(135deg, #0f0f10 0%, #151515 50%, #0f0f10 100%);
}
```

## 🔧 **TEXTURAS E EFEITOS**

### **Textura de Grão**
```css
.texture-grain::before {
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.06;
}
```

### **Bordas Metálicas**
```css
.bg-metal-surface-rim::before {
  background: linear-gradient(90deg, #2b2b2b 0%, #4b4b4b 25%, #6b6b6b 50%, #4b4b4b 75%, #2b2b2b 100%);
}
```

### **Brilho Interno**
```css
.bg-metal-surface-glow {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}
```

## 🖼️ **TRATAMENTO DE IMAGENS**

### **Filtro Monocromático**
```css
.filter-monochrome {
  filter: grayscale(100%) contrast(1.1) brightness(0.9);
}
```

### **Vinheta Crimson**
```css
.vignette-crimson::after {
  background: radial-gradient(ellipse at center, transparent 0%, rgba(211, 47, 47, 0.1) 70%, rgba(211, 47, 47, 0.2) 100%);
}
```

## 📱 **CLASSES UTILITÁRIAS**

### **Backgrounds**
- `.bg-metalcore` - Background principal com gradiente diagonal e grão
- `.bg-metal-surface-rim` - Superfície com borda metálica
- `.bg-metal-surface-glow` - Superfície com brilho interno

### **Texturas**
- `.texture-grain` - Adiciona textura de grão SVG
- `.texture-noise` - Textura de ruído CSS (fallback)

### **Imagens**
- `.filter-monochrome` - Aplica filtro monocromático
- `.vignette-crimson` - Adiciona vinheta crimson
- `.vignette-subtle` - Adiciona vinheta sutil

## 🎯 **REGRAS DE USO**

### **Accent Colors**
- **`accent-crimson`**: Apenas para CTAs primários (botões de ação, links importantes)
- **`accent-amber`**: Para badges, ícones pequenos e destaques secundários

### **Gradientes**
- **Background**: Use `bg-metalcore` para seções principais
- **Cards**: Use `bg-metal-surface-rim` para bordas metálicas
- **Superfícies**: Use `bg-metal-surface-glow` para brilho interno

### **Imagens**
- **Sempre** aplique `.filter-monochrome` para consistência
- **Opcionalmente** use `.vignette-crimson` para vinheta
- **Evite** cores saturadas - mantenha a estética monocromática

## 💡 **EXEMPLOS DE IMPLEMENTAÇÃO**

### **Card com Estética Metalcore**
```tsx
<div className="bg-metal-surface-rim shadow-metal-md rounded-metal-lg overflow-hidden">
  <div className="relative h-3/5 overflow-hidden" style={{ background: 'var(--gradient-metal-surface-2)' }}>
    <div className="vignette-crimson">
      <img className="filter-monochrome" src="..." alt="..." />
    </div>
  </div>
  <div className="bg-metal-surface-glow p-4">
    <h3 className="text-metal-text">Título</h3>
    <span className="bg-accent-amber text-metal-text">Badge</span>
  </div>
</div>
```

### **Seção com Background Metalcore**
```tsx
<section className="section-spacing bg-metalcore">
  <div className="container-max">
    <h2 className="text-display-section text-metal-text font-display">
      Título da Seção
    </h2>
  </div>
</section>
```

## 🚀 **PERFORMANCE**

### **SVG Inline**
- Textura de grão implementada como SVG inline
- Não requer requisições HTTP adicionais
- Fallback para CSS noise quando necessário

### **CSS Variables**
- Todas as cores e valores centralizados
- Fácil manutenção e consistência
- Suporte nativo em todos os navegadores modernos

## 🎨 **CUSTOMIZAÇÃO**

### **Ajustar Opacidade do Grão**
```css
:root {
  --grain-opacity: 0.08; /* Aumentar para mais textura */
}
```

### **Modificar Gradientes**
```css
:root {
  --gradient-metal-bg: linear-gradient(135deg, #000000 0%, #0f0f0f 50%, #000000 100%);
}
```

### **Ajustar Vinheta**
```css
:root {
  --vignette-crimson: radial-gradient(ellipse at center, transparent 0%, rgba(211, 47, 47, 0.15) 70%, rgba(211, 47, 47, 0.25) 100%);
}
```

---

**🎸 Resultado**: Estética metalcore profissional com texturas sutis, gradientes diagonais e tratamento monocromático de imagens, mantendo alta legibilidade e performance.
