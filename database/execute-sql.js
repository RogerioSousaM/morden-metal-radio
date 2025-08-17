const Database = require('./database')
const fs = require('fs').promises
const path = require('path')

async function executeSQLScript() {
  const db = new Database()
  
  try {
    await db.init()
    console.log('✅ Conectado ao banco SQLite')
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'complete-setup.sql')
    const sqlContent = await fs.readFile(sqlPath, 'utf8')
    
    console.log('📝 Executando script SQL completo...\n')
    
    // Separar comandos SQL (ignorar comentários e linhas vazias)
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
    
    console.log(`📝 Executando ${commands.length} comandos SQL...\n`)
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      
      if (command.trim()) {
        try {
          if (command.toLowerCase().includes('select')) {
            // Para comandos SELECT, executar e mostrar resultados
            const results = await db.all(command)
            console.log(`✅ Comando ${i + 1} executado (SELECT):`)
            console.table(results)
          } else {
            // Para outros comandos, executar sem mostrar resultados
            await db.run(command)
            console.log(`✅ Comando ${i + 1} executado com sucesso`)
          }
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`⚠️ Comando ${i + 1}: ${error.message}`)
          } else {
            console.error(`❌ Erro no comando ${i + 1}: ${error.message}`)
          }
        }
      }
    }
    
    console.log('\n✨ Script SQL executado com sucesso!')
    
    // Verificar estado final do banco
    console.log('\n🔍 VERIFICAÇÃO FINAL DO BANCO:')
    console.log('=' .repeat(50))
    
    // Verificar tabelas criadas
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('\n📋 Tabelas no banco:')
    console.table(tables)
    
    // Verificar dados das bandas
    const bands = await db.all('SELECT id, name, slug, featured FROM bandas_cena ORDER BY id')
    console.log('\n🎸 Bandas inseridas:')
    console.table(bands)
    
    // Verificar dados dos banners
    const banners = await db.all('SELECT id, title, priority, active FROM banners ORDER BY id')
    console.log('\n🖼️ Banners inseridos:')
    console.table(banners)
    
    // Contar registros
    const bandCount = await db.get('SELECT COUNT(*) as total FROM bandas_cena')
    const bannerCount = await db.get('SELECT COUNT(*) as total FROM banners')
    
    console.log(`\n📊 RESUMO:`)
    console.log(`   Bandas: ${bandCount.total}`)
    console.log(`   Banners: ${bannerCount.total}`)
    console.log(`   Tabelas: ${tables.length}`)
    
    console.log('\n🎉 Setup do banco concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante execução:', error)
  } finally {
    await db.close()
  }
}

executeSQLScript()
