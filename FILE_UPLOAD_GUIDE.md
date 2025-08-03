# 📁 Sistema de Upload de Arquivos - Morden Metal Radio

## 🎯 Visão Geral

O sistema de upload de arquivos foi implementado para gerenciar imagens e vídeos de forma segura e organizada, com validações rigorosas e processamento automático de mídia.

## 🏗️ Arquitetura

### Estrutura de Pastas
```
backend/
├── config/
│   └── fileUpload.js          # Configurações centralizadas
├── middleware/
│   ├── auth.js               # Autenticação JWT
│   └── fileUpload.js         # Middleware de upload
├── routes/
│   └── fileUpload.js         # Rotas da API
├── uploads/                  # Arquivos enviados
│   ├── news/                 # Imagens para notícias
│   ├── gallery/              # Galeria de imagens
│   ├── videos/               # Vídeos
│   ├── thumbnails/           # Thumbnails gerados
│   ├── temp/                 # Arquivos temporários
│   └── backup/               # Backups de originais
└── test-upload.js            # Script de testes
```

### Frontend Admin
```
frontend-admin/src/
├── components/
│   └── FileUpload.tsx        # Componente de upload
├── pages/
│   └── FileManagement.tsx    # Página de gerenciamento
└── services/
    └── api.ts               # Serviços de API
```

## ⚙️ Configurações

### Tipos de Mídia Suportados

#### 📰 Notícias (news)
- **Formatos**: JPG, PNG, WebP
- **Tamanho máximo**: 5MB
- **Dimensões**: 1920x1080px
- **Qualidade**: 85%
- **Uso**: Imagens para artigos de notícias

#### 🖼️ Galeria (gallery)
- **Formatos**: JPG, PNG, WebP, GIF
- **Tamanho máximo**: 10MB
- **Dimensões**: 2560x1440px
- **Qualidade**: 90%
- **Uso**: Galeria de imagens do site

#### 🎥 Vídeos (videos)
- **Formatos**: MP4, WebM, OGG, AVI
- **Tamanho máximo**: 100MB
- **Duração máxima**: 5 minutos
- **Qualidade**: Alta
- **Uso**: Vídeos promocionais e conteúdo

#### 🖼️ Thumbnails (thumbnails)
- **Formatos**: JPG, PNG, WebP
- **Tamanho máximo**: 2MB
- **Dimensões**: 400x300px
- **Qualidade**: 80%
- **Uso**: Miniaturas automáticas

## 🔒 Segurança

### Validações Implementadas
- ✅ **Tipo de arquivo**: Verificação de MIME type
- ✅ **Extensão**: Validação de extensões permitidas
- ✅ **Tamanho**: Limite por tipo de mídia
- ✅ **Executáveis**: Bloqueio de arquivos perigosos
- ✅ **Autenticação**: JWT obrigatório para upload
- ✅ **Sanitização**: Nomes de arquivo únicos
- ✅ **Prepared Statements**: Prevenção de SQL Injection

### Arquivos Bloqueados
```javascript
const dangerousExtensions = [
  '.exe', '.bat', '.cmd', '.com', 
  '.scr', '.pif', '.vbs', '.js'
]
```

## 🚀 API Endpoints

### Upload de Arquivos
```http
POST /api/files/upload/:mediaType
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- files: File[] (múltiplos arquivos)
- alt_text: string (opcional)
- description: string (opcional)
- is_featured: boolean (opcional)
```

### Listagem de Arquivos
```http
GET /api/files/files/:mediaType?page=1&limit=20
Authorization: Bearer <token>
```

### Visualização
```http
GET /api/files/view/:id
```

### Download
```http
GET /api/files/download/:id
```

### Atualização
```http
PUT /api/files/files/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
- alt_text: string (opcional)
- description: string (opcional)
- is_featured: boolean (opcional)
```

### Exclusão
```http
DELETE /api/files/files/:id
Authorization: Bearer <token>
```

