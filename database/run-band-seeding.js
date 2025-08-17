const Database = require('./database')
const fs = require('fs').promises
const path = require('path')

class BandSeedingManager {
  constructor() {
    this.db = null
  }

  async init() {
    if (!this.db) {
      this.db = new Database()
      await this.db.init()
    }
  }

  async close() {
    if (this.db) {
      await this.db.close()
      this.db = null
    }
  }

  // Executar script SQL de seeding
  async runSeedingScript() {
    await this.init()
    
    console.log('🌱 Executando seeding das bandas da cena...\n')
    
    try {
      // Ler o arquivo SQL
      const sqlPath = path.join(__dirname, 'seed-bands.sql')
      const sqlContent = await fs.readFile(sqlPath, 'utf8')
      
      // Separar comandos SQL
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
              const results = await this.db.all(command)
              console.log(`✅ Comando ${i + 1} executado (SELECT):`)
              console.table(results)
            } else {
              // Para outros comandos, executar sem mostrar resultados
              await this.db.run(command)
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
      
      console.log('\n✨ Seeding concluído com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro durante o seeding:', error)
      throw error
    }
  }

  // Verificar se as bandas foram inseridas
  async verifySeeding() {
    await this.init()
    
    console.log('\n🔍 Verificando dados inseridos...\n')
    
    try {
      // Verificar total de bandas
      const countResult = await this.db.get('SELECT COUNT(*) as total FROM bandas_cena')
      console.log(`📊 Total de bandas na tabela: ${countResult.total}`)
      
      // Listar todas as bandas
      const bands = await this.db.all(`
        SELECT 
          id,
          name,
          slug,
          featured,
          created_at,
          official_url IS NOT NULL as has_url,
          image_url IS NOT NULL as has_image
        FROM bandas_cena 
        ORDER BY id
      `)
      
      console.log('\n🎸 Bandas inseridas:')
      console.table(bands)
      
      // Verificar detalhes de cada banda
      console.log('\n📋 Detalhes completos das bandas:')
      console.log('=' .repeat(80))
      
      for (const band of bands) {
        const details = await this.db.get(`
          SELECT * FROM bandas_cena WHERE id = ?
        `, [band.id])
        
        console.log(`\n🎸 ${details.name} (ID: ${details.id})`)
        console.log(`   Slug: ${details.slug}`)
        console.log(`   Featured: ${details.featured ? 'Sim' : 'Não'}`)
        console.log(`   URL Oficial: ${details.official_url || 'Não informada'}`)
        console.log(`   Imagem: ${details.image_url ? 'Sim' : 'Não'}`)
        console.log(`   Tags: ${details.genre_tags}`)
        console.log(`   Criado em: ${details.created_at}`)
        console.log(`   Atualizado em: ${details.updated_at}`)
      }
      
    } catch (error) {
      console.error('❌ Erro ao verificar seeding:', error)
      throw error
    }
  }

  // Executar processo completo
  async runCompleteSeeding() {
    try {
      console.log('🚀 INICIANDO PROCESSO COMPLETO DE SEEDING DAS BANDAS')
      console.log('=' .repeat(60))
      
      // 1. Executar script de seeding
      await this.runSeedingScript()
      
      // 2. Verificar dados inseridos
      await this.verifySeeding()
      
      // 3. Sugerir próximos passos
      console.log('\n🎯 PRÓXIMOS PASSOS RECOMENDADOS:')
      console.log('1. Executar validação de URLs: node validate-band-urls.js')
      console.log('2. Verificar se as imagens estão acessíveis')
      console.log('3. Atualizar URLs oficiais se necessário')
      console.log('4. Integrar com o sistema de destaques da cena')
      
      console.log('\n✨ Processo de seeding concluído com sucesso!')
      
    } catch (error) {
      console.error('❌ Erro durante o processo de seeding:', error)
      throw error
    } finally {
      await this.close()
    }
  }

  // Limpar dados de teste (se necessário)
  async cleanupTestData() {
    await this.init()
    
    console.log('🧹 Limpando dados de teste...')
    
    try {
      await this.db.run('DELETE FROM bandas_cena WHERE name LIKE "%test%"')
      console.log('✅ Dados de teste removidos')
    } catch (error) {
      console.error('❌ Erro ao limpar dados de teste:', error)
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const manager = new BandSeedingManager()
  
  manager.runCompleteSeeding()
    .then(() => {
      console.log('\n🎉 Seeding das bandas concluído!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n💥 Erro fatal durante o seeding:', error)
      process.exit(1)
    })
}

module.exports = BandSeedingManager
