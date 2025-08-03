# 🔍 Guia de Validação Manual - Frontends

## 📋 Status dos Serviços

### ✅ Serviços Iniciados
- **Backend**: `http://localhost:3001` ✅
- **Frontend User**: `http://localhost:5173` ✅
- **Frontend Admin**: `http://localhost:5174` ✅

---

## 🏠 **VALIDAÇÃO DO FRONTEND USER** (`http://localhost:5173`)

### 1. **Página Inicial (Home)**

#### ✅ Teste de Carregamento
1. Abra `http://localhost:5173`
2. **Verificar**:
   - [ ] Página carrega sem erros
   - [ ] Console do navegador sem erros JavaScript
   - [ ] Título da página correto
   - [ ] Loading state adequado

#### ✅ Teste de Navegação
1. **Header/Menu**:
   - [ ] Logo da rádio visível
   - [ ] Menu de navegação funcional
   - [ ] Links para: Home, Notícias, Galeria, Vídeos, Contato
   - [ ] Botão "Ouvir Agora" funciona

2. **Hero Section**:
   - [ ] Imagem de fundo carrega
   - [ ] Título principal visível
   - [ ] Descrição da rádio
   - [ ] Call-to-action buttons

3. **Seção de Bandas**:
   - [ ] Lista de bandas em destaque
   - [ ] Cards com imagens das bandas
   - [ ] Clique nos cards abre detalhes
   - [ ] Informações: nome, gênero, descrição

4. **Programação**:
   - [ ] Grid de programação da semana
   - [ ] Horários e nomes dos programas
   - [ ] Hover effects funcionais
   - [ ] Informações detalhadas ao clicar

5. **Footer**:
   - [ ] Links de contato funcionais
   - [ ] Redes sociais
   - [ ] Informações da rádio

#### ✅ Teste de Responsividade
1. **Desktop (1920x1080)**:
   - [ ] Layout completo visível
   - [ ] Menu horizontal
   - [ ] Grid de 3-4 colunas

2. **Tablet (768x1024)**:
   - [ ] Menu adaptado
   - [ ] Grid de 2 colunas
   - [ ] Elementos redimensionados

3. **Mobile (375x667)**:
   - [ ] Menu hambúrguer
   - [ ] Grid de 1 coluna
   - [ ] Touch-friendly buttons

### 2. **Página de Notícias**

#### ✅ Teste de Listagem
1. Navegue para `/noticias` ou clique no menu
2. **Verificar**:
   - [ ] Lista de notícias carrega
   - [ ] Cards com título, resumo, data
   - [ ] Imagens das notícias
   - [ ] Paginação (se houver)

#### ✅ Teste de Filtros e Busca
1. **Filtros**:
   - [ ] Por categoria (Metal, Rock, Eventos)
   - [ ] Por data (Última semana, mês, ano)
   - [ ] Por relevância

2. **Busca**:
   - [ ] Campo de busca funcional
   - [ ] Resultados em tempo real
   - [ ] Mensagem "Nenhum resultado"

#### ✅ Teste de Detalhes da Notícia
1. Clique em uma notícia
2. **Verificar**:
   - [ ] Imagem principal carrega
   - [ ] Título e conteúdo formatados
   - [ ] Metadados: autor, data, categoria
   - [ ] Tags clicáveis
   - [ ] Botões de compartilhamento

#### ✅ Teste de Comentários
1. **Sistema de comentários**:
   - [ ] Lista de comentários existentes
   - [ ] Formulário para novo comentário
   - [ ] Validação de campos obrigatórios
   - [ ] Envio de comentário funciona
   - [ ] Comentário aparece na lista

2. **Interações**:
   - [ ] Like/Dislike nos comentários
   - [ ] Respostas aos comentários
   - [ ] Moderação (aprovados/rejeitados)

### 3. **Galeria de Imagens**

#### ✅ Teste de Visualização
1. Navegue para `/galeria`
2. **Verificar**:
   - [ ] Grid de imagens responsivo
   - [ ] Thumbnails carregam rapidamente
   - [ ] Filtros por categoria/data
   - [ ] Busca por descrição/tags

