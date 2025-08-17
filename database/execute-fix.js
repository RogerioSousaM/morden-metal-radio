const Database = require('./database')
const fs = require('fs').promises
const path = require('path')

async function executeFix() {
  const db = new Database()
  
  try {
    await db.init()
    console.log('✅ Conectado ao banco SQLite')
    
    // Ler o arquivo SQL de correção
    const sqlPath = path.join(__dirname, 'fix-missing-tables.sql')
    const sqlContent = await fs.readFile(sqlPath, 'utf8')
    
    console.log('🔧 Executando correções...\n')
    
    // Separar comandos SQL
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
    
    console.log(`📝 Executando ${commands.length} comandos de correção...\n`)
    
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
    
    console.log('\n✨ Correções aplicadas com sucesso!')
    
    // Verificar estado final
    console.log('\n🔍 VERIFICAÇÃO APÓS CORREÇÕES:')
    console.log('=' .repeat(50))
    
    // Verificar tabelas
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'")
    console.log('\n📋 Tabelas no banco:')
    console.table(tables)
    
    // Verificar dados das bandas
    const bands = await db.all('SELECT id, name, slug, featured FROM bandas_cena ORDER BY id')
    console.log('\n🎸 Bandas:')
    console.table(bands)
    
    // Verificar dados dos banners
    const banners = await db.all('SELECT id, title, priority, active FROM banners ORDER BY id')
    console.log('\n🖼️ Banners:')
    console.table(banners)
    
    // Verificar índices
    const indexes = await db.all("SELECT name FROM sqlite_master WHERE type='index'")
    console.log('\n🔍 Índices criados:')
    console.table(indexes)
    
    // Contar registros
    const bandCount = await db.get('SELECT COUNT(*) as total FROM bandas_cena')
    const bannerCount = await db.get('SELECT COUNT(*) as total FROM banners')
    const auditCount = await db.get('SELECT COUNT(*) as total FROM audit_logs')
    
    console.log(`\n📊 RESUMO FINAL:`)
    console.log(`   Bandas: ${bandCount.total}`)
    console.log(`   Banners: ${bannerCount.total}`)
    console.log(`   Logs de Auditoria: ${auditCount.total}`)
    console.log(`   Tabelas: ${tables.length}`)
    console.log(`   Índices: ${indexes.length}`)
    
    console.log('\n🎉 Correções concluídas com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante correções:', error)
  } finally {
    await db.close()
  }
}

executeFix()
