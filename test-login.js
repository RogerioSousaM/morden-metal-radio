const fetch = require('node-fetch');

async function testLogin() {
  console.log('🧪 Testando login do painel admin...');
  
  try {
    // Teste 1: Verificar se o backend está respondendo
    console.log('1️⃣ Verificando se o backend está respondendo...');
    const healthCheck = await fetch('http://localhost:3001/api/stream');
    if (healthCheck.ok) {
      console.log('✅ Backend está respondendo');
    } else {
      console.log('❌ Backend não está respondendo');
      return;
    }

    // Teste 2: Tentar fazer login
    console.log('2️⃣ Tentando fazer login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'mordenmetal2024'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login bem-sucedido!');
      console.log('📋 Token recebido:', loginData.token ? 'Sim' : 'Não');
      console.log('👤 Usuário:', loginData.user?.username);
      
      // Teste 3: Testar uma rota protegida
      console.log('3️⃣ Testando rota protegida...');
      const statsResponse = await fetch('http://localhost:3001/api/stats', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('✅ Rota protegida funcionando!');
        console.log('📊 Estatísticas:', statsData);
      } else {
        console.log('❌ Erro na rota protegida:', statsResponse.status);
      }
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Erro no login:', errorData);
    }

  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
  }
}

testLogin(); 