#### ✅ Teste de Interações
1. **Clique na imagem**:
   - [ ] Abre modal/lightbox
   - [ ] Imagem em tamanho completo
   - [ ] Navegação: próxima/anterior
   - [ ] Botão de fechar

2. **Funcionalidades**:
   - [ ] Zoom na imagem
   - [ ] Download da imagem
   - [ ] Compartilhamento
   - [ ] Informações da imagem

### 4. **Página de Vídeos**

#### ✅ Teste de Listagem
1. Navegue para `/videos`
2. **Verificar**:
   - [ ] Grid de vídeos com thumbnails
   - [ ] Títulos e descrições
   - [ ] Duração dos vídeos
   - [ ] Filtros por categoria

#### ✅ Teste do Player
1. Clique em um vídeo
2. **Verificar**:
   - [ ] Player carrega corretamente
   - [ ] Play/pause funciona
   - [ ] Controles de volume
   - [ ] Barra de progresso
   - [ ] Fullscreen
   - [ ] Qualidade (se disponível)

### 5. **Página de Contato**

#### ✅ Teste do Formulário
1. Navegue para `/contato`
2. **Verificar**:
   - [ ] Formulário completo
   - [ ] Campos: nome, email, assunto, mensagem
   - [ ] Validação de campos obrigatórios
   - [ ] Validação de email
   - [ ] Envio do formulário
   - [ ] Confirmação de envio

#### ✅ Teste de Informações
1. **Dados de contato**:
   - [ ] Endereço da rádio
   - [ ] Telefone (link funcional)
   - [ ] Email (link funcional)
   - [ ] Redes sociais
   - [ ] Horário de funcionamento

---

## ⚙️ **VALIDAÇÃO DO FRONTEND ADMIN** (`http://localhost:5174`)

### 1. **Sistema de Login**

#### ✅ Teste de Autenticação
1. Acesse `http://localhost:5174`
2. **Verificar**:
   - [ ] Página de login carrega
   - [ ] Formulário com campos: usuário, senha
   - [ ] Validação de campos obrigatórios

#### ✅ Teste de Credenciais
1. **Credenciais incorretas**:
   - [ ] Usuário: `wronguser`, Senha: `wrongpass`
   - [ ] Mensagem de erro exibida
   - [ ] Formulário não é enviado

2. **Credenciais corretas**:
   - [ ] Usuário: `admin`, Senha: `mordenmetal2024`
   - [ ] Login bem-sucedido
   - [ ] Redirecionamento para dashboard
   - [ ] Token JWT armazenado

#### ✅ Teste de Segurança
1. **Proteção de rotas**:
   - [ ] Tentar acessar `/dashboard` sem login
   - [ ] Redirecionamento para login
   - [ ] Token expirado = logout automático

### 2. **Dashboard Principal**

#### ✅ Teste de Estatísticas
1. Após login, verificar dashboard
2. **Verificar**:
   - [ ] Cards de estatísticas carregam
   - [ ] Dados atualizados em tempo real
   - [ ] Gráficos funcionais (se houver)
   - [ ] Loading states adequados

#### ✅ Teste de Ações Rápidas
1. **Botões de ação**:
   - [ ] "Adicionar Banda" → redireciona
   - [ ] "Gerenciar Arquivos" → redireciona
   - [ ] "Ver Estatísticas" → redireciona
   - [ ] "Configurações" → redireciona

### 3. **Gerenciamento de Bandas**

#### ✅ Teste de Listagem
1. Navegue para "Gerenciamento de Bandas"
2. **Verificar**:
   - [ ] Tabela com bandas carrega
   - [ ] Colunas: Nome, Gênero, Status, Ações
   - [ ] Filtros por gênero/status
   - [ ] Busca por nome
   - [ ] Paginação

