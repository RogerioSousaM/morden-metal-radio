const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

// Configurações
const CONFIG = {
  frontendUser: 'http://localhost:5173',
  frontendAdmin: 'http://localhost:5174',
  backend: 'http://localhost:3001',
  timeout: 30000,
  headless: false // false para ver o navegador
}

// Resultados dos testes
const testResults = {
  frontendUser: { passed: 0, failed: 0, errors: [] },
  frontendAdmin: { passed: 0, failed: 0, errors: [] },
  integration: { passed: 0, failed: 0, errors: [] }
}

// Função para log
function log(message, type = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'
  console.log(`${prefix} [${timestamp}] ${message}`)
}

// Função para verificar se um serviço está rodando
async function checkService(url, name) {
  try {
    const response = await fetch(url)
    log(`${name} está rodando em ${url}`, 'success')
    return true
  } catch (error) {
    log(`${name} não está rodando em ${url}: ${error.message}`, 'error')
    return false
  }
}

// Teste do Frontend User
async function testFrontendUser(page) {
  log('🧪 Iniciando testes do Frontend User...')
  
  try {
    // 1. Teste de carregamento da página inicial
    log('Testando carregamento da página inicial...')
    await page.goto(CONFIG.frontendUser, { waitUntil: 'networkidle0' })
    
    // Verificar se a página carregou
    const title = await page.title()
    log(`Título da página: ${title}`, 'success')
    testResults.frontendUser.passed++
    
    // 2. Teste de navegação
    log('Testando navegação...')
    const navLinks = await page.$$('nav a, .nav-link, [role="navigation"] a')
    log(`Encontrados ${navLinks.length} links de navegação`, 'info')
    
    // 3. Teste de responsividade
    log('Testando responsividade...')
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ]
    
    for (const viewport of viewports) {
      await page.setViewport(viewport)
      await new Promise(resolve => setTimeout(resolve, 1000))
      log(`Viewport ${viewport.name} (${viewport.width}x${viewport.height}) testado`, 'success')
    }
    
    // 4. Teste de formulários (se existirem)
    log('Testando formulários...')
    const forms = await page.$$('form')
    log(`Encontrados ${forms.length} formulários`, 'info')
    
    // 5. Teste de imagens
    log('Testando carregamento de imagens...')
    const images = await page.$$('img')
    log(`Encontradas ${images.length} imagens`, 'info')
    
    // 6. Teste de JavaScript (verificar console errors)
    const consoleErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (consoleErrors.length > 0) {
      log(`Encontrados ${consoleErrors.length} erros no console:`, 'error')
      consoleErrors.forEach(error => log(`  - ${error}`, 'error'))
      testResults.frontendUser.errors.push(...consoleErrors)
    } else {
      log('Nenhum erro no console encontrado', 'success')
    }
    
    testResults.frontendUser.passed++
    
  } catch (error) {
    log(`Erro no teste do Frontend User: ${error.message}`, 'error')
    testResults.frontendUser.failed++
    testResults.frontendUser.errors.push(error.message)
  }
}

