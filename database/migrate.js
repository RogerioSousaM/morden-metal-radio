const Database = require('./database')

async function runMigrations() {
  const db = new Database()
  
  try {
    console.log('🚀 Iniciando migrações...')
    
    // Inicializar banco
    await db.init()
    
    // Testar CRUD básico
    console.log('\n🧪 Testando CRUD básico...')
    
    // CREATE - Criar uma nova banda
    console.log('📝 Criando nova banda...')
    const newBand = await db.run(
      `INSERT INTO bands (name, genre, description, listeners, rating, is_featured, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'Spiritbox',
        'Metalcore',
        'Metalcore moderno com vocais poderosos e riffs devastadores',
        '12.8k',
        4.7,
        1,
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&crop=center'
      ]
    )
    console.log('✅ Banda criada com ID:', newBand.id)
    
    // READ - Buscar todas as bandas
    console.log('\n📖 Buscando todas as bandas...')
    const bands = await db.all('SELECT * FROM bands')
    console.log(`✅ Encontradas ${bands.length} bandas:`)
    bands.forEach(band => {
      console.log(`  - ${band.name} (${band.genre}) - Rating: ${band.rating}`)
    })
    
    // UPDATE - Atualizar uma banda
    console.log('\n✏️ Atualizando banda...')
    const updateResult = await db.run(
      'UPDATE bands SET rating = ? WHERE name = ?',
      [4.9, 'Spiritbox']
    )
    console.log(`✅ Banda atualizada. Registros afetados: ${updateResult.changes}`)
    
    // READ - Verificar atualização
    const updatedBand = await db.get('SELECT * FROM bands WHERE name = ?', ['Spiritbox'])
    console.log(`✅ Banda atualizada: ${updatedBand.name} - Novo rating: ${updatedBand.rating}`)
    
    // DELETE - Deletar uma banda (vamos deletar a que acabamos de criar)
    console.log('\n🗑️ Deletando banda de teste...')
    const deleteResult = await db.run('DELETE FROM bands WHERE name = ?', ['Spiritbox'])
    console.log(`✅ Banda deletada. Registros afetados: ${deleteResult.changes}`)
    
    // Verificar tabelas criadas
    console.log('\n📊 Verificando estrutura do banco...')
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('✅ Tabelas criadas:')
    tables.forEach(table => {
      console.log(`  - ${table.name}`)
    })
    
    // Verificar dados em cada tabela
    console.log('\n📈 Contagem de registros por tabela:')
    const tableCounts = [
      { name: 'users', query: 'SELECT COUNT(*) as count FROM users' },
      { name: 'bands', query: 'SELECT COUNT(*) as count FROM bands' },
      { name: 'programs', query: 'SELECT COUNT(*) as count FROM programs' },
      { name: 'news', query: 'SELECT COUNT(*) as count FROM news' },
      { name: 'images', query: 'SELECT COUNT(*) as count FROM images' },
      { name: 'videos', query: 'SELECT COUNT(*) as count FROM videos' },
      { name: 'stats', query: 'SELECT COUNT(*) as count FROM stats' }
    ]
    
    for (const table of tableCounts) {
      const result = await db.get(table.query)
      console.log(`  - ${table.name}: ${result.count} registros`)
    }
    
    console.log('\n🎉 Migrações concluídas com sucesso!')
    console.log('📁 Arquivo do banco criado em: server/morden_metal.db')
    
  } catch (error) {
    console.error('❌ Erro durante migrações:', error)
  } finally {
    await db.close()
  }
}

// Executar migrações se o arquivo for chamado diretamente
if (require.main === module) {
  runMigrations()
}

module.exports = { runMigrations } 