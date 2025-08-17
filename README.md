# 🎸 Morden Metal Radio

**Site de rádio online e portal de notícias focado em metal moderno**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Sobre o Projeto

Morden Metal Radio é uma plataforma completa de rádio online especializada em metal moderno, incluindo metalcore, djent, post-hardcore e outros subgêneros contemporâneos. O projeto oferece tanto um portal público para ouvintes quanto um painel administrativo completo para gestão de conteúdo.

## ✨ Características Principais

### 🎵 **Portal Público (Frontend User)**
- **Design System Metalcore**: Interface dark metal moderna com identidade visual única
- **Galeria em Mosaico**: Exibição dinâmica de bandas da cena com efeitos visuais
- **Programação ao Vivo**: Grid de programas com indicadores de status
- **Seção Filmaço**: Recomendações de filmes de terror e suspense
- **Responsividade Total**: Otimizado para todos os dispositivos
- **Acessibilidade**: Navegação por teclado e suporte a leitores de tela

### 🛠️ **Painel Administrativo (Frontend Admin)**
- **Gestão de Conteúdo**: CRUD completo para bandas, filmes, programas
- **Upload de Arquivos**: Sistema de gerenciamento de mídia
- **Dashboard Analytics**: Métricas e estatísticas em tempo real
- **Controle de Usuários**: Sistema de permissões e roles
- **Interface Moderna**: Design consistente com o sistema metalcore

### 🔧 **Backend Robusto**
- **API RESTful**: Endpoints bem documentados com OpenAPI
- **Middleware de Segurança**: Autenticação, autorização e auditoria
- **Sistema de Logs**: Rastreamento completo de ações administrativas
- **Validação de Dados**: Schemas robustos e tratamento de erros
- **Performance**: Otimizações de banco e cache

## 🏗️ Arquitetura

```
morden-metal-radio/
├── frontend-user/          # Portal público (React + TypeScript)
├── frontend-admin/         # Painel administrativo (React + TypeScript)
├── backend/                # API Node.js + Express
├── database/               # Scripts SQLite e migrações
└── docs/                   # Documentação técnica
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** com sistema de design customizado
- **Framer Motion** para animações
- **Vite** para build e desenvolvimento
- **Lucide React** para ícones

### Backend
- **Node.js** com Express
- **SQLite3** com configurações otimizadas
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **Jest** para testes

### Design System
- **Paleta Metalcore**: Cores escuras com acentos vermelho sangue
- **Tipografia Orbitron**: Fonte display para títulos
- **Sistema de Grid**: Layout responsivo e flexível
- **Componentes Reutilizáveis**: Cards, botões e overlays padronizados

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/RogerioSousaM/morden-metal-radio.git
cd morden-metal-radio
```

### 2. Instale as dependências
```bash
# Dependências principais
npm install

# Frontend User
cd frontend-user && npm install

# Frontend Admin  
cd ../frontend-admin && npm install

# Backend
cd ../backend && npm install

# Database
cd ../database && npm install
```

### 3. Configure o banco de dados
```bash
cd database
npm run setup
npm run seed
```

### 4. Configure as variáveis de ambiente
```bash
# Backend
cp backend/.env.example backend/.env
# Edite backend/.env com suas configurações
```

### 5. Execute o projeto
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend User
cd frontend-user && npm run dev

# Terminal 3: Frontend Admin
cd frontend-admin && npm run dev
```

## 📱 Como Usar

### Portal Público
- Acesse `http://localhost:5173` para o portal público
- Navegue pelas seções: Bandas da Cena, Programação, Filmaço
- Explore a galeria em mosaico das bandas
- Verifique a programação ao vivo

### Painel Administrativo
- Acesse `http://localhost:5174` para o painel admin
- Faça login com credenciais de administrador
- Gerencie conteúdo, usuários e configurações
- Monitore logs e estatísticas

## 🎨 Sistema de Design

### Paleta de Cores
- **Metal Background**: `#000000` (Preto puro)
- **Metal Surface**: `#0f0f10` (Superfície escura)
- **Accent Crimson**: `#d32f2f` (Vermelho sangue)
- **Accent Amber**: `#ffb300` (Âmbar metálico)

### Tipografia
- **Display**: Orbitron (Títulos e elementos hero)
- **Body**: Inter (Texto e conteúdo)

### Componentes
- **Cards**: Sistema de cards com overlays e animações
- **Botões**: Botões com estados hover e focus
- **Grid**: Sistema de grid responsivo para galerias
- **Overlays**: Efeitos visuais para imagens e mídia

## 🔒 Segurança

- **Autenticação JWT** com refresh tokens
- **Middleware de Auditoria** para todas as ações administrativas
- **Validação de Entrada** com schemas robustos
- **Sanitização de Dados** para prevenir injeções
- **Rate Limiting** para proteção contra ataques

## 📊 Performance

- **Lazy Loading** de imagens e componentes
- **Code Splitting** para otimização de bundles
- **Cache de Banco** com configurações SQLite otimizadas
- **Compressão** de assets estáticos
- **CDN Ready** para deploy em produção

## 🧪 Testes

```bash
# Testes do backend
cd backend && npm test

# Testes do frontend
cd frontend-user && npm test
cd frontend-admin && npm test
```

## 📚 Documentação

- [API Documentation](./API_DOCUMENTATION.md)
- [Typography System](./TYPOGRAPHY_SYSTEM.md)
- [Design System](./frontend-user/METALCORE_AESTHETIC.md)
- [Component Guidelines](./frontend-user/COMPONENT_SPECIFIC_SYSTEM.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- **Rogério Sousa** - [GitHub](https://github.com/RogerioSousaM)

## 🙏 Agradecimentos

- Comunidade metal brasileira
- Contribuidores open source
- Inspiração em plataformas de música independente

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/RogerioSousaM/morden-metal-radio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/RogerioSousaM/morden-metal-radio/discussions)
- **Email**: [Seu email aqui]

---

**🎸 Metal nunca morre, apenas evolui! 🤘**
