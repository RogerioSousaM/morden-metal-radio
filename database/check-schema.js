const Database = require('./database')

async function checkSchema() {
  const db = new Database()
  
  try {
    console.log('📊 Verificando estrutura do banco de dados...')
    
    // Inicializar banco
    await db.init()
    
    // Listar todas as tabelas
    console.log('\n📋 Tabelas disponíveis:')
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tables.forEach(table => {
      console.log(`  - ${table.name}`)
    })
    
    // Verificar estrutura de cada tabela
    console.log('\n🏗️ Estrutura das tabelas:')
    
    for (const table of tables) {
      console.log(`\n📋 Tabela: ${table.name}`)
      const schema = await db.all(`PRAGMA table_info(${table.name})`)
      
      console.log('  Colunas:')
      schema.forEach(column => {
        const nullable = column.notnull ? 'NOT NULL' : 'NULL'
        const primary = column.pk ? 'PRIMARY KEY' : ''
        const defaultVal = column.dflt_value ? `DEFAULT ${column.dflt_value}` : ''
        
        console.log(`    - ${column.name} (${column.type}) ${nullable} ${primary} ${defaultVal}`.trim())
      })
      
      // Contagem de registros
      const count = await db.get(`SELECT COUNT(*) as count FROM ${table.name}`)
      console.log(`  Registros: ${count.count}`)
    }
    
    // Verificar dados de exemplo
    console.log('\n📈 Dados de exemplo:')
    
    // Usuários
    const users = await db.all('SELECT id, username, role, created_at FROM users LIMIT 3')
    console.log('\n👥 Usuários:')
    users.forEach(user => {
      console.log(`  - ID: ${user.id} | Username: ${user.username} | Role: ${user.role}`)
    })
    

    
    // Programas
    const programs = await db.all('SELECT id, title, start_time, end_time, host FROM programs LIMIT 3')
    console.log('\n📻 Programas:')
    programs.forEach(program => {
      console.log(`  - ID: ${program.id} | ${program.title} | ${program.start_time}-${program.end_time} | Host: ${program.host}`)
    })
    
    // Estatísticas
    const stats = await db.all('SELECT * FROM stats LIMIT 3')
    console.log('\n📊 Estatísticas:')
    stats.forEach(stat => {
      console.log(`  - ID: ${stat.id} | Listeners: ${stat.listeners} | Next Program: ${stat.next_program}`)
    })
    
    console.log('\n✅ Verificação da estrutura concluída!')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error)
  } finally {
    await db.close()
  }
}

// Executar verificação se chamado diretamente
if (require.main === module) {
  checkSchema()
}

module.exports = { checkSchema } 