#### ✅ Teste de CRUD
1. **Criar Banda**:
   - [ ] Botão "Adicionar Nova Banda"
   - [ ] Formulário completo
   - [ ] Upload de imagem funciona
   - [ ] Validação de campos
   - [ ] Salvamento bem-sucedido

2. **Editar Banda**:
   - [ ] Botão "Editar" na tabela
   - [ ] Dados pré-preenchidos
   - [ ] Modificação de dados
   - [ ] Salvamento das alterações

3. **Excluir Banda**:
   - [ ] Botão "Excluir" na tabela
   - [ ] Confirmação de exclusão
   - [ ] Banda removida da lista
   - [ ] Dados removidos do banco

### 4. **Gerenciamento de Programação**

#### ✅ Teste de Listagem
1. Navegue para "Gerenciamento de Programação"
2. **Verificar**:
   - [ ] Grid de programas
   - [ ] Informações: nome, horário, dia
   - [ ] Filtros por dia/horário
   - [ ] Busca por nome

#### ✅ Teste de Operações
1. **Criar Programa**:
   - [ ] Formulário de criação
   - [ ] Seleção de horário/dia
   - [ ] Descrição do programa
   - [ ] Salvamento

2. **Editar Programa**:
   - [ ] Modificação de dados
   - [ ] Alteração de horário
   - [ ] Salvamento

3. **Excluir Programa**:
   - [ ] Confirmação
   - [ ] Remoção da lista

### 5. **Gerenciamento de Arquivos**

#### ✅ Teste de Upload
1. Navegue para "Gerenciamento de Arquivos"
2. **Verificar**:
   - [ ] Seção de upload visível
   - [ ] Drag & drop funciona
   - [ ] Seleção de arquivos
   - [ ] Progress bar durante upload
   - [ ] Validação de tipo/tamanho

#### ✅ Teste de Gerenciamento
1. **Listagem**:
   - [ ] Arquivos organizados
   - [ ] Filtros por tipo
   - [ ] Busca por nome
   - [ ] Paginação

2. **Ações**:
   - [ ] Visualização de imagens/vídeos
   - [ ] Download de arquivos
   - [ ] Exclusão com confirmação
   - [ ] Edição de metadados

#### ✅ Teste de Estatísticas
1. **Dashboard de arquivos**:
   - [ ] Total de arquivos
   - [ ] Tamanho total
   - [ ] Distribuição por tipo
   - [ ] Arquivos em destaque

### 6. **Gerenciamento de Notícias**

#### ✅ Teste de Listagem
1. Navegue para "Gerenciamento de Notícias"
2. **Verificar**:
   - [ ] Tabela de notícias
   - [ ] Status: Publicada/Rascunho
   - [ ] Filtros por status/categoria
   - [ ] Busca por título

#### ✅ Teste de Editor
1. **Criar Notícia**:
   - [ ] Editor de texto
   - [ ] Upload de imagens
   - [ ] Seleção de categorias
   - [ ] Sistema de tags
   - [ ] Preview da notícia

### 7. **Gerenciamento de Usuários**

#### ✅ Teste de Listagem
1. Navegue para "Gerenciamento de Usuários"
2. **Verificar**:
   - [ ] Tabela de usuários
   - [ ] Dados sensíveis ocultos
   - [ ] Filtros por role/status
   - [ ] Busca por nome/email

#### ✅ Teste de Operações
1. **Criar Usuário**:
   - [ ] Formulário completo
   - [ ] Seleção de role (Admin/User)
   - [ ] Validação de email
   - [ ] Geração de senha

2. **Editar Usuário**:
   - [ ] Modificação de dados
   - [ ] Alteração de role
   - [ ] Reset de senha

3. **Excluir Usuário**:
   - [ ] Confirmação
   - [ ] Remoção da lista

### 8. **Configurações do Sistema**

#### ✅ Teste de Configurações Gerais
1. Navegue para "Configurações"
2. **Verificar**:
   - [ ] Informações da rádio
   - [ ] Dados de contato
   - [ ] Links de redes sociais
   - [ ] Salvamento de configurações

