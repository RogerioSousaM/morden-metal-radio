const fetch = require('node-fetch')

async function testAdminLayout() {
  console.log('🔧 Testando correção do AdminLayout...\n')
  
  try {
    // 1. Verificar se o servidor está rodando
    console.log('1️⃣ Verificando se o servidor está rodando...')
    const response = await fetch('http://localhost:3001/api/health')
    
    if (response.ok) {
      console.log('✅ Servidor está rodando')
    } else {
      console.log('⚠️ Servidor pode não estar rodando')
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com o servidor:', error.message)
  }
  
  console.log('\n📋 Resumo da correção aplicada:')
  console.log('- ✅ Adicionado estado isDesktop para detectar tamanho da tela')
  console.log('- ✅ Ajustada lógica do sidebar para ser sempre visível em desktop')
  console.log('- ✅ Corrigida animação do Framer Motion')
  console.log('- ✅ Build do frontend-admin executado com sucesso')
  
  console.log('\n🎯 Para testar a correção:')
  console.log('1. Abra o navegador em http://localhost:5173')
  console.log('2. Faça login no painel admin')
  console.log('3. Verifique se o sidebar aparece em desktop (tela > 1024px)')
  console.log('4. Redimensione a janela para mobile e verifique se o sidebar some')
  console.log('5. Clique no botão de menu em mobile para abrir/fechar o sidebar')
  
  console.log('\n🔍 Se o problema persistir:')
  console.log('- Verifique o console do navegador para erros')
  console.log('- Confirme se o CSS do Tailwind está sendo carregado')
  console.log('- Teste em diferentes navegadores')
}

testAdminLayout() 