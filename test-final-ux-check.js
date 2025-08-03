const fs = require('fs')
const path = require('path')

function checkFilePattern(filePath, patterns) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const results = {}
    
    patterns.forEach(pattern => {
      results[pattern.name] = content.includes(pattern.search)
    })
    
    return results
  } catch (error) {
    return { error: error.message }
  }
}

function testAllPagesStandardization() {
  console.log('🎯 Verificação Final de Padronização de UI/UX\n')
  
  const pages = [
    {
      name: 'Dashboard',
      path: 'frontend-admin/src/components/Dashboard.tsx',
      patterns: [
        { name: 'motion.div header', search: 'motion.div\n        className="mb-8"' },
        { name: 'title pattern', search: 'text-3xl font-bold tracking-widest uppercase mb-2' },
        { name: 'subtitle pattern', search: 'text-metal-text-secondary' },
        { name: 'container padding', search: 'className="p-6"' }
      ]
    },
    {
      name: 'Bands Management',
      path: 'frontend-admin/src/pages/BandsManagement.tsx',
      patterns: [
        { name: 'motion.div header', search: 'motion.div\n        className="mb-8"' },
        { name: 'title pattern', search: 'text-3xl font-bold tracking-widest uppercase mb-2' },
        { name: 'subtitle pattern', search: 'text-metal-text-secondary' },
        { name: 'btn-primary button', search: 'btn-primary' },
        { name: 'container padding', search: 'className="p-6"' }
      ]
    },
    {
      name: 'Schedule Management',
      path: 'frontend-admin/src/pages/ScheduleManagement.tsx',
      patterns: [
        { name: 'motion.div header', search: 'motion.div \n          className="mb-8"' },
        { name: 'title pattern', search: 'text-3xl font-bold tracking-widest uppercase mb-2' },
        { name: 'subtitle pattern', search: 'text-metal-text-secondary' },
        { name: 'btn-primary button', search: 'btn-primary' },
        { name: 'container padding', search: 'className="p-6"' }
      ]
    },
    {
      name: 'News Management',
      path: 'frontend-admin/src/pages/NewsManagement.tsx',
      patterns: [
        { name: 'motion.div header', search: 'motion.div\n        className="mb-8"' },
        { name: 'title pattern', search: 'text-3xl font-bold tracking-widest uppercase mb-2' },
        { name: 'subtitle pattern', search: 'text-metal-text-secondary' },
        { name: 'btn-primary button', search: 'btn-primary' },
        { name: 'container padding', search: 'className="p-6"' }
      ]
    },
    {
      name: 'Users Management',
      path: 'frontend-admin/src/pages/UsersManagement.tsx',
      patterns: [
        { name: 'motion.div header', search: 'motion.div\n        className="mb-8"' },
        { name: 'title pattern', search: 'text-3xl font-bold tracking-widest uppercase mb-2' },
        { name: 'subtitle pattern', search: 'text-metal-text-secondary' },
        { name: 'btn-primary button', search: 'btn-primary' },
        { name: 'container padding', search: 'className="p-6"' }
      ]
    },
    {
      name: 'File Management',
      path: 'frontend-admin/src/pages/FileManagement.tsx',
      patterns: [
        { name: 'motion.div header', search: 'motion.div\n        className="mb-8"' },
        { name: 'title pattern', search: 'text-3xl font-bold tracking-widest uppercase mb-2' },
        { name: 'subtitle pattern', search: 'text-metal-text-secondary' },
        { name: 'btn-primary button', search: 'btn-primary' },
        { name: 'container padding', search: 'className="p-6"' }
      ]
    },
    {
      name: 'Carousel Management',
      path: 'frontend-admin/src/pages/CarouselManagement.tsx',
      patterns: [
        { name: 'motion.div header', search: 'motion.div\n        className="mb-8"' },
        { name: 'title pattern', search: 'text-3xl font-bold tracking-widest uppercase mb-2' },
        { name: 'subtitle pattern', search: 'text-metal-text-secondary' },
        { name: 'btn-primary button', search: 'btn-primary' },
        { name: 'container padding', search: 'className="p-6"' }
      ]
    },
    {
      name: 'Top Month Management',
      path: 'frontend-admin/src/pages/TopMonthManagement.tsx',
      patterns: [
        { name: 'motion.div header', search: 'motion.div\n        className="mb-8"' },
        { name: 'title pattern', search: 'text-3xl font-bold tracking-widest uppercase mb-2' },
        { name: 'subtitle pattern', search: 'text-metal-text-secondary' },
        { name: 'btn-primary button', search: 'btn-primary' },
        { name: 'container padding', search: 'className="p-6"' }
      ]
    },
    {
      name: 'Social Links Management',
      path: 'frontend-admin/src/pages/SocialLinksManagement.tsx',
      patterns: [
        { name: 'motion.div header', search: 'motion.div\n        className="mb-8"' },
        { name: 'title pattern', search: 'text-3xl font-bold tracking-widest uppercase mb-2' },
        { name: 'subtitle pattern', search: 'text-metal-text-secondary' },
        { name: 'btn-primary button', search: 'btn-primary' },
        { name: 'container padding', search: 'className="p-6"' }
      ]
    },
    {
      name: 'Settings Management',
      path: 'frontend-admin/src/pages/SettingsManagement.tsx',
      patterns: [
        { name: 'motion.div header', search: 'motion.div\n        className="mb-8"' },
        { name: 'title pattern', search: 'text-3xl font-bold tracking-widest uppercase mb-2' },
        { name: 'subtitle pattern', search: 'text-metal-text-secondary' },
        { name: 'btn-primary button', search: 'btn-primary' },
        { name: 'container padding', search: 'className="p-6"' }
      ]
    }
  ]

  let allPassed = true
  let totalChecks = 0
  let passedChecks = 0

  pages.forEach(page => {
    console.log(`📄 ${page.name}:`)
    
    if (!fs.existsSync(page.path)) {
      console.log(`   ❌ Arquivo não encontrado: ${page.path}`)
      allPassed = false
      return
    }

    const results = checkFilePattern(page.path, page.patterns)
    
    if (results.error) {
      console.log(`   ❌ Erro ao ler arquivo: ${results.error}`)
      allPassed = false
      return
    }

    let pagePassed = true
    page.patterns.forEach(pattern => {
      totalChecks++
      if (results[pattern.name]) {
        console.log(`   ✅ ${pattern.name}`)
        passedChecks++
      } else {
        console.log(`   ❌ ${pattern.name}`)
        pagePassed = false
        allPassed = false
      }
    })

    if (pagePassed) {
      console.log(`   🎉 ${page.name} está padronizado!\n`)
    } else {
      console.log(`   ⚠️  ${page.name} precisa de ajustes\n`)
    }
  })

  console.log('📊 RESUMO:')
  console.log(`   Total de verificações: ${totalChecks}`)
  console.log(`   Verificações aprovadas: ${passedChecks}`)
  console.log(`   Verificações reprovadas: ${totalChecks - passedChecks}`)
  console.log(`   Taxa de sucesso: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`)

  if (allPassed) {
    console.log('\n🎉 TODAS AS PÁGINAS ESTÃO PADRONIZADAS!')
    console.log('✅ UI/UX consistente em todo o painel admin')
    console.log('✅ Todos os headers seguem o mesmo padrão')
    console.log('✅ Todos os botões usam as mesmas classes')
    console.log('✅ Todas as animações são consistentes')
  } else {
    console.log('\n⚠️  ALGUMAS PÁGINAS PRECISAM DE AJUSTES')
    console.log('🔧 Verifique os itens marcados com ❌ acima')
  }

  console.log('\n🚀 PRÓXIMOS PASSOS:')
  console.log('1. Execute o teste manual: node test-admin-ux-verification.js')
  console.log('2. Acesse cada página no navegador para verificação visual')
  console.log('3. Teste a navegação entre as páginas')
  console.log('4. Verifique se o menu lateral destaca corretamente o item ativo')
  console.log('5. Teste em modo desktop e mobile')
}

testAllPagesStandardization() 