#### ✅ Teste de Configurações de Upload
1. **Limites de arquivo**:
   - [ ] Tamanho máximo configurável
   - [ ] Tipos permitidos
   - [ ] Qualidade de imagem

#### ✅ Teste de Configurações de Segurança
1. **Política de senhas**:
   - [ ] Comprimento mínimo
   - [ ] Complexidade
   - [ ] Expiração

2. **Sessão**:
   - [ ] Timeout configurável
   - [ ] Logout automático

---

## 🔒 **VALIDAÇÃO DE PERMISSÕES**

### ✅ Teste de Usuário Comum
1. **Acesso ao Admin**:
   - [ ] Tentar acessar `http://localhost:5174`
   - [ ] Redirecionamento para login
   - [ ] Mensagem de acesso negado

2. **Funcionalidades Limitadas**:
   - [ ] Apenas visualização
   - [ ] Sem botões de edição/exclusão
   - [ ] Sem acesso a configurações

### ✅ Teste de Administrador
1. **Acesso Total**:
   - [ ] Todas as funcionalidades disponíveis
   - [ ] CRUD completo
   - [ ] Configurações acessíveis

### ✅ Teste de Sessão Expirada
1. **Token Expirado**:
   - [ ] Aguardar expiração do token
   - [ ] Tentar fazer ação
   - [ ] Redirecionamento para login
   - [ ] Mensagem "Sessão expirada"

---

## 🐛 **DETECÇÃO DE ERROS**

### ✅ Console do Navegador
1. **Abrir DevTools** (F12)
2. **Verificar Console**:
   - [ ] JavaScript errors
   - [ ] Network errors
   - [ ] CORS errors
   - [ ] 404 errors

### ✅ Network Tab
1. **Verificar Requisições**:
   - [ ] API calls bem-sucedidas
   - [ ] Status codes corretos
   - [ ] Tempo de resposta
   - [ ] Dados retornados

### ✅ Backend Logs
1. **Verificar Terminal do Backend**:
   - [ ] Server errors (500)
   - [ ] Database errors
   - [ ] Validation errors
   - [ ] Authentication errors

---

## 📊 **CHECKLIST FINAL**

### Frontend User
- [ ] Página inicial carrega sem erros
- [ ] Navegação entre páginas funciona
- [ ] Formulários validam corretamente
- [ ] Imagens e vídeos carregam
- [ ] Sistema de comentários funciona
- [ ] Responsividade em todos os dispositivos

### Frontend Admin
- [ ] Login funciona corretamente
- [ ] Dashboard exibe estatísticas
- [ ] CRUD operations funcionam
- [ ] Upload de arquivos funciona
- [ ] Sistema de permissões funciona
- [ ] Logout remove sessão

### Integração
- [ ] API calls funcionam
- [ ] Dados são sincronizados
- [ ] Erros são tratados
- [ ] Loading states funcionam
- [ ] Feedback ao usuário é claro

---

## 📝 **RELATÓRIO DE VALIDAÇÃO**

### Data: _______________
### Validador: _______________

### ✅ Funcionalidades Testadas
- [ ] Frontend User: ___/___ funcionalidades
- [ ] Frontend Admin: ___/___ funcionalidades
- [ ] Integração: ___/___ endpoints

### ❌ Problemas Encontrados
1. **Problema**: _______________
   - **Localização**: _______________
   - **Severidade**: _______________
   - **Solução**: _______________

2. **Problema**: _______________
   - **Localização**: _______________
   - **Severidade**: _______________
   - **Solução**: _______________

### 📈 Métricas de Performance
- **Tempo de carregamento médio**: ___s
- **Taxa de erro**: ___%
- **Usabilidade**: ___/10

### 🎯 Conclusão
- **Status geral**: _______________
- **Pronto para produção**: _______________
- **Próximos passos**: _______________

---

**🎯 Objetivo**: Garantir que todos os frontends funcionem perfeitamente e estejam integrados com o backend. 