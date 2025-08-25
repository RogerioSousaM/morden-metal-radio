# 🎸 Morden Metal Radio

**Plataforma completa de rádio online especializada em metal moderno**


## 🚀 Visão Geral

O projeto oferece uma experiência completa com portal público para ouvintes e painel administrativo robusto para gestão de conteúdo.

## ✨ Funcionalidades Principais

### 🎵 **Portal Público (Frontend User)**
- **Landing Page Dinâmica**: Hero section com animações Framer Motion
- **Galeria de Bandas**: Mosaico interativo das bandas da cena metal
- **Programação ao Vivo**: Grid de programas com indicadores de status em tempo real
- **Seção Filmaço**: Recomendações de filmes de terror e suspense
- **Navegação por Rotas**: Páginas dedicadas para cada seção
- **Design Responsivo**: Interface otimizada para todos os dispositivos
- **Sistema de Toast**: Notificações em tempo real

### 🛠️ **Painel Administrativo (Frontend Admin)**
- **Dashboard Centralizado**: Visão geral do sistema
- **Gestão de Bandas**: CRUD completo para bandas da cena
- **Gestão de Filmes**: Catálogo de filmes com indicações do mês
- **Controle de Programação**: Agendamento e gestão de horários
- **Sistema de Banners**: Gestão de banners e carrosséis
- **Upload de Arquivos**: Sistema avançado de gerenciamento de mídia
- **Controle de Usuários**: Sistema de permissões e roles
- **Configurações**: Gestão de links sociais e configurações gerais

### 🔧 **Backend Robusto**
- **API RESTful**: 13 endpoints principais organizados por funcionalidade
- **Autenticação JWT**: Sistema seguro de login e autorização
- **Middleware de Segurança**: Helmet, CORS, Rate Limiting
- **Sistema de Auditoria**: Logs detalhados de todas as ações
- **Upload de Arquivos**: Processamento de imagens com Sharp
- **Validação de Dados**: Schemas robustos com express-validator
- **Documentação OpenAPI**: Swagger UI integrado

## 🏗️ Arquitetura do Sistema

```
morden-metal-radio/
├── frontend-user/          # Portal público (React 18 + TS + Vite)
│   ├── src/
│   │   ├── components/     # Componentes principais
│   │   ├── pages/          # Páginas dedicadas
│   │   └── ui/             # Componentes de interface
├── frontend-admin/         # Painel administrativo (React 18 + TS + Vite)
│   ├── src/
│   │   ├── components/     # Layouts e componentes admin
│   │   ├── pages/          # Páginas de gestão
│   │   └── ui/             # Componentes reutilizáveis
├── backend/                # API Node.js + Express
│   ├── routes/             # 13 rotas principais
│   ├── middleware/         # Auth, audit, security
│   └── config/             # Configurações e uploads
├── database/               # Scripts SQLite e migrações
│   ├── database.js         # Classe principal do banco
│   └── scripts/            # Migrações e backups
└── docs/                   # Documentação técnica
```

## 🛠️ Stack Tecnológica

### **Frontend**
- **React 18.2** com TypeScript 5.0
- **Vite 4.4** para build e desenvolvimento ultra-rápido
- **Tailwind CSS 3.3** com sistema de design customizado
- **Framer Motion 10.16** para animações fluidas
- **React Router DOM 7.7** para navegação SPA
- **Lucide React 0.263** para ícones consistentes
- **Vitest 3.2** para testes unitários

### **Backend**
- **Node.js 16+** com Express 4.18
- **SQLite3 5.1** com configurações WAL otimizadas
- **JWT 9.0** para autenticação segura
- **Multer 1.4** para upload de arquivos
- **Sharp 0.33** para processamento de imagens
- **Helmet 7.1** para segurança HTTP
- **Swagger 6.2** para documentação da API
- **Jest 29.7** para testes

### **Banco de Dados**
- **SQLite3** com configurações de performance
- **WAL Mode** para melhor concorrência
- **Cache otimizado** para consultas rápidas
- **Sistema de migrações** automatizado
- **Backups automáticos** do banco

