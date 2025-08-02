# 🎛️ Guia do Painel Administrativo - Morden Metal

## 📋 Visão Geral

O painel administrativo do Morden Metal é uma interface completa para gerenciar todo o conteúdo da rádio, incluindo bandas, programação, usuários e configurações do sistema.

## 🔐 Autenticação e Segurança

### Login
- **URL**: `/admin/login`
- **Credenciais de Demonstração**:
  - Usuário: `admin`
  - Senha: `mordenmetal2024`

### Medidas de Segurança Implementadas
- ✅ **JWT Tokens**: Autenticação segura com expiração
- ✅ **bcrypt**: Senhas criptografadas
- ✅ **Validação de Entrada**: Proteção contra XSS e SQL Injection
- ✅ **Rate Limiting**: Proteção contra ataques de força bruta
- ✅ **CORS Restrito**: Apenas origens confiáveis
- ✅ **Headers de Segurança**: Helmet.js para proteção adicional

## 🎯 Módulos Disponíveis

### 1. Dashboard Principal
**Localização**: `/admin/dashboard`

**Funcionalidades**:
- 📊 Estatísticas em tempo real
- 👥 Número de ouvintes online
- 🏆 Banda mais tocada do mês
- ⏰ Próximo programa ao vivo
- ⚠️ Alertas do sistema
- 🚀 Ações rápidas
- 📈 Atividade recente

### 2. Gestão de Bandas
**Localização**: `/admin/bands`

**Funcionalidades**:
- ➕ Adicionar nova banda
- ✏️ Editar bandas existentes
- 🗑️ Remover bandas
- ⭐ Marcar como destaque
- 📊 Gerenciar avaliações
- 👥 Atualizar número de ouvintes

**Campos Obrigatórios**:
- Nome da banda (máx. 100 caracteres)
- Gênero musical (máx. 50 caracteres)
- Descrição (máx. 300 caracteres)
- URL da imagem

**Campos Opcionais**:
- Número de ouvintes
- Avaliação (0-5)
- Marcar como destaque

### 3. Gestão da Programação
**Localização**: `/admin/schedule`

**Funcionalidades**:
- ➕ Adicionar novo programa
- ✏️ Editar programas existentes
- 🗑️ Remover programas
- 🔴 Marcar como ao vivo
- ⏰ Verificação automática de conflitos de horário
- 👤 Gerenciar apresentadores

**Campos Obrigatórios**:
- Nome do programa (máx. 100 caracteres)
- Horário de início (formato HH:MM)
- Horário de fim (formato HH:MM)
- Apresentador (máx. 50 caracteres)
- Gênero musical (máx. 50 caracteres)
- Descrição (máx. 300 caracteres)

**Validações Automáticas**:
- ✅ Horário de início < Horário de fim
- ✅ Sem conflitos de horário
- ✅ Formato de horário válido

### 4. Gestão de Usuários (Futuro)
**Localização**: `/admin/users`

**Funcionalidades Planejadas**:
- 👥 Gerenciar administradores
- 🔐 Definir níveis de permissão
- 📧 Reset de senhas
- 📊 Logs de atividade

### 5. Configurações (Futuro)
**Localização**: `/admin/settings`

**Funcionalidades Planejadas**:
- ⚙️ Configurações do site
- 🎵 Configurações de streaming
- 📧 Configurações de email
- 🔧 Manutenção do sistema

## 🛠️ Funcionalidades Técnicas

### Validação de Dados
- **Sanitização**: Remoção de caracteres perigosos (<, >)
- **Limites**: Validação de tamanho máximo de campos
- **Formato**: Validação de formatos (horários, URLs)
- **Conflitos**: Verificação automática de conflitos de horário

### Interface Responsiva
- 📱 **Mobile**: Sidebar colapsável, formulários otimizados
- 💻 **Desktop**: Layout completo com sidebar fixa
- 📊 **Tablet**: Adaptação automática do grid

### Animações e UX
- ✨ **Framer Motion**: Animações suaves
- 🎯 **Feedback Visual**: Estados de loading, sucesso, erro
- 🔄 **Auto-save**: Salvamento automático de formulários
- 📱 **Touch-friendly**: Otimizado para dispositivos touch

## 🔧 Configuração do Backend

### Instalação
```bash
cd server
npm install
```

### Variáveis de Ambiente
Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12
ALLOWED_ORIGINS=http://localhost:5173
```

### Execução
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário

### Bandas
- `GET /api/bands` - Listar bandas
- `POST /api/bands` - Criar banda
- `PUT /api/bands/:id` - Atualizar banda
- `DELETE /api/bands/:id` - Remover banda

### Programação
- `GET /api/programs` - Listar programas
- `POST /api/programs` - Criar programa
- `PUT /api/programs/:id` - Atualizar programa
- `DELETE /api/programs/:id` - Remover programa

### Estatísticas
- `GET /api/stats` - Estatísticas gerais
- `GET /api/stream` - Status do streaming

## 🚀 Próximas Implementações

### Funcionalidades Planejadas
- [ ] Upload de imagens
- [ ] Editor WYSIWYG para descrições
- [ ] Sistema de notificações push
- [ ] Backup automático de dados
- [ ] Logs detalhados de atividade
- [ ] Integração com redes sociais
- [ ] Analytics avançado
- [ ] Sistema de backup/restore

### Melhorias de Segurança
- [ ] Autenticação de dois fatores (2FA)
- [ ] Logs de auditoria
- [ ] Detecção de atividades suspeitas
- [ ] Backup criptografado
- [ ] Monitoramento de performance

## 🆘 Suporte e Troubleshooting

### Problemas Comuns

**1. Erro de Login**
- Verificar credenciais
- Limpar cache do navegador
- Verificar se o backend está rodando

**2. Conflito de Horários**
- Verificar se não há sobreposição
- Usar horários diferentes
- Verificar formato HH:MM

**3. Imagens não Carregam**
- Verificar URL da imagem
- Usar URLs HTTPS
- Verificar se a imagem é pública

### Logs e Debug
- Verificar console do navegador (F12)
- Verificar logs do servidor
- Verificar Network tab para requisições

## 📞 Contato

Para suporte técnico ou dúvidas sobre o painel administrativo, entre em contato com a equipe de desenvolvimento.

---

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024  
**Desenvolvido por**: Equipe Morden Metal 