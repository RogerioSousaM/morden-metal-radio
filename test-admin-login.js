const puppeteer = require('puppeteer')

async function testAdminLogin() {
  console.log('🧪 Testando login do painel admin...')
  
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
    
    // Capturar requisições de rede
    page.on('requestfailed', request => {
      console.log('❌ Requisição falhou:', request.url(), request.failure().errorText)
    })
    
    // Teste 1: Acessar o painel admin
    console.log('1️⃣ Acessando http://localhost:5174...')
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' })
    
    // Aguardar carregamento
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Verificar se a página carregou
    const title = await page.title()
    console.log('📄 Título da página:', title)
    
    // Verificar se há formulário de login
    const loginForm = await page.$('form')
    if (loginForm) {
      console.log('✅ Formulário de login encontrado')
    } else {
      console.log('❌ Formulário de login não encontrado')
      return
    }
    
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
    } else {
      console.log('❌ Login falhou - ainda na página de login')
      
      // Verificar se há mensagem de erro
      const errorMessage = await page.$('.text-red-400')
      if (errorMessage) {
        const errorText = await errorMessage.evaluate(el => el.textContent)
        console.log('⚠️ Mensagem de erro:', errorText)
      }
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
  } finally {
    await browser.close()
  }
}

// Executar teste
testAdminLogin().catch(console.error) 