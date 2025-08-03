const puppeteer = require('puppeteer')

async function testDashboardFix() {
  console.log('🔧 Testando correções da dashboard...')
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  })

  try {
    const page = await browser.newPage()
    
    // Capturar logs do console
    page.on('console', msg => {
      console.log('📱 Console:', msg.text())
    })
    
    // Capturar erros
    page.on('pageerror', error => {
      console.log('❌ Erro da página:', error.message)
    })
    
    // Teste 1: Acessar o painel admin
    console.log('1️⃣ Acessando http://localhost:5174/admin/login...')
    await page.goto('http://localhost:5174/admin/login', { waitUntil: 'networkidle0' })
    
    // Aguardar carregamento
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Verificar se a página carregou
    const title = await page.title()
    console.log('📄 Título da página:', title)
    
    // Teste 2: Preencher credenciais
    console.log('2️⃣ Preenchendo credenciais...')
    await page.type('input[type="text"]', 'admin')
    await page.type('input[type="password"]', 'mordenmetal2024')
    
    // Teste 3: Fazer login
    console.log('3️⃣ Clicando no botão de login...')
    await page.click('button[type="submit"]')
    
    // Aguardar redirecionamento
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Verificar se foi redirecionado
    const currentUrl = page.url()
    console.log('🌐 URL atual:', currentUrl)
    
    if (currentUrl.includes('/admin/dashboard')) {
      console.log('✅ Login bem-sucedido!')
      
      // Teste 4: Verificar se a dashboard carrega
      console.log('4️⃣ Verificando carregamento da dashboard...')
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Verificar se há conteúdo na dashboard
      const dashboardContent = await page.$('.min-h-screen')
      if (dashboardContent) {
        console.log('✅ Dashboard carregou com sucesso!')
        
        // Verificar se há estatísticas
        const statsElements = await page.$$('.bg-metal-card')
        console.log(`📊 Encontrados ${statsElements.length} cards de estatísticas`)
        
        // Verificar se há ações rápidas
        const quickActions = await page.$$('a[href*="/admin/"]')
        console.log(`⚡ Encontradas ${quickActions.length} ações rápidas`)
        
        // Verificar se há menu lateral
        const sidebar = await page.$('.fixed.top-0.left-0')
        if (sidebar) {
          console.log('✅ Menu lateral carregou corretamente')
        } else {
          console.log('⚠️ Menu lateral não encontrado')
        }
        
      } else {
        console.log('❌ Dashboard não carregou conteúdo')
      }
      
    } else {
      console.log('❌ Login falhou - ainda na página de login')
      
      // Verificar se há mensagem de erro
      const errorMessage = await page.$('.text-red-400')
      if (errorMessage) {
        const errorText = await errorMessage.evaluate(el => el.textContent)
        console.log('⚠️ Mensagem de erro:', errorText)
      }
    }
    
    // Aguardar um pouco para visualizar o resultado
    console.log('⏳ Aguardando 10 segundos para visualizar o resultado...')
    await new Promise(resolve => setTimeout(resolve, 10000))
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
  } finally {
    await browser.close()
  }
}

// Executar teste
testDashboardFix().catch(console.error) 