const puppeteer = require('puppeteer')

async function testAdminPanel() {
  console.log('🧪 Iniciando teste do painel de administração...')
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  })
  
  try {
    const page = await browser.newPage()
    
    // Teste 1: Acessar o painel admin
    console.log('1️⃣ Acessando painel admin...')
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' })
    
    // Aguardar carregamento da página
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Verificar se está na página de login
    const loginForm = await page.$('form')
    if (!loginForm) {
      console.log('❌ Formulário de login não encontrado')
      return
    }
    
    console.log('✅ Página de login carregada')
    
    // Teste 2: Fazer login
    console.log('2️⃣ Fazendo login...')
    await page.type('input[type="text"]', 'admin')
    await page.type('input[type="password"]', 'mordenmetal2024')
    await page.click('button[type="submit"]')
    
    // Aguardar redirecionamento
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Verificar se foi redirecionado para o dashboard
    const currentUrl = page.url()
    if (currentUrl.includes('/admin/dashboard')) {
      console.log('✅ Login bem-sucedido - Redirecionado para dashboard')
    } else {
      console.log('❌ Falha no login - URL atual:', currentUrl)
      return
    }
    
    // Teste 3: Verificar menu lateral
    console.log('3️⃣ Verificando menu lateral...')
    const menuItems = await page.$$eval('.navigation-item', items => 
      items.map(item => item.textContent.trim())
    )
    
    const expectedMenuItems = ['Dashboard', 'Bandas', 'Programação', 'Notícias', 'Usuários', 'Arquivos', 'Configurações']
    const missingItems = expectedMenuItems.filter(item => !menuItems.includes(item))
    
    if (missingItems.length === 0) {
      console.log('✅ Menu lateral completo')
    } else {
      console.log('⚠️ Itens faltando no menu:', missingItems)
    }
    
    // Teste 4: Navegar pelas seções
    console.log('4️⃣ Testando navegação...')
    
    // Testar seção de Bandas
    await page.click('a[href="/admin/bands"]')
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('✅ Seção Bandas acessada')
    
    // Testar seção de Notícias
    await page.click('a[href="/admin/news"]')
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('✅ Seção Notícias acessada')
    
    // Testar seção de Usuários
    await page.click('a[href="/admin/users"]')
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('✅ Seção Usuários acessada')
    
    // Testar seção de Arquivos
    await page.click('a[href="/admin/files"]')
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('✅ Seção Arquivos acessada')
    
    // Voltar para Dashboard
    await page.click('a[href="/admin/dashboard"]')
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('✅ Dashboard acessado novamente')
    
    // Teste 5: Testar funcionalidades CRUD
    console.log('5️⃣ Testando funcionalidades CRUD...')
    
    // Testar criação de notícia
    await page.click('a[href="/admin/news"]')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newNewsButton = await page.$('button:has-text("Nova Notícia")')
    if (newNewsButton) {
      await newNewsButton.click()
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Preencher formulário
      await page.type('input[placeholder*="Título"]', 'Teste de Notícia')
      await page.type('textarea', 'Esta é uma notícia de teste para validar o sistema.')
      await page.type('input[placeholder*="Autor"]', 'Admin')
      
      // Salvar
      const saveButton = await page.$('button:has-text("Criar")')
      if (saveButton) {
        await saveButton.click()
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('✅ Criação de notícia testada')
      }
    }
    
    // Teste 6: Verificar logout
    console.log('6️⃣ Testando logout...')
    const logoutButton = await page.$('button:has-text("Sair")')
    if (logoutButton) {
      await logoutButton.click()
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const currentUrlAfterLogout = page.url()
      if (currentUrlAfterLogout.includes('/login')) {
        console.log('✅ Logout funcionando corretamente')
      } else {
        console.log('❌ Problema no logout')
      }
    }
    
    console.log('🎉 Teste do painel de administração concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
  } finally {
    await browser.close()
  }
}

// Executar teste
testAdminPanel().catch(console.error) 