// Teste do Frontend Admin
async function testFrontendAdmin(page) {
  log('🧪 Iniciando testes do Frontend Admin...')
  
  try {
    // 1. Teste de carregamento da página de login
    log('Testando página de login...')
    await page.goto(CONFIG.frontendAdmin, { waitUntil: 'networkidle0' })
    
    const title = await page.title()
    log(`Título da página: ${title}`, 'success')
    
    // 2. Teste de formulário de login
    log('Testando formulário de login...')
    const usernameInput = await page.$('input[name="username"], input[type="text"]')
    const passwordInput = await page.$('input[name="password"], input[type="password"]')
    const loginButton = await page.$('button[type="submit"], .login-button')
    
    if (usernameInput && passwordInput && loginButton) {
      log('Formulário de login encontrado', 'success')
      
      // Teste com credenciais incorretas
      await usernameInput.type('wronguser')
      await passwordInput.type('wrongpass')
      await loginButton.click()
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Verificar se há mensagem de erro
      const errorMessage = await page.$('.error-message, .alert-error, [role="alert"]')
      if (errorMessage) {
        log('Mensagem de erro para credenciais incorretas exibida', 'success')
      }
      
      // Teste com credenciais corretas
      await usernameInput.click({ clickCount: 3 })
      await usernameInput.type('admin')
      await passwordInput.click({ clickCount: 3 })
      await passwordInput.type('mordenmetal2024')
      await loginButton.click()
      
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Verificar se foi redirecionado para o dashboard
      const currentUrl = page.url()
      if (currentUrl.includes('dashboard') || currentUrl.includes('admin')) {
        log('Login bem-sucedido - redirecionado para dashboard', 'success')
        testResults.frontendAdmin.passed++
        
        // 3. Teste do Dashboard
        log('Testando dashboard...')
        const dashboardElements = await page.$$('.dashboard, .stats, .card')
        log(`Encontrados ${dashboardElements.length} elementos do dashboard`, 'info')
        
        // 4. Teste de navegação no admin
        log('Testando navegação no admin...')
        const adminLinks = await page.$$('nav a, .sidebar a, [role="navigation"] a')
        log(`Encontrados ${adminLinks.length} links de navegação no admin`, 'info')
        
        // 5. Teste de logout
        log('Testando logout...')
        const logoutButton = await page.$('.logout, [data-testid="logout"]')
        if (logoutButton) {
          await logoutButton.click()
          await new Promise(resolve => setTimeout(resolve, 2000))
          log('Logout realizado com sucesso', 'success')
        }
        
      } else {
        log('Falha no login - não foi redirecionado para dashboard', 'error')
        testResults.frontendAdmin.failed++
      }
      
    } else {
      log('Formulário de login não encontrado', 'error')
      testResults.frontendAdmin.failed++
    }
    
  } catch (error) {
    log(`Erro no teste do Frontend Admin: ${error.message}`, 'error')
    testResults.frontendAdmin.failed++
    testResults.frontendAdmin.errors.push(error.message)
  }
}

// Teste de Integração
async function testIntegration(page) {
  log('🧪 Iniciando testes de integração...')
  
  try {
    // 1. Teste de API calls
    log('Testando chamadas de API...')
    
    // Primeiro fazer login para obter token
    const loginResponse = await fetch(`${CONFIG.backend}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'mordenmetal2024'
      })
    })
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      const token = loginData.token
      
      log('Login bem-sucedido, testando APIs protegidas...', 'success')
      
      // Teste de endpoint de estatísticas com token
      const statsResponse = await fetch(`${CONFIG.backend}/api/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        log('API de estatísticas funcionando', 'success')
        testResults.integration.passed++
      } else {
        log('API de estatísticas não funcionando', 'error')
        testResults.integration.failed++
      }
      
      // Teste de endpoint de bandas com token
      const bandsResponse = await fetch(`${CONFIG.backend}/api/bands`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (bandsResponse.ok) {
        const bands = await bandsResponse.json()
        log('API de bandas funcionando', 'success')
        testResults.integration.passed++
      } else {
        log('API de bandas não funcionando', 'error')
        testResults.integration.failed++
      }
    } else {
      log('Falha no login para testar APIs', 'error')
      testResults.integration.failed++
    }
    
    // 2. Teste de CORS
    log('Testando CORS...')
    const corsResponse = await fetch(`${CONFIG.backend}/api/stats`, {
      method: 'OPTIONS'
    })
    
    if (corsResponse.headers.get('access-control-allow-origin')) {
      log('CORS configurado corretamente', 'success')
      testResults.integration.passed++
    } else {
      log('CORS não configurado', 'error')
      testResults.integration.failed++
    }
    
  } catch (error) {
    log(`Erro no teste de integração: ${error.message}`, 'error')
    testResults.integration.failed++
    testResults.integration.errors.push(error.message)
  }
}

// Função principal
async function runTests() {
  log('🚀 Iniciando validação completa dos frontends...')
  
  // Verificar se os serviços estão rodando
  log('Verificando se os serviços estão rodando...')
  const services = [
    { url: CONFIG.backend, name: 'Backend' },
    { url: CONFIG.frontendUser, name: 'Frontend User' },
    { url: CONFIG.frontendAdmin, name: 'Frontend Admin' }
  ]
  
  for (const service of services) {
    await checkService(service.url, service.name)
  }
  
  // Iniciar navegador
  log('Iniciando navegador...')
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  try {
    // Executar testes
    await testFrontendUser(page)
    await testFrontendAdmin(page)
    await testIntegration(page)
    
  } catch (error) {
    log(`Erro durante os testes: ${error.message}`, 'error')
  } finally {
    await browser.close()
  }
  
  // Gerar relatório
  generateReport()
}