### Estatísticas
```http
GET /api/files/stats
Authorization: Bearer <token>
```

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências
```bash
cd backend
npm install multer sharp uuid
```

### 2. Criar Diretórios
```bash
mkdir -p uploads/{news,gallery,videos,thumbnails,temp,backup}
```

### 3. Configurar Permissões
```bash
chmod 755 uploads/
chmod 644 uploads/*/
```

### 4. Iniciar Servidor
```bash
npm run dev
```

## 📱 Uso no Frontend

### Componente de Upload
```tsx
import FileUpload from '../components/FileUpload'

<FileUpload
  mediaType="news"
  onUploadSuccess={(files) => console.log('Uploaded:', files)}
  onUploadError={(error) => console.error('Error:', error)}
  maxFiles={5}
/>
```

### Página de Gerenciamento
```tsx
import FileManagement from '../pages/FileManagement'

// Adicionar à rota
<Route path="/files" element={<FileManagement />} />
```

## 🧪 Testes

### Executar Testes Automáticos
```bash
cd backend
node test-upload.js
```

### Testes Manuais
1. **Upload**: Enviar arquivos via interface
2. **Validação**: Tentar enviar arquivos inválidos
3. **Visualização**: Acessar URLs de visualização
4. **Download**: Testar downloads
5. **Exclusão**: Remover arquivos

## 📊 Monitoramento

### Logs Importantes
- Uploads bem-sucedidos
- Erros de validação
- Tentativas de upload de arquivos perigosos
- Falhas de processamento

### Métricas
- Total de arquivos por tipo
- Tamanho total em disco
- Taxa de sucesso de upload
- Tempo de processamento

## 🔧 Manutenção

### Limpeza de Arquivos
```bash
# Remover arquivos temporários
rm -rf uploads/temp/*

# Backup de arquivos antigos
tar -czf backup-$(date +%Y%m%d).tar.gz uploads/
```

### Otimização
- Comprimir imagens automaticamente
- Gerar múltiplos tamanhos
- Implementar CDN para produção
- Configurar cache de navegador

## 🚨 Troubleshooting

### Problemas Comuns

#### Erro: "Tipo de arquivo não permitido"
- Verificar se o arquivo tem extensão correta
- Confirmar MIME type do arquivo
- Verificar configurações em `fileUpload.js`

#### Erro: "Arquivo muito grande"
- Verificar limite configurado para o tipo
- Ajustar `maxSize` em `UPLOAD_CONFIG`

#### Erro: "Token inválido"
- Verificar se o usuário está logado
- Confirmar validade do JWT
- Verificar headers de autorização

#### Erro: "Diretório não encontrado"
- Criar diretórios de upload
- Verificar permissões
- Executar `createUploadDirectories()`

### Logs de Debug
```javascript
// Ativar logs detalhados
console.log('Upload config:', UPLOAD_CONFIG)
console.log('File info:', fileInfo)
console.log('Processing result:', result)
```

## 📈 Próximos Passos

### Melhorias Planejadas
- [ ] Upload em lote com progresso
- [ ] Compressão automática de vídeos
- [ ] Integração com CDN
- [ ] Watermark automático
- [ ] OCR para extração de texto
- [ ] Backup automático para nuvem
- [ ] Interface de drag & drop melhorada
- [ ] Preview em tempo real
- [ ] Organização por tags
- [ ] Sistema de permissões granular

### Produção
- [ ] Configurar HTTPS
- [ ] Implementar rate limiting
- [ ] Configurar monitoramento
- [ ] Backup automático
- [ ] CDN para arquivos estáticos
- [ ] Compressão gzip
- [ ] Cache headers otimizados

---

## 📞 Suporte

Para questões relacionadas ao sistema de upload:
- Verificar logs em `backend/`
- Executar `node test-upload.js`
- Consultar configurações em `config/fileUpload.js`
- Verificar permissões de diretórios

**Status**: ✅ **SISTEMA DE UPLOAD TOTALMENTE OPERACIONAL** 