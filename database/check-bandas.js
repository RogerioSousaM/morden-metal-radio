const Database = require('./database')

async function checkBandas() {
  const db = new Database()
  
  try {
    console.log('🔍 Verificando tabela bandas_cena...')
    
    await db.init()
    
    // Verificar se a tabela existe
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('📋 Tabelas existentes:', tables.map(t => t.name))
    
    // Verificar estrutura da tabela bandas_cena
    if (tables.some(t => t.name === 'bandas_cena')) {
      const structure = await db.all("PRAGMA table_info(bandas_cena)")
      console.log('🏗️  Estrutura da tabela bandas_cena:')
      structure.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`)
      })
      
      // Verificar dados
      const count = await db.get("SELECT COUNT(*) as total FROM bandas_cena")
      console.log(`📊 Total de bandas: ${count.total}`)
      
      if (count.total > 0) {
        const bandas = await db.all("SELECT id, name, featured FROM bandas_cena LIMIT 3")
        console.log('🎸 Primeiras bandas:')
        bandas.forEach(b => {
          console.log(`  - ${b.name} (ID: ${b.id}, Featured: ${b.featured})`)
        })
      }
    } else {
      console.log('❌ Tabela bandas_cena não encontrada!')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await db.close()
  }
}

checkBandas()
