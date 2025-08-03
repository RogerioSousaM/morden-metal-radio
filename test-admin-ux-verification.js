const fetch = require('node-fetch')

const BASE_URL = 'http://localhost:3001'
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'mordenmetal2024'
}

async function login() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ADMIN_CREDENTIALS)
    })

    if (response.ok) {
      const data = await response.json()
      return data.token
    } else {
      throw new Error(`Login falhou: ${response.status}`)
    }
  } catch (error) {
    console.error('❌ Erro no login:', error.message)
    return null
  }
}

async function testAdminUXConsistency() {
  console.log('🎨 Verificando Consistência de UI/UX do Painel Admin...\n')

  const token = await login()
  if (!token) {
    console.log('❌ Não foi possível fazer login. Verifique se o backend está rodando.')
    return
  }

  console.log('✅ Login realizado com sucesso!\n')

  console.log('📋 CHECKLIST DE VERIFICAÇÃO MANUAL:\n')
  
  console.log('1️⃣ DASHBOARD (/admin/dashboard)')
  console.log('   ✅ Verificar se o título é "Dashboard"')
  console.log('   ✅ Verificar se há cards de estatísticas')
  console.log('   ✅ Verificar se há gráficos ou métricas')
  console.log('   ✅ Verificar se o menu lateral destaca "Dashboard" como ativo\n')

  console.log('2️⃣ GESTÃO DE BANDAS (/admin/bands)')
  console.log('   ✅ Verificar se o título é "Gestão de Bandas"')
  console.log('   ✅ Verificar se o subtítulo é "Gerencie as bandas em destaque do site"')
  console.log('   ✅ Verificar se o botão "Adicionar Banda" usa classe btn-primary')
  console.log('   ✅ Verificar se há animação no botão (hover/tap)')
  console.log('   ✅ Verificar se o menu lateral destaca "Bandas" como ativo\n')

  console.log('3️⃣ GESTÃO DE PROGRAMAÇÃO (/admin/schedule)')
  console.log('   ✅ Verificar se o título é "Gestão de Programação"')
  console.log('   ✅ Verificar se o subtítulo é "Gerencie a programação do site"')
  console.log('   ✅ Verificar se há botão de ação com classe btn-primary')
  console.log('   ✅ Verificar se o menu lateral destaca "Programação" como ativo\n')

  console.log('4️⃣ GESTÃO DE NOTÍCIAS (/admin/news)')
  console.log('   ✅ Verificar se o título é "Gestão de Notícias"')
  console.log('   ✅ Verificar se o subtítulo é "Gerencie as notícias do site"')
  console.log('   ✅ Verificar se o botão "Nova Notícia" usa classe btn-primary')
  console.log('   ✅ Verificar se há animação no botão (hover/tap)')
  console.log('   ✅ Verificar se o menu lateral destaca "Notícias" como ativo\n')

  console.log('5️⃣ GESTÃO DE USUÁRIOS (/admin/users)')
  console.log('   ✅ Verificar se o título é "Gestão de Usuários"')
  console.log('   ✅ Verificar se o subtítulo é "Gerencie os usuários do sistema"')
  console.log('   ✅ Verificar se o botão "Novo Usuário" usa classe btn-primary')
  console.log('   ✅ Verificar se há animação no botão (hover/tap)')
  console.log('   ✅ Verificar se o menu lateral destaca "Usuários" como ativo\n')

  console.log('6️⃣ GESTÃO DE ARQUIVOS (/admin/files)')
  console.log('   ✅ Verificar se o título é "Gestão de Arquivos"')
  console.log('   ✅ Verificar se o subtítulo é "Gerencie os arquivos do sistema"')
  console.log('   ✅ Verificar se o botão "Novo Upload" usa classe btn-primary')
  console.log('   ✅ Verificar se há animação no botão (hover/tap)')
  console.log('   ✅ Verificar se o menu lateral destaca "Arquivos" como ativo\n')

  console.log('7️⃣ GESTÃO DO CARROSSEL (/admin/carousel)')
  console.log('   ✅ Verificar se o título é "Gestão do Carrossel"')
  console.log('   ✅ Verificar se o subtítulo é "Gerencie os slides do carrossel principal do site"')
  console.log('   ✅ Verificar se o botão "Adicionar Slide" usa classe btn-primary')
  console.log('   ✅ Verificar se há animação no botão (hover/tap)')
  console.log('   ✅ Verificar se o menu lateral destaca "Carrossel" como ativo\n')

  console.log('8️⃣ GESTÃO DO TOP DO MÊS (/admin/top-month)')
  console.log('   ✅ Verificar se o título é "Gestão do Top do Mês"')
  console.log('   ✅ Verificar se o subtítulo é "Configure a banda em destaque do mês"')
  console.log('   ✅ Verificar se o botão "Configurar Top do Mês" usa classe btn-primary')
  console.log('   ✅ Verificar se há animação no botão (hover/tap)')
  console.log('   ✅ Verificar se o menu lateral destaca "Top do Mês" como ativo\n')

  console.log('9️⃣ GESTÃO DE LINKS SOCIAIS (/admin/social-links)')
  console.log('   ✅ Verificar se o título é "Gestão de Links Sociais"')
  console.log('   ✅ Verificar se o subtítulo é "Configure os links das redes sociais"')
  console.log('   ✅ Verificar se há botões "Salvar" e "Resetar" com classes apropriadas')
  console.log('   ✅ Verificar se há animação nos botões (hover/tap)')
  console.log('   ✅ Verificar se o menu lateral destaca "Links Sociais" como ativo\n')

  console.log('🔟 GESTÃO DE CONFIGURAÇÕES (/admin/settings)')
  console.log('   ✅ Verificar se o título é "Gestão de Configurações"')
  console.log('   ✅ Verificar se o subtítulo é "Gerencie as configurações do sistema"')
  console.log('   ✅ Verificar se há botões "Salvar" e "Resetar" com classes apropriadas')
  console.log('   ✅ Verificar se há animação nos botões (hover/tap)')
  console.log('   ✅ Verificar se o menu lateral destaca "Configurações" como ativo\n')

  console.log('🎯 PADRÕES GERAIS A VERIFICAR:')
  console.log('   ✅ Todos os títulos usam: text-3xl font-bold tracking-widest uppercase mb-2')
  console.log('   ✅ Todos os subtítulos usam: text-metal-text-secondary')
  console.log('   ✅ Todos os botões principais usam: btn-primary')
  console.log('   ✅ Todos os headers têm animação: motion.div com initial/animate/transition')
  console.log('   ✅ Todos os botões têm animação: whileHover/whileTap')
  console.log('   ✅ Todos os containers usam: p-6')
  console.log('   ✅ Menu lateral destaca corretamente o item ativo')
  console.log('   ✅ Navegação funciona em desktop e mobile')
  console.log('   ✅ Espaçamentos e tamanhos são consistentes\n')

  console.log('🚀 INSTRUÇÕES PARA TESTE:')
  console.log('1. Abra o painel admin em: http://localhost:5173/login')
  console.log('2. Faça login com: admin / mordenmetal2024')
  console.log('3. Navegue por cada menu usando o menu lateral')
  console.log('4. Verifique cada item do checklist acima')
  console.log('5. Teste em modo desktop e mobile (F12 → Device Toolbar)')
  console.log('6. Verifique se todos os botões funcionam corretamente\n')

  console.log('📝 RESULTADO ESPERADO:')
  console.log('   ✅ Todas as páginas seguem o mesmo padrão visual')
  console.log('   ✅ Todos os títulos e subtítulos estão padronizados')
  console.log('   ✅ Todos os botões têm o mesmo estilo e animações')
  console.log('   ✅ Menu lateral funciona corretamente em todas as resoluções')
  console.log('   ✅ Navegação é intuitiva e responsiva\n')

  console.log('🔧 SE ENCONTRAR PROBLEMAS:')
  console.log('   - Verifique se o frontend-admin está rodando: npm run dev')
  console.log('   - Verifique se o backend está rodando: npm run dev')
  console.log('   - Verifique se não há erros no console do navegador')
  console.log('   - Verifique se não há erros no terminal do frontend\n')
}

// Executar o teste
testAdminUXConsistency().catch(console.error) 