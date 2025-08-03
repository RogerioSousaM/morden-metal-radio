# 🎛️ Guia de Validação do Painel de Administração

## 📋 Visão Geral

Este guia fornece instruções detalhadas para validar todas as funcionalidades do painel de administração da Morden Metal Radio.

## 🚀 Pré-requisitos

1. **Backend rodando:** `http://localhost:3001`
2. **Frontend Admin rodando:** `http://localhost:5174`
3. **Frontend User rodando:** `http://localhost:5173`
4. **Banco de dados:** SQLite configurado e migrado

## 🔐 1. Validação de Login

### 1.1 Teste de Credenciais Válidas
- **URL:** `http://localhost:5174`
- **Usuário:** `admin`
- **Senha:** `mordenmetal2024`
- **Resultado esperado:** Redirecionamento para `/admin/dashboard`

### 1.2 Teste de Credenciais Inválidas
- **Usuário:** `admin`
- **Senha:** `senhaerrada`
- **Resultado esperado:** Mensagem "Credenciais inválidas. Tente novamente."

### 1.3 Teste de Campos Vazios
- Deixar campos em branco e tentar submeter
- **Resultado esperado:** Validação HTML impedindo submissão

## 🏠 2. Dashboard Principal

### 2.1 Carregamento da Página
- **URL:** `http://localhost:5174/admin/dashboard`
- **Verificar:**
  - ✅ Título "Dashboard" visível
  - ✅ Estatísticas carregando (listeners, bandas, programas)
  - ✅ Cards de estatísticas com valores
  - ✅ Loading spinner durante carregamento

### 2.2 Menu Lateral
- **Verificar itens do menu:**
  - ✅ Dashboard
  - ✅ Bandas
  - ✅ Programação
  - ✅ Notícias
  - ✅ Usuários
  - ✅ Arquivos
  - ✅ Configurações

### 2.3 Navegação
- Clicar em cada item do menu
- **Resultado esperado:** Redirecionamento correto para cada seção

## 🎵 3. Gerenciamento de Bandas

### 3.1 Listagem
- **URL:** `http://localhost:5174/admin/bands`
- **Verificar:**
  - ✅ Tabela com bandas existentes
  - ✅ Colunas: Nome, Gênero, Avaliação, Status
  - ✅ Botões de ação (Editar, Excluir)

### 3.2 Criação de Nova Banda
1. Clicar em "Nova Banda"
2. Preencher formulário:
   - **Nome:** "Teste Banda"
   - **Gênero:** "Metal"
   - **Descrição:** "Banda de teste"
   - **Avaliação:** 4.5
3. Clicar em "Criar"
- **Resultado esperado:** Nova banda aparece na lista

### 3.3 Edição de Banda
1. Clicar no ícone de editar em uma banda
2. Modificar campos
3. Clicar em "Atualizar"
- **Resultado esperado:** Alterações salvas

### 3.4 Exclusão de Banda
1. Clicar no ícone de excluir
2. Confirmar exclusão
- **Resultado esperado:** Banda removida da lista

### 3.5 Busca e Filtros
- Testar campo de busca
- Testar filtro por gênero
- **Resultado esperado:** Lista filtrada corretamente

## 📅 4. Gerenciamento de Programação

### 4.1 Listagem
- **URL:** `http://localhost:5174/admin/schedule`
- **Verificar:**
  - ✅ Tabela com programas
  - ✅ Colunas: Título, Horário, Host, Gênero

### 4.2 Criação de Novo Programa
1. Clicar em "Novo Programa"
2. Preencher formulário:
   - **Título:** "Show de Metal"
   - **Horário de Início:** "20:00"
   - **Horário de Fim:** "22:00"
   - **Host:** "DJ Metal"
   - **Gênero:** "Metal"
3. Clicar em "Criar"
- **Resultado esperado:** Novo programa na lista

### 4.3 Validação de Conflitos
- Tentar criar programa com horário conflitante
- **Resultado esperado:** Mensagem de erro sobre conflito

## 📰 5. Gerenciamento de Notícias

### 5.1 Listagem
- **URL:** `http://localhost:5174/admin/news`
- **Verificar:**
  - ✅ Tabela com notícias
  - ✅ Colunas: Título, Autor, Status, Data

### 5.2 Criação de Nova Notícia
1. Clicar em "Nova Notícia"
2. Preencher formulário:
   - **Título:** "Nova Notícia Metal"
   - **Conteúdo:** "Conteúdo da notícia..."
   - **Autor:** "Admin"
   - **URL da Imagem:** (opcional)
   - **Publicar imediatamente:** ✅
3. Clicar em "Criar"
- **Resultado esperado:** Nova notícia na lista

### 5.3 Status de Publicação
- Criar notícia como rascunho
- **Resultado esperado:** Status "Rascunho" na lista
- Editar e marcar como publicada
- **Resultado esperado:** Status "Publicada"

### 5.4 Busca e Filtros
- Testar busca por título/conteúdo
- Testar filtro por status (Todas/Publicadas/Rascunhos)

## 👥 6. Gerenciamento de Usuários

### 6.1 Listagem
- **URL:** `http://localhost:5174/admin/users`
- **Verificar:**
  - ✅ Tabela com usuários
  - ✅ Colunas: Usuário, Função, Data de Criação

