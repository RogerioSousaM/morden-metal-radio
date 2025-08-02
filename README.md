# 🎵 Morden Metal - Rádio Online 24h

Site de rádio online e portal de notícias focado em **metal moderno**, com design minimalista e sombrio inspirado na referência visual do KEET CAFE.

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38B2AC.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 **Demo Online**
- **Site Principal**: [https://morden-metal.vercel.app](https://morden-metal.vercel.app)
- **Painel Admin**: [https://morden-metal.vercel.app/admin/login](https://morden-metal.vercel.app/admin/login)

## 🛠️ **Tecnologias Utilizadas**

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Biblioteca de animações
- **Lucide React** - Ícones modernos
- **React Router DOM** - Roteamento da aplicação

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticação com tokens
- **bcryptjs** - Criptografia de senhas
- **express-validator** - Validação de dados
- **Helmet** - Headers de segurança
- **CORS** - Cross-Origin Resource Sharing

### DevOps & Deploy
- **GitHub** - Controle de versão
- **Vercel** - Deploy frontend
- **Railway/Render** - Deploy backend

## 🎵 Características

### Design & UX
- **Design Minimalista**: Interface escura com gradientes sutis e tipografia condensada
- **Paleta de Cores**: Preto, grafite e laranja queimado (#E04E1B)
- **Responsivo**: Otimizado para desktop, tablet e mobile
- **Animações Suaves**: Transições de 300ms para feedback instantâneo

### Funcionalidades Principais

#### 🎧 Player de Áudio
- **Controles de Teclado**:
  - `Espaço` = Play/Pause
  - `Ctrl + ↑↓` = Controle de volume
  - `M` = Mudo/Desmudo
- **Player Colapsável**: Em mobile, pode ser recolhido para economizar espaço
- **Controle de Volume**: Slider interativo com feedback visual
- **Status em Tempo Real**: Mostra se está reproduzindo ou pausado

#### 🎠 Carrossel Hero
- **Transição Fade**: 0.8s de transição suave entre slides
- **Bullets Inteligentes**: Aparecem apenas no hover
- **Loop Automático**: Muda a cada 5 segundos
- **Lazy Loading**: Imagens carregam conforme necessário

#### 📅 Grade de Programação
- **Cards Interativos**: Hover effects e tooltips informativos
- **Indicador AO VIVO**: Destaque visual para programas ativos
- **Tipografia Hierárquica**: Horários em monoespaçado, títulos em peso alto
- **Tooltips**: Informações adicionais nos ícones

#### 🎸 Bandas em Destaque
- **Grid Responsivo**: 3 colunas (desktop), 2 (tablet), 1 (mobile)
- **Badges DESTAQUE**: Para bandas especiais
- **Avaliações**: Sistema de estrelas com tooltips
- **Overlay de Play**: Botão de reprodução no hover das imagens

#### 🔔 Pop-up "Top do Mês"
- **Trigger Inteligente**: Aparece ao rolar 50% da seção de bandas
- **Dismissível**: Pode ser fechado e não reaparece
- **Animações Suaves**: Slide-in da direita

## 🛡️ Segurança & Performance

### Otimizações
- **Code Splitting**: Chunks separados para vendor, animations e icons
- **Lazy Loading**: Imagens e componentes carregam sob demanda
- **Bundle Size**: Otimizado para < 1MB total
- **Caching**: Headers de cache configurados

### Segurança
- **Headers de Segurança**: XSS Protection, Content Type Options
- **CORS**: Configurado para origens confiáveis
- **CSRF Protection**: Tokens em formulários interativos

### Acessibilidade
- **Contraste**: ≥ 4.5:1 em todos os elementos
- **ARIA Labels**: Labels descritivos em todos os botões
- **Keyboard Navigation**: Navegação completa por teclado
- **Reduced Motion**: Respeita preferências de movimento reduzido
- **Focus Indicators**: Outlines visíveis para navegação por teclado

## 🎨 Componentes Implementados

1. **Header**: Navegação fixa com logo e menu responsivo
2. **Hero**: Carrossel principal com call-to-action
3. **ProgramGrid**: Grade de programação da rádio
4. **FeaturedBands**: Bandas em destaque com avaliações
5. **Footer**: Informações e redes sociais
6. **AudioPlayer**: Player fixo com controles avançados
7. **TopMonthPopup**: Pop-up de engajamento

## 🔧 Painel Administrativo

### Funcionalidades do Admin
- **Dashboard**: Visão geral com estatísticas em tempo real
- **Gestão de Bandas**: CRUD completo com validação de segurança
- **Gestão de Programação**: Sistema com verificação de conflitos de horário
- **Autenticação Segura**: Login com JWT e bcrypt
- **Interface Responsiva**: Funciona em desktop e mobile

### Segurança Implementada
- **Autenticação JWT**: Tokens seguros com expiração
- **Validação de Entrada**: Sanitização contra XSS e SQL Injection
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Headers de Segurança**: Helmet.js para proteção adicional
- **CORS Restrito**: Apenas origens confiáveis

### Credenciais de Demonstração
- **Usuário**: `admin`
- **Senha**: `mordenmetal2024`

## 🚀 Como Executar

### Frontend (React)
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Backend (Node.js)
```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

### Acessos
- **Site Principal**: http://localhost:5173
- **Painel Admin**: http://localhost:5173/admin/login
- **API Backend**: http://localhost:3001/api
- **Streaming**: http://localhost:3001/api/stream

## 📱 Responsividade

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Grid adaptado para 2 colunas
- **Mobile**: Player colapsável, navegação otimizada

## 🎯 Próximas Funcionalidades

- [ ] Integração com API de streaming real
- [ ] Sistema de notificações push
- [ ] Chat em tempo real
- [ ] Playlist personalizada
- [ ] Modo offline
- [ ] PWA (Progressive Web App)
- [ ] Sistema de usuários e permissões
- [ ] Upload de arquivos de mídia
- [ ] Analytics avançado
- [ ] Backup automático

## 🛠️ Tecnologias

### Frontend
- **React 18** + TypeScript
- **Vite** para build e dev server
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Lucide React** para ícones

### Backend
- **Node.js** + Express
- **JWT** para autenticação
- **bcryptjs** para criptografia
- **express-validator** para validação
- **helmet** para segurança
- **cors** para CORS
- **express-rate-limit** para rate limiting

## 🤝 **Como Contribuir**

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 **Contato**

- **Email**: contato@mordenmetal.com
- **Discord**: [Morden Metal Community](https://discord.gg/mordenmetal)
- **Instagram**: [@mordenmetal](https://instagram.com/mordenmetal)

---

⭐ **Se este projeto te ajudou, deixe uma estrela!** 