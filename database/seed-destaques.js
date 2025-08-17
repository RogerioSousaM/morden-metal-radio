const Database = require('./database')
const fs = require('fs')
const path = require('path')

async function seedDestaques() {
  const db = new Database()
  
  try {
    console.log('🌱 Iniciando seed dos destaques da cena...')
    
    await db.init()
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'seed-destaques.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Executar o SQL
    await db.run(sql)
    
    console.log('✅ Destaques da cena inseridos com sucesso!')
    
    // Verificar os dados inseridos
    const destaques = await db.all('SELECT * FROM destaques_cena ORDER BY ordem ASC')
    console.log(`📊 Total de destaques inseridos: ${destaques.length}`)
    
    destaques.forEach(destaque => {
      console.log(`  - ${destaque.titulo} (Ordem: ${destaque.ordem}, Ativo: ${destaque.ativo ? 'Sim' : 'Não'})`)
    })
    
  } catch (error) {
    console.error('❌ Erro ao inserir destaques:', error)
  } finally {
    await db.close()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedDestaques()
}

module.exports = seedDestaques