## 🔌 Endpoints da API

### **Conteúdo Principal**
- `GET /api/bandas` - Lista de bandas da cena metal
- `GET /api/filmes` - Catálogo de filmes com notas
- `GET /api/programs` - Programação da rádio
- `GET /api/schedule` - Horários e agendamentos
- `GET /api/news` - Notícias e atualizações

### **Administração**
- `POST /api/auth/login` - Autenticação de usuários
- `POST /api/upload` - Upload e processamento de arquivos
- `GET /api/users` - Gestão de usuários e permissões
- `POST /api/bandas` - CRUD completo de bandas
- `POST /api/filmes` - CRUD completo de filmes

### **Mídia e Conteúdo**
- `GET /api/banners` - Gestão de banners promocionais
- `GET /api/carousel` - Carrossel de imagens rotativo
- `GET /api/destaques` - Conteúdo em destaque
- `GET /api/highlights` - Destaques especiais
- `GET /api/social-links` - Links para redes sociais
- `GET /api/top-month` - Top do mês

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 16+ 
- npm ou yarn
- Git

### **1. Clone o repositório**
```bash
git clone https://github.com/RogerioSousaM/morden-metal-radio.git
cd morden-metal-radio
```

### **2. Instalação completa**
```bash
# Instala todas as dependências de uma vez
npm run install:all
```

### **3. Configuração do banco**
```bash
cd database
npm run migrate    # Executa migrações
npm run schema     # Verifica schema
```

### **4. Variáveis de ambiente**
```bash
# Backend
cp backend/.env.example backend/.env
# Configure suas variáveis no arquivo .env
```

### **5. Execução do projeto**
```bash
# Executa todos os serviços simultaneamente
npm run dev
```

## 📱 Como Usar

### **Portal Público**
- **URL**: `http://localhost:5173`
- **Seções**: Hero, Programação, Filmaço, Bandas da Cena
- **Navegação**: Rotas dedicadas para cada seção
- **Responsivo**: Otimizado para mobile e desktop

### **Painel Administrativo**
- **URL**: `http://localhost:5174`
- **Login**: Credenciais de administrador
- **Dashboard**: Visão geral do sistema
- **Gestão**: CRUD completo de conteúdo

## 🎨 Sistema de Design

### **Paleta de Cores**
- **Background**: `#000000` (Preto puro)
- **Surface**: `#0f0f10` (Superfície escura)
- **Accent**: `#d32f2f` (Vermelho sangue)
- **Secondary**: `#ffb300` (Âmbar metálico)

### **Tipografia**
- **Display**: Orbitron (Títulos e elementos hero)
- **Body**: Inter (Texto e conteúdo)

### **Componentes**
- **Cards**: Sistema de cards com overlays
- **Botões**: Estados hover e focus
- **Grid**: Layout responsivo para galerias
- **Animações**: Transições suaves com Framer Motion

## 🔒 Segurança e Performance

### **Segurança**
- **JWT Authentication** com refresh tokens
- **Rate Limiting** configurado por endpoint
- **Helmet** para headers de segurança
- **CORS** configurado para origens confiáveis
- **Validação** com express-validator
- **Auditoria** completa de ações

### **Performance**
- **SQLite WAL Mode** para concorrência
- **Cache otimizado** para consultas
- **Compressão** de imagens com Sharp
- **Lazy Loading** de componentes
- **Code Splitting** com Vite
- **CDN Ready** para produção



## 📖 Documentação

- [API Documentation](./API_DOCUMENTATION.md) - Documentação completa da API
- [Typography System](./TYPOGRAPHY_SYSTEM.md) - Sistema de tipografia
- [Database Status](./database/DATABASE_STATUS.md) - Status do banco
- [Database Setup](./database/DATABASE.md) - Configuração do banco



## 👥 Autor

- **Rogério Sousa** - [GitHub](https://github.com/RogerioSousaM)