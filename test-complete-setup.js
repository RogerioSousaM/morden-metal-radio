const Database = require('./database/database')
const fetch = require('node-fetch')

async function testCompleteSetup() {
  console.log('🧪 TESTE COMPLETO DO SETUP')
  console.log('=' .repeat(50))
  
  const db = new Database()
  
  try {
    // 1. Testar conexão com banco
    console.log('\n1️⃣ Testando conexão com banco...')
    await db.init()
    console.log('✅ Banco conectado com sucesso')
    
    // 2. Verificar tabelas criadas
    console.log('\n2️⃣ Verificando tabelas criadas...')
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'")
    const expectedTables = ['bandas_cena', 'banners', 'audit_logs']
    const missingTables = expectedTables.filter(table => 
      !tables.some(t => t.name === table)
    )
    
    if (missingTables.length === 0) {
      console.log('✅ Todas as tabelas foram criadas')
      console.table(tables)
    } else {
      console.log('❌ Tabelas faltando:', missingTables)
    }
    
    // 3. Verificar dados das bandas
    console.log('\n3️⃣ Verificando dados das bandas...')
    const bands = await db.all('SELECT id, name, slug, featured FROM bandas_cena ORDER BY id')
    if (bands.length >= 4) {
      console.log('✅ Bandas inseridas corretamente')
      console.table(bands)
    } else {
      console.log('❌ Dados das bandas incompletos')
    }
    
    // 4. Verificar dados dos banners
    console.log('\n4️⃣ Verificando dados dos banners...')
    const banners = await db.all('SELECT id, title, priority, active FROM banners ORDER BY id')
    if (banners.length >= 3) {
      console.log('✅ Banners inseridos corretamente')
      console.table(banners)
    } else {
      console.log('❌ Dados dos banners incompletos')
    }
    
    // 5. Verificar índices criados
    console.log('\n5️⃣ Verificando índices criados...')
    const indexes = await db.all("SELECT name FROM sqlite_master WHERE type='index'")
    const expectedIndexes = [
      'idx_bandas_cena_slug',
      'idx_bandas_cena_featured',
      'idx_banners_active',
      'idx_banners_dates'
    ]
    
    const createdIndexes = indexes.filter(idx => 
      expectedIndexes.some(expected => idx.name.includes(expected.replace('idx_', '')))
    )
    
    if (createdIndexes.length >= 4) {
      console.log('✅ Índices criados corretamente')
      console.table(createdIndexes)
    } else {
      console.log('❌ Índices incompletos')
    }
    
    // 6. Testar queries de performance
    console.log('\n6️⃣ Testando queries de performance...')
    
    // Teste de busca por slug
    const bandBySlug = await db.get('SELECT * FROM bandas_cena WHERE slug = ?', ['sleep-token'])
    if (bandBySlug) {
      console.log('✅ Busca por slug funcionando')
    } else {
      console.log('❌ Busca por slug falhou')
    }
    
    // Teste de busca por featured
    const featuredBands = await db.all('SELECT * FROM bandas_cena WHERE featured = 1')
    if (featuredBands.length >= 4) {
      console.log('✅ Busca por featured funcionando')
    } else {
      console.log('❌ Busca por featured falhou')
    }
    
    // 7. Testar estrutura das tabelas
    console.log('\n7️⃣ Verificando estrutura das tabelas...')
    
    const bandasSchema = await db.all("PRAGMA table_info(bandas_cena)")
    const expectedBandasColumns = [
      'id', 'name', 'slug', 'description', 'official_url', 
      'image_url', 'genre_tags', 'featured', 'created_at', 'updated_at'
    ]
    
    const missingColumns = expectedBandasColumns.filter(col => 
      !bandasSchema.some(schema => schema.name === col)
    )
    
    if (missingColumns.length === 0) {
      console.log('✅ Estrutura da tabela bandas_cena correta')
    } else {
      console.log('❌ Colunas faltando em bandas_cena:', missingColumns)
    }
    
    // 8. Testar inserção de dados de teste
    console.log('\n8️⃣ Testando inserção de dados...')
    
    try {
      const testBand = {
        name: 'Test Band',
        slug: 'test-band',
        description: 'Banda de teste para validação',
        image_url: 'https://example.com/test.jpg',
        genre_tags: '["test", "validation"]',
        featured: 0
      }
      
      const insertResult = await db.run(`
        INSERT INTO bandas_cena (name, slug, description, image_url, genre_tags, featured)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [testBand.name, testBand.slug, testBand.description, testBand.image_url, testBand.genre_tags, testBand.featured])
      
      if (insertResult.lastID) {
        console.log('✅ Inserção de dados funcionando')
        
        // Limpar dados de teste
        await db.run('DELETE FROM bandas_cena WHERE slug = ?', ['test-band'])
        console.log('✅ Limpeza de dados de teste funcionando')
      } else {
        console.log('❌ Inserção de dados falhou')
      }
    } catch (error) {
      console.log('❌ Erro ao testar inserção:', error.message)
    }
    
    // 9. Resumo final
    console.log('\n📊 RESUMO FINAL DOS TESTES')
    console.log('=' .repeat(50))
    
    const totalTests = 8
    let passedTests = 0
    
    if (missingTables.length === 0) passedTests++
    if (bands.length >= 4) passedTests++
    if (banners.length >= 3) passedTests++
    if (createdIndexes.length >= 4) passedTests++
    if (bandBySlug) passedTests++
    if (featuredBands.length >= 4) passedTests++
    if (missingColumns.length === 0) passedTests++
    
    console.log(`✅ Testes passaram: ${passedTests}/${totalTests}`)
    console.log(`📈 Taxa de sucesso: ${((passedTests/totalTests)*100).toFixed(1)}%`)
    
    if (passedTests === totalTests) {
      console.log('\n🎉 TODOS OS TESTES PASSARAM! Setup completo com sucesso!')
    } else {
      console.log('\n⚠️ Alguns testes falharam. Verifique os logs acima.')
    }
    
  } catch (error) {
    console.error('❌ Erro durante testes:', error)
  } finally {
    await db.close()
  }
}

// Executar testes
testCompleteSetup()
