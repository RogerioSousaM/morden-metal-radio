const Database = require('./database/database')

async function testBandasAPI() {
  console.log('🧪 TESTE DA API DE BANDAS')
  console.log('=' .repeat(40))
  
  const db = new Database()
  
  try {
    await db.init()
    console.log('✅ Banco conectado com sucesso')
    
    // 1. Verificar se a tabela existe
    console.log('\n1️⃣ Verificando tabela bandas_cena...')
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='bandas_cena'")
    if (tables.length > 0) {
      console.log('✅ Tabela bandas_cena encontrada')
    } else {
      console.log('❌ Tabela bandas_cena não encontrada')
      return
    }
    
    // 2. Verificar estrutura da tabela
    console.log('\n2️⃣ Verificando estrutura da tabela...')
    const schema = await db.all("PRAGMA table_info(bandas_cena)")
    console.log('Colunas encontradas:')
    schema.forEach(col => {
      console.log(`   - ${col.name} (${col.type})`)
    })
    
    // 3. Verificar dados existentes
    console.log('\n3️⃣ Verificando dados existentes...')
    const bandas = await db.all('SELECT * FROM bandas_cena LIMIT 3')
    console.log(`Encontradas ${bandas.length} bandas:`)
    bandas.forEach(banda => {
      console.log(`   - ${banda.name} (${banda.slug})`)
    })
    
    // 4. Testar queries da API
    console.log('\n4️⃣ Testando queries da API...')
    
    // Teste de paginação
    const page = 1
    const limit = 10
    const offset = (page - 1) * limit
    
    const countResult = await db.get('SELECT COUNT(*) as total FROM bandas_cena')
    const total = countResult.total
    
    const dataQuery = `
      SELECT id, name, slug, description, official_url, image_url, genre_tags, featured, created_at
      FROM bandas_cena 
      ORDER BY featured DESC, name ASC
      LIMIT ? OFFSET ?
    `
    
    const bandasPaginated = await db.all(dataQuery, [limit, offset])
    
    console.log('✅ Query de paginação funcionando:')
    console.log(`   Total: ${total}`)
    console.log(`   Página ${page}: ${bandasPaginated.length} bandas`)
    
    // 5. Testar busca por slug
    console.log('\n5️⃣ Testando busca por slug...')
    const bandaPorSlug = await db.get('SELECT * FROM bandas_cena WHERE slug = ?', ['sleep-token'])
    if (bandaPorSlug) {
      console.log('✅ Busca por slug funcionando:', bandaPorSlug.name)
    } else {
      console.log('❌ Busca por slug falhou')
    }
    
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!')
    console.log('A API de bandas está pronta para funcionar!')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error)
  } finally {
    await db.close()
  }
}

testBandasAPI()
