# 📚 **Documentação da API Morden Metal Radio**

## 🎯 **Visão Geral**

A API Morden Metal Radio fornece endpoints para gerenciamento completo de uma rádio online de metal moderno, incluindo autenticação, gerenciamento de conteúdo, banners promocionais e muito mais.

## 🌐 **Acesso à Documentação Interativa**

### **Swagger UI**
- **URL**: `http://localhost:3001/api/docs`
- **Descrição**: Interface interativa para testar todos os endpoints da API
- **Recursos**: 
  - Teste de endpoints em tempo real
  - Exemplos de requests e responses
  - Autenticação automática com JWT
  - Filtros e busca por tags

## 🔐 **Autenticação**

### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### **Resposta de Sucesso**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### **Uso do Token**
Para endpoints protegidos, inclua o token no header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📁 **Endpoints Principais**

### **1. Filmes (`/api/filmes`)**

#### **Listar Filmes**
```http
GET /api/filmes?page=1&limit=10&featured=true
```

#### **Criar Filme**
```http
POST /api/filmes
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Mad Max: Fury Road",
  "descricao": "Um filme de ação pós-apocalíptico...",
  "ano": 2015,
  "nota": 4.5,
  "imagem": "https://example.com/madmax.jpg",
  "indicacao_do_mes": true
}
```

#### **Atualizar Filme**
```http
PUT /api/filmes/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Mad Max: Fury Road (Atualizado)",
  "nota": 4.8
}
```

#### **Excluir Filme**
```http
DELETE /api/filmes/1
Authorization: Bearer <token>
```

### **2. Bandas (`/api/bandas`)**

#### **Listar Bandas**
```http
GET /api/bandas?page=1&limit=10&featured=true
```

#### **Criar Banda**
```http
POST /api/bandas
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sleep Token",
  "slug": "sleep-token",
  "description": "Banda de metal alternativo...",
  "official_url": "https://sleeptoken.com",
  "image_url": "https://example.com/sleeptoken.jpg",
  "genre_tags": "[\"metal alternativo\", \"metalcore\"]",
  "featured": true
}
```

#### **Buscar Banda por ID**
```http
GET /api/bandas/1
```

### **3. Banners (`/api/banners`)**

#### **Listar Banners (Público)**
```http
GET /api/banners?location=hero&limit=1&active=true
```

#### **Criar Banner**
```http
POST /api/banners
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Novo Álbum",
  "description": "Confira o novo álbum da banda",
  "image_url": "https://example.com/banner.jpg",
  "target_url": "https://example.com/album",
  "location": "hero",
  "priority": 1,
  "active": true,
  "start_at": "2025-01-01T00:00:00Z",
  "end_at": "2025-12-31T23:59:59Z"
}
```

### **4. Destaques (`/api/destaques`)**

#### **Listar Destaques**
```http
GET /api/destaques?type=filme&limit=10
```

### **5. Carrossel (`/api/carousel`)**

#### **Slides Ativos**
```http
GET /api/carousel/active
```

### **6. Links Sociais (`/api/social-links`)**

#### **Obter Links**
```http
GET /api/social-links
```

#### **Atualizar Links**
```http
PUT /api/social-links
Authorization: Bearer <token>
Content-Type: application/json

{
  "instagram": "https://instagram.com/mordenmetal",
  "youtube": "https://youtube.com/mordenmetal",
  "twitter": "https://twitter.com/mordenmetal",
  "tiktok": "https://tiktok.com/@mordenmetal"
}
```

## 📊 **Estruturas de Dados**

### **Filme**
```json
{
  "id": 1,
  "titulo": "Mad Max: Fury Road",
  "descricao": "Um filme de ação pós-apocalíptico...",
  "ano": 2015,
  "nota": 4.5,
  "imagem": "https://example.com/madmax.jpg",
  "indicacao_do_mes": true,
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

### **Banda**
```json
{
  "id": 1,
  "name": "Sleep Token",
  "slug": "sleep-token",
  "description": "Banda de metal alternativo...",
  "official_url": "https://sleeptoken.com",
  "image_url": "https://example.com/sleeptoken.jpg",
  "genre_tags": "[\"metal alternativo\", \"metalcore\"]",
  "featured": true,
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

### **Banner**
```json
{
  "id": 1,
  "title": "Novo Álbum",
  "description": "Confira o novo álbum da banda",
  "image_url": "https://example.com/banner.jpg",
  "target_url": "https://example.com/album",
  "location": "hero",
  "priority": 1,
  "active": true,
  "start_at": "2025-01-01T00:00:00Z",
  "end_at": "2025-12-31T23:59:59Z",
  "impressions": 150,
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

## 🔍 **Filtros e Paginação**

### **Parâmetros Comuns**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10, máximo: 100)
- `featured`: Filtrar por itens em destaque (boolean)
- `active`: Filtrar por itens ativos (boolean)

### **Exemplo de Paginação**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🚀 **Exemplos de Uso**

### **Frontend React/TypeScript**
```typescript
// Buscar filmes
const fetchFilmes = async () => {
  const response = await fetch('/api/filmes?page=1&limit=10', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return response.json()
}

// Criar filme
const createFilme = async (filmeData: any) => {
  const response = await fetch('/api/filmes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(filmeData)
  })
  return response.json()
}
```

### **cURL**
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Listar filmes
curl -X GET http://localhost:3001/api/filmes \
  -H "Authorization: Bearer <token>"

# Criar filme
curl -X POST http://localhost:3001/api/filmes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Novo Filme","descricao":"Descrição...","ano":2025,"nota":4.0}'
```

## ⚠️ **Códigos de Status HTTP**

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Dados inválidos
- `401`: Não autorizado
- `404`: Não encontrado
- `500`: Erro interno do servidor

## 🔒 **Segurança**

### **Rate Limiting**
- **Geral**: 100 requests por IP a cada 15 minutos
- **Autenticação**: 5 tentativas por IP a cada 15 minutos
- **Uploads**: 10 uploads por IP a cada hora

### **Validação de Entrada**
- Sanitização automática de dados
- Validação de tipos e formatos
- Escape de caracteres especiais

### **CORS**
- Origem restrita a domínios confiáveis
- Credenciais habilitadas
- Headers personalizados permitidos

## 🧪 **Testando a API**

### **1. Iniciar o Servidor**
```bash
cd backend
npm start
```

### **2. Acessar a Documentação**
Abra no navegador: `http://localhost:3001/api/docs`

### **3. Fazer Login**
1. Use o endpoint `/auth/login`
2. Copie o token retornado
3. Clique no botão "Authorize" no Swagger UI
4. Cole o token no formato: `Bearer <token>`

### **4. Testar Endpoints**
- Use o botão "Try it out" para cada endpoint
- Preencha os parâmetros necessários
- Execute e veja a resposta

## 📝 **Logs e Auditoria**

A API registra automaticamente:
- Todas as requisições
- Ações de usuário
- Erros e exceções
- Tentativas de autenticação

## 🆘 **Suporte**

Para dúvidas ou problemas:
- **Email**: dev@mordenmetal.com
- **Documentação**: `http://localhost:3001/api/docs`
- **Issues**: Repositório do projeto

---

## 🎉 **Conclusão**

A API Morden Metal Radio está pronta para uso com:
- ✅ Documentação completa e interativa
- ✅ Autenticação JWT segura
- ✅ Validação robusta de dados
- ✅ Rate limiting configurado
- ✅ Logs de auditoria
- ✅ Exemplos práticos de uso

**Acesse agora**: `http://localhost:3001/api/docs`
