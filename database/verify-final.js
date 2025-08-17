const Database = require('./database')

async function verifyFinal() {
  const db = new Database()
  
  try {
    await db.init()
    console.log('🔍 VERIFICAÇÃO FINAL:')
    console.log('=' .repeat(30))
    
    const tables = await db.all('SELECT name FROM sqlite_master WHERE type="table"')
    console.log('📋 Tabelas:', tables.map(t => t.name))
    
    const bands = await db.all('SELECT COUNT(*) as total FROM bandas_cena')
    console.log('🎸 Bandas:', bands[0].total)
    
    const banners = await db.all('SELECT COUNT(*) as total FROM banners')
    console.log('🖼️ Banners:', banners[0].total)
    
    const audit = await db.all('SELECT COUNT(*) as total FROM audit_logs')
    console.log('📝 Logs de Auditoria:', audit[0].total)
    
    const indexes = await db.all('SELECT name FROM sqlite_master WHERE type="index"')
    console.log('🔍 Índices:', indexes.length)
    
    console.log('\n✅ Verificação concluída!')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await db.close()
  }
}

verifyFinal()
