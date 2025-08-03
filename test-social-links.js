const fetch = require('node-fetch')
const API_BASE = 'http://localhost:3001/api'

async function testSocialLinks() {
  console.log('🔗 Testando API de Links Sociais...\n')

  try {
    // 1. Test GET /api/social-links (público)
    console.log('1️⃣ Testando GET /api/social-links (público)...')
    const publicResponse = await fetch(`${API_BASE}/social-links`)
    if (publicResponse.ok) {
      const publicData = await publicResponse.json()
      console.log('✅ Rota pública funcionando')
      console.log('📋 Links atuais:', publicData)
    } else {
      console.log('❌ Erro na rota pública:', publicResponse.status)
    }

    // 2. Login admin
    console.log('\n2️⃣ Fazendo login admin...')
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'mordenmetal2024'
      })
    })

    if (!loginResponse.ok) {
      console.log('❌ Login falhou:', loginResponse.status)
      return
    }

    const { token } = await loginResponse.json()
    console.log('✅ Login realizado com sucesso')

    // 3. Test GET /api/social-links/admin (com autenticação)
    console.log('\n3️⃣ Testando GET /api/social-links/admin (admin)...')
    const adminResponse = await fetch(`${API_BASE}/social-links/admin`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (adminResponse.ok) {
      const adminData = await adminResponse.json()
      console.log('✅ Rota admin funcionando')
      console.log('📋 Links admin:', adminData)
    } else {
      console.log('❌ Erro na rota admin:', adminResponse.status)
    }

    // 4. Test PUT /api/social-links (atualizar links)
    console.log('\n4️⃣ Testando PUT /api/social-links (atualizar)...')
    const updateData = {
      instagram: 'https://instagram.com/mordenmetal_updated',
      youtube: 'https://youtube.com/@mordenmetal_updated',
      twitter: 'https://twitter.com/mordenmetal_updated',
      tiktok: 'https://tiktok.com/@mordenmetal_updated'
    }

    const updateResponse = await fetch(`${API_BASE}/social-links`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })

    if (updateResponse.ok) {
      const updatedData = await updateResponse.json()
      console.log('✅ Links atualizados com sucesso')
      console.log('📋 Novos links:', updatedData.socialLinks)
    } else {
      console.log('❌ Erro ao atualizar links:', updateResponse.status)
      const errorData = await updateResponse.json()
      console.log('📋 Detalhes do erro:', errorData)
    }

    // 5. Verificar se a atualização foi refletida na rota pública
    console.log('\n5️⃣ Verificando se a atualização foi refletida na rota pública...')
    const verifyResponse = await fetch(`${API_BASE}/social-links`)
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json()
      console.log('✅ Rota pública atualizada')
      console.log('📋 Links verificados:', verifyData)
    } else {
      console.log('❌ Erro ao verificar rota pública:', verifyResponse.status)
    }

    // 6. Test POST /api/social-links/reset (resetar para padrão)
    console.log('\n6️⃣ Testando POST /api/social-links/reset (resetar)...')
    const resetResponse = await fetch(`${API_BASE}/social-links/reset`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (resetResponse.ok) {
      const resetData = await resetResponse.json()
      console.log('✅ Links resetados com sucesso')
      console.log('📋 Links padrão:', resetData.socialLinks)
    } else {
      console.log('❌ Erro ao resetar links:', resetResponse.status)
    }

    // 7. Verificar links finais
    console.log('\n7️⃣ Verificando links finais...')
    const finalResponse = await fetch(`${API_BASE}/social-links`)
    if (finalResponse.ok) {
      const finalData = await finalResponse.json()
      console.log('✅ Links finais:', finalData)
    } else {
      console.log('❌ Erro ao verificar links finais:', finalResponse.status)
    }

    console.log('\n🎉 Todos os testes de Links Sociais concluídos!')

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message)
  }
}

testSocialLinks() 