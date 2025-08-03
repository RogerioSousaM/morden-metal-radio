# 🗄️ Banco de Dados - Morden Metal Radio

## 📊 **Visão Geral**

O projeto utiliza **SQLite** como banco de dados principal, oferecendo:
- ✅ **Simplicidade**: Arquivo único, sem necessidade de servidor
- ✅ **Performance**: Rápido para aplicações de pequeno/médio porte
- ✅ **Confiabilidade**: Transações ACID completas
- ✅ **Portabilidade**: Fácil backup e migração

## 🏗️ **Estrutura do Banco**

### **Tabelas Principais**

#### 1. **users** - Usuários do Sistema
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 2. **bands** - Bandas em Destaque
```sql
CREATE TABLE bands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT,
  listeners TEXT DEFAULT '0',
  rating REAL DEFAULT 0,
  is_featured BOOLEAN DEFAULT 0,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 3. **programs** - Programação da Rádio
```sql
CREATE TABLE programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  host TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT,
  is_live BOOLEAN DEFAULT 0,
  listeners TEXT DEFAULT '0',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 4. **news** - Notícias do Portal
```sql
CREATE TABLE news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  author TEXT DEFAULT 'Admin',
  is_published BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 5. **images** - Gestão de Imagens
```sql
CREATE TABLE images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  path TEXT NOT NULL,
  alt_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 6. **videos** - Gestão de Vídeos
```sql
CREATE TABLE videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail TEXT,
  duration INTEGER,
  is_featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### 7. **stats** - Estatísticas do Sistema
```sql
CREATE TABLE stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listeners INTEGER DEFAULT 0,
  top_band TEXT,
  next_program TEXT,
  system_alerts INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🚀 **Comandos de Gerenciamento**

### **Inicializar Banco**
```bash
cd server
npm run migrate
```

### **Criar Backup**
```bash
cd server
npm run backup
```

### **Iniciar Servidor**
```bash
cd server
npm run dev
```

## 🔧 **Operações CRUD**

### **Exemplo: Gestão de Bandas**

#### **CREATE** - Criar Nova Banda
```javascript
const result = await db.run(
  `INSERT INTO bands (name, genre, description, listeners, rating, is_featured, image) 
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ['Nova Banda', 'Metal', 'Descrição...', '1.2k', 4.5, 1, 'url_imagem']
)
```

#### **READ** - Buscar Bandas
```javascript
// Todas as bandas
const bands = await db.all('SELECT * FROM bands ORDER BY created_at DESC')

// Banda específica
const band = await db.get('SELECT * FROM bands WHERE id = ?', [bandId])
```

#### **UPDATE** - Atualizar Banda
```javascript
await db.run(
  `UPDATE bands SET name = ?, genre = ?, rating = ?, updated_at = CURRENT_TIMESTAMP 
   WHERE id = ?`,
  ['Novo Nome', 'Novo Gênero', 4.8, bandId]
)
```

#### **DELETE** - Deletar Banda
```javascript
await db.run('DELETE FROM bands WHERE id = ?', [bandId])
```

## 📁 **Arquivos do Banco**

### **Localização**
- **Banco Principal**: `server/morden_metal.db`
- **Backups**: `server/backups/morden_metal_backup_TIMESTAMP.db`

### **Backup Automático**
O sistema cria backups com timestamp automático:
```
backups/
├── morden_metal_backup_2024-08-02T15-30-00-000Z.db
├── morden_metal_backup_2024-08-02T16-00-00-000Z.db
└── ...
```

## 🔒 **Segurança**

### **Proteções Implementadas**
- ✅ **SQL Injection**: Uso de prepared statements
- ✅ **XSS**: Sanitização de entrada
- ✅ **Validação**: Express-validator em todas as rotas
- ✅ **Autenticação**: JWT com bcrypt para senhas
- ✅ **Rate Limiting**: Proteção contra ataques de força bruta

### **Dados Sensíveis**
- Senhas são hasheadas com bcrypt (salt rounds: 10)
- Tokens JWT com expiração de 24h
- Validação de entrada em todas as operações

## 📈 **Performance**

### **Índices Recomendados**
```sql
-- Para busca rápida de bandas por nome
CREATE INDEX idx_bands_name ON bands(name);

-- Para busca de programas por horário
CREATE INDEX idx_programs_time ON programs(start_time, end_time);

-- Para busca de notícias publicadas
CREATE INDEX idx_news_published ON news(is_published, created_at);
```

### **Otimizações**
- Queries otimizadas com LIMIT e ORDER BY
- Prepared statements para reutilização
- Transações para operações complexas

## 🛠️ **Manutenção**

### **Verificar Integridade**
```bash
# Verificar tabelas
sqlite3 server/morden_metal.db ".tables"

# Verificar dados
sqlite3 server/morden_metal.db "SELECT COUNT(*) FROM bands;"
```

### **Limpeza de Dados**
```sql
-- Remover registros antigos (exemplo)
DELETE FROM stats WHERE created_at < datetime('now', '-30 days');
```

## 🔄 **Migração de Dados**

### **De Arrays para Banco**
O sistema migrou automaticamente de arrays em memória para SQLite:
- ✅ Dados iniciais preservados
- ✅ Estrutura normalizada
- ✅ Relacionamentos estabelecidos
- ✅ Timestamps automáticos

### **Próximas Migrações**
Para futuras atualizações do schema:
1. Criar novo arquivo de migração
2. Executar com `npm run migrate`
3. Validar integridade dos dados
4. Criar backup antes da migração

---

## 📞 **Suporte**

Para questões relacionadas ao banco de dados:
- Verificar logs em `server/logs/`
- Executar `npm run migrate` para reinicializar
- Usar `npm run backup` antes de alterações
- Consultar este documento para referência 