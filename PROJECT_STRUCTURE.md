# 🏗️ Estrutura do Projeto - Morden Metal Radio

## 📁 **Organização das Pastas**

```
Projeto_Novo/
├── 📊 database/                    # Banco de Dados SQLite
│   ├── morden_metal.db            # Arquivo do banco
│   ├── database.js                # Configuração do banco
│   ├── migrate.js                 # Script de migração
│   ├── backup.js                  # Script de backup
│   └── DATABASE.md                # Documentação do banco
│
├── 🔧 backend/                     # Servidor API
│   ├── index.js                   # Servidor principal
│   ├── package.json               # Dependências do backend
│   └── node_modules/              # Módulos do backend
│
├── 🎵 frontend-user/              # Frontend do Usuário
│   ├── src/
│   │   ├── components/            # Componentes do usuário
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── FeaturedBands.tsx
│   │   │   ├── ProgramGrid.tsx
│   │   │   └── TopMonthPopup.tsx
│   │   ├── App.tsx                # App principal
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Estilos
│   ├── package.json               # Dependências do frontend
│   ├── vite.config.ts             # Configuração Vite
│   ├── tailwind.config.js         # Configuração Tailwind
│   └── index.html                 # HTML principal
│
├── 🔐 frontend-admin/             # Frontend do Admin
│   ├── src/
│   │   ├── components/            # Componentes do admin
│   │   │   ├── Login.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── BandsManagement.tsx
│   │   │   └── ScheduleManagement.tsx
│   │   ├── pages/                 # Páginas do admin
│   │   │   ├── Dashboard.tsx
│   │   │   ├── BandsManagement.tsx
│   │   │   └── ScheduleManagement.tsx
│   │   ├── services/              # Serviços de API
│   │   │   └── api.ts
│   │   ├── App.tsx                # App do admin
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Estilos
│   ├── package.json               # Dependências do admin
│   ├── vite.config.ts             # Configuração Vite
│   ├── tailwind.config.js         # Configuração Tailwind
│   └── index.html                 # HTML do admin
│
├── 🚀 start-all.bat               # Script para iniciar tudo
├── 📖 README.md                   # Documentação principal
├── 📋 PROJECT_STRUCTURE.md        # Este arquivo
└── .gitignore                     # Arquivos ignorados
```

## 🎯 **Responsabilidades de Cada Pasta**

### 📊 **Database/**
- **Função**: Gerenciamento do banco de dados SQLite
- **Arquivos**:
  - `morden_metal.db`: Arquivo do banco
  - `database.js`: Classe de conexão e operações
  - `migrate.js`: Script de migração e seed
  - `backup.js`: Script de backup automático
  - `DATABASE.md`: Documentação completa

### 🔧 **Backend/**
- **Função**: API REST com Express.js
- **Responsabilidades**:
  - Autenticação JWT
  - CRUD de bandas, programas, notícias
  - Validação de dados
  - Segurança (CORS, Helmet, Rate Limiting)
  - Conexão com banco de dados

### 🎵 **Frontend-User/**
- **Função**: Interface pública do usuário
- **Responsabilidades**:
  - Página principal da rádio
  - Player de áudio
  - Listagem de bandas
  - Grade de programação
  - Componentes visuais

### 🔐 **Frontend-Admin/**
- **Função**: Painel administrativo
- **Responsabilidades**:
  - Login e autenticação
  - Dashboard com estatísticas
  - Gestão de bandas (CRUD)
  - Gestão de programação
  - Interface administrativa

## 🚀 **Como Executar**

### **Opção 1: Iniciar Tudo de Uma Vez**
```bash
# Windows
start-all.bat

# Linux/Mac
./start-all.sh
```

### **Opção 2: Iniciar Separadamente**

#### **1. Banco de Dados**
```bash
cd database
node migrate.js
```

#### **2. Backend**
```bash
cd backend
npm install
npm run dev
```

#### **3. Frontend do Usuário**
```bash
cd frontend-user
npm install
npm run dev
```

#### **4. Frontend do Admin**
```bash
cd frontend-admin
npm install
npm run dev
```

## 🌐 **URLs dos Serviços**

| Serviço | URL | Porta | Descrição |
|---------|-----|-------|-----------|
| **Backend** | http://localhost:3001 | 3001 | API REST |
| **Frontend User** | http://localhost:5173 | 5173 | Site público |
| **Frontend Admin** | http://localhost:5174 | 5174 | Painel admin |

## 🔧 **Comandos Úteis**

### **Banco de Dados**
```bash
# Migração
cd database && node migrate.js

# Backup
cd database && node backup.js

# Verificar banco
sqlite3 database/morden_metal.db ".tables"
```

### **Backend**
```bash
# Desenvolvimento
cd backend && npm run dev

# Produção
cd backend && npm start

# Testes
cd backend && npm test
```

### **Frontends**
```bash
# Usuário
cd frontend-user && npm run dev

# Admin
cd frontend-admin && npm run dev

# Build para produção
npm run build
```

## 📦 **Dependências Principais**

### **Backend**
- Express.js
- SQLite3
- JWT
- bcryptjs
- CORS
- Helmet

### **Frontend User**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

### **Frontend Admin**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

## 🔒 **Segurança**

### **Autenticação**
- JWT tokens com expiração de 24h
- Senhas hasheadas com bcrypt
- Rotas protegidas no admin

### **Validação**
- Express-validator em todas as rotas
- Sanitização contra XSS
- Prepared statements contra SQL Injection

### **CORS**
- Configurado apenas para origens confiáveis
- Credenciais habilitadas

## 📈 **Vantagens da Nova Estrutura**

### ✅ **Separação de Responsabilidades**
- Cada pasta tem uma função específica
- Fácil manutenção e desenvolvimento
- Equipes podem trabalhar independentemente

### ✅ **Escalabilidade**
- Frontends separados permitem diferentes tecnologias
- Backend pode ser expandido sem afetar frontends
- Banco de dados isolado e portável

### ✅ **Deploy Independente**
- Cada serviço pode ser deployado separadamente
- Diferentes estratégias de deploy por serviço
- Facilita CI/CD

### ✅ **Desenvolvimento**
- Hot reload independente
- Diferentes portas evitam conflitos
- Debugging mais fácil

## 🛠️ **Próximos Passos**

1. **Instalar dependências** em cada pasta
2. **Executar migração** do banco
3. **Iniciar serviços** na ordem correta
4. **Testar funcionalidades** de cada módulo
5. **Configurar ambiente** de produção

---

## 📞 **Suporte**

Para dúvidas sobre a estrutura:
- Verificar este documento
- Consultar README.md principal
- Verificar DATABASE.md para questões do banco 