### 6.2 Criação de Novo Usuário
1. Clicar em "Novo Usuário"
2. Preencher formulário:
   - **Nome de Usuário:** "teste"
   - **Senha:** "123456"
   - **Função:** "Usuário"
3. Clicar em "Criar"
- **Resultado esperado:** Novo usuário na lista

### 6.3 Edição de Usuário
1. Clicar em editar usuário
2. Modificar função para "Moderador"
3. Clicar em "Atualizar"
- **Resultado esperado:** Função alterada

### 6.4 Validação de Senha
- Editar usuário sem alterar senha
- **Resultado esperado:** Senha mantida
- Editar com nova senha
- **Resultado esperado:** Senha alterada

### 6.5 Proteção de Admin
- Tentar excluir usuário admin
- **Resultado esperado:** Erro "Não é possível deletar um administrador"

## 📁 7. Gerenciamento de Arquivos

### 7.1 Listagem
- **URL:** `http://localhost:5174/admin/files`
- **Verificar:**
  - ✅ Estatísticas de arquivos
  - ✅ Seções: Notícias, Galeria, Vídeos

### 7.2 Upload de Imagem
1. Selecionar seção "Notícias"
2. Arrastar ou selecionar imagem
3. Aguardar upload
- **Resultado esperado:** Imagem aparece na lista

### 7.3 Validação de Tipos
- Tentar upload de arquivo .exe
- **Resultado esperado:** Erro de tipo não permitido

### 7.4 Validação de Tamanho
- Tentar upload de arquivo muito grande
- **Resultado esperado:** Erro de tamanho máximo

### 7.5 Exclusão de Arquivo
1. Clicar em excluir arquivo
2. Confirmar exclusão
- **Resultado esperado:** Arquivo removido

## 🔒 8. Segurança e Permissões

### 8.1 Acesso Não Autorizado
- Tentar acessar `/admin/dashboard` sem login
- **Resultado esperado:** Redirecionamento para login

### 8.2 Token Expirado
- Remover token do localStorage
- Tentar acessar área protegida
- **Resultado esperado:** Redirecionamento para login

### 8.3 Logout
1. Clicar em "Sair" no menu
- **Resultado esperado:** Redirecionamento para login

## 📱 9. Responsividade

### 9.1 Desktop
- **Resolução:** 1920x1080
- **Verificar:** Layout completo, menu lateral visível

### 9.2 Tablet
- **Resolução:** 768x1024
- **Verificar:** Menu lateral colapsável

### 9.3 Mobile
- **Resolução:** 375x667
- **Verificar:** Menu hambúrguer, layout adaptado

## 🐛 10. Tratamento de Erros

### 10.1 Erro de Rede
- Desconectar internet
- Tentar operação CRUD
- **Resultado esperado:** Mensagem de erro amigável

### 10.2 Erro de Servidor
- Parar backend
- Tentar operação
- **Resultado esperado:** Mensagem de erro com opção de retry

### 10.3 Validação de Formulários
- Submeter formulários vazios
- **Resultado esperado:** Validação HTML e mensagens de erro

## 📊 11. Performance

### 11.1 Tempo de Carregamento
- Medir tempo de carregamento inicial
- **Resultado esperado:** < 3 segundos

### 11.2 Carregamento de Listas
- Medir tempo de carregamento de tabelas
- **Resultado esperado:** < 2 segundos

### 11.3 Operações CRUD
- Medir tempo de criação/edição/exclusão
- **Resultado esperado:** < 1 segundo

## 🔄 12. Integração com Frontend User

### 12.1 Sincronização de Dados
1. Criar nova banda no admin
2. Verificar se aparece no frontend user
- **Resultado esperado:** Dados sincronizados

### 12.2 Notícias Publicadas
1. Publicar notícia no admin
2. Verificar se aparece no frontend user
- **Resultado esperado:** Notícia visível

## 📝 13. Checklist Final

### ✅ Funcionalidades Básicas
- [ ] Login funcionando
- [ ] Dashboard carregando
- [ ] Menu lateral completo
- [ ] Navegação entre seções

### ✅ CRUD Operations
- [ ] Criação de bandas
- [ ] Edição de bandas
- [ ] Exclusão de bandas
- [ ] Criação de programas
- [ ] Criação de notícias
- [ ] Criação de usuários
- [ ] Upload de arquivos

### ✅ Validações
- [ ] Formulários validando
- [ ] Mensagens de erro
- [ ] Confirmações de exclusão
- [ ] Validação de tipos de arquivo

### ✅ Segurança
- [ ] Acesso protegido
- [ ] Logout funcionando
- [ ] Tokens expirando
- [ ] Permissões de admin

### ✅ UX/UI
- [ ] Design responsivo
- [ ] Loading states
- [ ] Feedback visual
- [ ] Navegação intuitiva

## 🎯 Resultado Esperado

Após completar todos os testes, o painel de administração deve estar:
- ✅ **Totalmente funcional** para gerenciar todo o conteúdo
- ✅ **Seguro** com autenticação e autorização
- ✅ **Responsivo** em todos os dispositivos
- ✅ **Integrado** com o frontend de usuários
- ✅ **Pronto para produção** com tratamento de erros

## 📞 Suporte

Se encontrar problemas durante a validação:
1. Verificar console do navegador
2. Verificar logs do backend
3. Verificar status do banco de dados
4. Consultar documentação técnica 