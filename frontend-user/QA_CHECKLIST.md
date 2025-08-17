# Checklist de QA & Critérios de Aceitação

## ✅ Checklist de Verificação

### 1. Responsividade e Breakpoints
- [ ] Header e hero se comportam corretamente em 320px (mobile)
- [ ] Header e hero se comportam corretamente em 768px (tablet)
- [ ] Header e hero se comportam corretamente em 1200px (desktop)
- [ ] Cards se reorganizam adequadamente em todos os breakpoints
- [ ] Navegação mobile funciona corretamente

### 2. Consistência Visual dos Cards
- [ ] Todos os cards usam o mesmo border-radius (12px desktop, 8px mobile)
- [ ] Sombras consistentes em todos os cards
- [ ] Aspect ratios de imagem consistentes:
  - [ ] Cards pequenos: 4:3
  - [ ] Cards feature: 16:9
  - [ ] Cards compact: 4:3
- [ ] Espaçamentos internos consistentes
- [ ] Tipografia hierárquica aplicada

### 3. Acessibilidade e Contraste
- [ ] Contraste de texto passa pelo menos AA (4.5:1 para body text)
- [ ] Contraste de texto passa pelo menos AA (3:1 para texto grande)
- [ ] Cores de accent têm contraste adequado
- [ ] Todos os botões têm estados de hover visíveis
- [ ] Todos os botões têm estados de focus visíveis
- [ ] Navegação por teclado funciona logicamente
- [ ] Tabindex não está quebrado
- [ ] ARIA labels estão presentes em elementos interativos

### 4. Performance e Layout
- [ ] Não há layout shift quando imagens carregam
- [ ] Todas as imagens têm width/height ou aspect-ratio definidos
- [ ] Lazy loading implementado para imagens não críticas
- [ ] Hero image tem loading="eager" e fetchpriority="high"
- [ ] Animações são fluidas e não distraem
- [ ] Animações respeitam prefers-reduced-motion

### 5. Micro Copy e UX
- [ ] CTAs são explícitos: "Listen Live Now", "Play Music", "View Details"
- [ ] Labels são consistentes e curtos (2-3 palavras)
- [ ] Badges de métrica mostram informações relevantes
- [ ] Estados de loading são claros
- [ ] Estados de erro são informativos

### 6. Animações e Micro-interações
- [ ] Entrada escalonada de cards (0.28s por card)
- [ ] Hover scaling sutil (0.02-0.06)
- [ ] Micro-pulse em CTAs (1.6s)
- [ ] Animações usam transform/opacity (não layout)
- [ ] Transições são suaves (300ms)

## 🧪 Como Testar

### Teste de Responsividade
1. Abra DevTools
2. Teste em 320px, 768px, 1200px
3. Verifique se não há overflow horizontal
4. Teste orientação landscape/portrait

### Teste de Acessibilidade
1. Use apenas teclado para navegar
2. Verifique ordem de tab
3. Teste com screen reader
4. Verifique contraste com ferramentas de acessibilidade

### Teste de Performance
1. Abra Network tab
2. Recarregue página
3. Verifique se imagens carregam com dimensões corretas
4. Teste em conexão lenta

### Teste de Animações
1. Verifique se animações são suaves
2. Teste com prefers-reduced-motion
3. Verifique se não há jank durante scroll

## 🚨 Problemas Comuns

### Layout Shift
- **Sintoma**: Conteúdo "pula" quando imagens carregam
- **Solução**: Adicionar width/height ou aspect-ratio CSS

### Contraste Baixo
- **Sintoma**: Texto difícil de ler
- **Solução**: Usar classes text-high-contrast

### Animações Lentas
- **Sintoma**: FPS baixo durante animações
- **Solução**: Usar transform/opacity, não layout properties

### Focus States Ausentes
- **Sintoma**: Não é possível navegar por teclado
- **Solução**: Adicionar outline e box-shadow no focus

## 📱 Breakpoints de Teste

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1199px  
- **Desktop**: 1200px+

## 🎯 Critérios de Aceitação

### Obrigatório (Must Have)
- [ ] Responsividade em todos os breakpoints
- [ ] Contraste AA para texto
- [ ] Focus states visíveis
- [ ] Sem layout shift
- [ ] Animações fluidas

### Desejável (Should Have)
- [ ] Animações respeitam prefers-reduced-motion
- [ ] Performance otimizada
- [ ] Micro copy consistente
- [ ] Badges de métrica informativos

### Opcional (Could Have)
- [ ] Animações avançadas
- [ ] Efeitos de parallax
- [ ] Transições complexas

## 🔍 Ferramentas de Teste

- **Contraste**: WebAIM Contrast Checker
- **Responsividade**: DevTools Device Toolbar
- **Performance**: Lighthouse
- **Acessibilidade**: axe DevTools
- **Animações**: Performance tab do DevTools