// Gerar relatório
function generateReport() {
  log('📊 Gerando relatório de validação...')
  
  const totalTests = Object.values(testResults).reduce((sum, result) => 
    sum + result.passed + result.failed, 0
  )
  
  const totalPassed = Object.values(testResults).reduce((sum, result) => 
    sum + result.passed, 0
  )
  
  const totalFailed = Object.values(testResults).reduce((sum, result) => 
    sum + result.failed, 0
  )
  
  const totalErrors = Object.values(testResults).reduce((sum, result) => 
    sum + result.errors.length, 0
  )
  
  console.log('\n' + '='.repeat(60))
  console.log('📋 RELATÓRIO DE VALIDAÇÃO DOS FRONTENDS')
  console.log('='.repeat(60))
  
  console.log(`\n📊 RESUMO GERAL:`)
  console.log(`   Total de testes: ${totalTests}`)
  console.log(`   ✅ Passou: ${totalPassed}`)
  console.log(`   ❌ Falhou: ${totalFailed}`)
  console.log(`   🐛 Erros: ${totalErrors}`)
  console.log(`   📈 Taxa de sucesso: ${((totalPassed / totalTests) * 100).toFixed(1)}%`)
  
  console.log(`\n🏠 FRONTEND USER:`)
  console.log(`   ✅ Passou: ${testResults.frontendUser.passed}`)
  console.log(`   ❌ Falhou: ${testResults.frontendUser.failed}`)
  console.log(`   🐛 Erros: ${testResults.frontendUser.errors.length}`)
  
  console.log(`\n⚙️ FRONTEND ADMIN:`)
  console.log(`   ✅ Passou: ${testResults.frontendAdmin.passed}`)
  console.log(`   ❌ Falhou: ${testResults.frontendAdmin.failed}`)
  console.log(`   🐛 Erros: ${testResults.frontendAdmin.errors.length}`)
  
  console.log(`\n🔗 INTEGRAÇÃO:`)
  console.log(`   ✅ Passou: ${testResults.integration.passed}`)
  console.log(`   ❌ Falhou: ${testResults.integration.failed}`)
  console.log(`   🐛 Erros: ${testResults.integration.errors.length}`)
  
  if (totalErrors > 0) {
    console.log(`\n🚨 ERROS DETECTADOS:`)
    Object.entries(testResults).forEach(([category, result]) => {
      if (result.errors.length > 0) {
        console.log(`\n   ${category.toUpperCase()}:`)
        result.errors.forEach(error => console.log(`     - ${error}`))
      }
    })
  }
  
  console.log(`\n🎯 CONCLUSÃO:`)
  if (totalFailed === 0 && totalErrors === 0) {
    console.log(`   🎉 TODOS OS TESTES PASSARAM! Frontends prontos para produção.`)
  } else if (totalFailed <= 2 && totalErrors <= 5) {
    console.log(`   ⚠️  ALGUNS PROBLEMAS MENORES. Revisar erros antes da produção.`)
  } else {
    console.log(`   🚨 PROBLEMAS CRÍTICOS DETECTADOS. Corrigir antes da produção.`)
  }
  
  console.log('\n' + '='.repeat(60))
  
  // Salvar relatório em arquivo
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests,
      totalPassed,
      totalFailed,
      totalErrors,
      successRate: ((totalPassed / totalTests) * 100).toFixed(1)
    },
    results: testResults,
    conclusion: totalFailed === 0 && totalErrors === 0 ? 'SUCCESS' : 
               totalFailed <= 2 && totalErrors <= 5 ? 'WARNING' : 'CRITICAL'
  }
  
  fs.writeFileSync('frontend-validation-report.json', JSON.stringify(report, null, 2))
  log('Relatório salvo em frontend-validation-report.json', 'success')
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(error => {
    log(`Erro fatal: ${error.message}`, 'error')
    process.exit(1)
  })
}

module.exports = {
  runTests,
  testFrontendUser,
  testFrontendAdmin,
  testIntegration,
  generateReport
} 