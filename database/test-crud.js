const Database = require('./database')

async function testCRUD() {
  const db = new Database()
  
  try {
    console.log('🧪 Testando CRUD na tabela de notícias...')
    
    // Inicializar banco
    await db.init()
    
    // CREATE - Criar uma nova notícia
    console.log('\n📝 CREATE - Criando nova notícia...')
    const newNews = await db.run(
      `INSERT INTO news (title, content, image, author, is_published) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        'Nova Banda de Metalcore Anuncia Turnê',
        'A banda Spiritbox anunciou hoje sua nova turnê mundial que passará pelo Brasil em 2024. A turnê "The Summoning World Tour" incluirá shows em São Paulo, Rio de Janeiro e Porto Alegre.',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
        'Admin',
        1
      ]
    )
    console.log('✅ Notícia criada com ID:', newNews.id)
    
    // READ - Buscar todas as notícias
    console.log('\n📖 READ - Buscando todas as notícias...')
    const allNews = await db.all('SELECT * FROM news ORDER BY created_at DESC')
    console.log(`✅ Encontradas ${allNews.length} notícias:`)
    allNews.forEach(news => {
      console.log(`  - ID: ${news.id} | ${news.title} | Autor: ${news.author}`)
    })
    
    // READ - Buscar notícia específica
    console.log('\n🔍 READ - Buscando notícia específica...')
    const specificNews = await db.get('SELECT * FROM news WHERE id = ?', [newNews.id])
    console.log(`✅ Notícia encontrada: "${specificNews.title}"`)
    
    // UPDATE - Atualizar notícia
    console.log('\n✏️ UPDATE - Atualizando notícia...')
    const updateResult = await db.run(
      'UPDATE news SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        'Spiritbox Anuncia Turnê Mundial 2024 - ATUALIZADO',
        'A banda Spiritbox anunciou hoje sua nova turnê mundial que passará pelo Brasil em 2024. A turnê "The Summoning World Tour" incluirá shows em São Paulo, Rio de Janeiro, Porto Alegre e Belo Horizonte. Ingressos já estão disponíveis.',
        newNews.id
      ]
    )
    console.log(`✅ Notícia atualizada. Registros afetados: ${updateResult.changes}`)
    
    // READ - Verificar atualização
    const updatedNews = await db.get('SELECT * FROM news WHERE id = ?', [newNews.id])
    console.log(`✅ Notícia atualizada: "${updatedNews.title}"`)
    
    // DELETE - Deletar notícia de teste
    console.log('\n🗑️ DELETE - Deletando notícia de teste...')
    const deleteResult = await db.run('DELETE FROM news WHERE id = ?', [newNews.id])
    console.log(`✅ Notícia deletada. Registros afetados: ${deleteResult.changes}`)
    
    // Verificar tabelas existentes
    console.log('\n📊 Verificando estrutura do banco...')
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('✅ Tabelas disponíveis:')
    tables.forEach(table => {
      console.log(`  - ${table.name}`)
    })
    
    // Contagem de registros por tabela
    console.log('\n📈 Contagem de registros por tabela:')
    const tableCounts = [
      { name: 'users', query: 'SELECT COUNT(*) as count FROM users' },
      { name: 'bands', query: 'SELECT COUNT(*) as count FROM bands' },
      { name: 'programs', query: 'SELECT COUNT(*) as count FROM programs' },
      { name: 'news', query: 'SELECT COUNT(*) as count FROM news' },
      { name: 'images', query: 'SELECT COUNT(*) as count FROM images' },
    
      { name: 'stats', query: 'SELECT COUNT(*) as count FROM stats' }
    ]
    
    for (const table of tableCounts) {
      const result = await db.get(table.query)
      console.log(`  - ${table.name}: ${result.count} registros`)
    }
    
    console.log('\n🎉 Teste CRUD concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante teste CRUD:', error)
  } finally {
    await db.close()
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testCRUD()
}

module.exports = { testCRUD } 