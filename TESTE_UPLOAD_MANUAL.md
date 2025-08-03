# 🧪 Guia de Teste Manual - Fluxo de Upload/Download

## 📋 Pré-requisitos

1. **Backend rodando**: `http://localhost:3001`
2. **Frontend Admin rodando**: `http://localhost:5173`
3. **Banco de dados**: SQLite configurado e funcionando

## 🚀 Passos para Teste Completo

### 1. Acessar o Painel Admin
- Abra: `http://localhost:5173`
- Faça login com:
  - **Usuário**: `admin`
  - **Senha**: `mordenmetal2024`

### 2. Navegar para Gerenciamento de Arquivos
- No menu lateral, clique em "Gerenciamento de Arquivos"
- Ou acesse diretamente: `http://localhost:5173/file-management`

### 3. Teste de Upload de Imagem

#### 3.1 Upload para Notícias
1. Clique em "Novo Upload"
2. Na seção "Imagens para Notícias":
   - Clique em "Selecionar Arquivos"
   - Escolha uma imagem JPG/PNG (máximo 5MB)
   - Adicione texto alternativo: "Teste de notícia"
   - Clique em "Enviar Arquivos"
3. **Verificar**:
   - ✅ Progress bar aparece durante upload
   - ✅ Mensagem de sucesso
   - ✅ Arquivo aparece na lista

#### 3.2 Upload para Galeria
1. Na seção "Galeria de Imagens":
   - Clique em "Selecionar Arquivos"
   - Escolha uma imagem (máximo 10MB)
   - Clique em "Enviar Arquivos"
2. **Verificar**:
   - ✅ Upload bem-sucedido
   - ✅ Arquivo listado na galeria

### 4. Teste de Upload de Vídeo

#### 4.1 Upload de Vídeo
1. Na seção "Vídeos":
   - Clique em "Selecionar Arquivos"
   - Escolha um vídeo MP4/WebM (máximo 100MB)
   - Clique em "Enviar Arquivos"
2. **Verificar**:
   - ✅ Progress bar durante upload
   - ✅ Processamento do vídeo
   - ✅ Arquivo disponível na lista

### 5. Verificação no Banco de Dados

#### 5.1 Verificar Tabela de Arquivos
```sql
-- Conectar ao banco SQLite
sqlite3 database/morden_metal.db

-- Verificar arquivos inseridos
SELECT id, filename, original_name, mime_type, size, path, created_at 
FROM files 
ORDER BY created_at DESC 
LIMIT 10;

-- Verificar estatísticas
SELECT 
  COUNT(*) as total_files,
  SUM(size) as total_size,
  COUNT(CASE WHEN mime_type LIKE 'image/%' THEN 1 END) as total_images,
  COUNT(CASE WHEN mime_type LIKE 'video/%' THEN 1 END) as total_videos
FROM files;
```

### 6. Teste de Listagem e Download

#### 6.1 Listagem de Arquivos
1. Na página de gerenciamento:
   - Verifique se os arquivos aparecem na tabela
   - Teste os filtros por tipo (Notícias, Galeria, Vídeos)
   - Teste a busca por nome

#### 6.2 Visualização de Arquivos
1. Para cada arquivo na lista:
   - Clique no ícone de "Visualizar" (👁️)
   - **Verificar**: Arquivo abre em nova aba

#### 6.3 Download de Arquivos
1. Para cada arquivo na lista:
   - Clique no ícone de "Download" (⬇️)
   - **Verificar**: Download inicia automaticamente

### 7. Teste de Estatísticas

#### 7.1 Dashboard de Estatísticas
1. Na página de gerenciamento:
   - Verifique o painel de estatísticas no topo
   - **Verificar**:
     - ✅ Total de arquivos
     - ✅ Tamanho total
     - ✅ Contagem por tipo de mídia

### 8. Teste de Exclusão

#### 8.1 Excluir Arquivo
1. Na lista de arquivos:
   - Clique no ícone de "Excluir" (🗑️)
   - Confirme a exclusão
2. **Verificar**:
   - ✅ Arquivo removido da lista
   - ✅ Arquivo físico deletado do servidor
   - ✅ Registro removido do banco de dados

## 🔍 Verificações Técnicas

### 8.1 Verificar Estrutura de Pastas
```bash
# No diretório backend/uploads/
ls -la uploads/
ls -la uploads/news/
ls -la uploads/gallery/
ls -la uploads/videos/
ls -la uploads/thumbnails/
```

### 8.2 Verificar Logs do Servidor
- Monitore o console do backend para:
  - ✅ Criação de diretórios
  - ✅ Processamento de imagens
  - ✅ Validação de arquivos
  - ✅ Erros de upload

### 8.3 Verificar Respostas da API
```bash
# Teste de estatísticas
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3001/api/files/stats

# Teste de listagem
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3001/api/files/files/all
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. "Token de autenticação não encontrado"
- **Solução**: Faça login novamente no painel admin

#### 2. "Arquivo muito grande"
- **Solução**: Verifique os limites de tamanho por tipo de mídia

#### 3. "Tipo de arquivo não permitido"
- **Solução**: Use apenas formatos suportados (JPG, PNG, MP4, etc.)

#### 4. "Erro de conexão"
- **Solução**: Verifique se o backend está rodando na porta 3001

## ✅ Checklist de Validação

- [ ] Login no painel admin funciona
- [ ] Upload de imagem para notícias funciona
- [ ] Upload de imagem para galeria funciona
- [ ] Upload de vídeo funciona
- [ ] Progress bar aparece durante upload
- [ ] Arquivos aparecem na listagem
- [ ] Filtros por tipo funcionam
- [ ] Busca por nome funciona
- [ ] Visualização de arquivos funciona
- [ ] Download de arquivos funciona
- [ ] Estatísticas são atualizadas
- [ ] Exclusão de arquivos funciona
- [ ] Arquivos são salvos no banco de dados
- [ ] Arquivos físicos são criados nas pastas corretas
- [ ] Thumbnails são gerados para imagens

## 📊 Métricas de Sucesso

- **Taxa de sucesso de upload**: >95%
- **Tempo de processamento**: <30s para imagens, <2min para vídeos
- **Disponibilidade de arquivos**: 100% após upload
- **Integridade de dados**: 100% (metadados + arquivo físico)

---

**🎯 Objetivo**: Confirmar que todo o fluxo de upload → processamento → armazenamento → listagem → download → exclusão funciona corretamente. 