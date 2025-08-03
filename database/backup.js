const fs = require('fs')
const path = require('path')
const Database = require('./database')

async function backupDatabase() {
  const db = new Database()
  const backupDir = path.join(__dirname, 'backups')
  
  try {
    // Criar diretório de backup se não existir
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    // Nome do arquivo de backup com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(backupDir, `morden_metal_backup_${timestamp}.db`)
    
    // Copiar arquivo do banco
    const dbPath = path.join(__dirname, 'morden_metal.db')
    
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath)
      console.log(`✅ Backup criado: ${backupPath}`)
      
      // Verificar integridade do backup
      const backupDb = new sqlite3.Database(backupPath)
      const tables = await new Promise((resolve, reject) => {
        backupDb.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        })
      })
      
      console.log(`📊 Backup contém ${tables.length} tabelas:`)
      tables.forEach(table => {
        console.log(`  - ${table.name}`)
      })
      
      backupDb.close()
    } else {
      console.log('❌ Arquivo do banco não encontrado')
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar backup:', error)
  }
}

// Executar backup se chamado diretamente
if (require.main === module) {
  backupDatabase()
}

module.exports = { backupDatabase } 