const Database = require('./database')
const fetch = require('node-fetch')

class BandUrlValidator {
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

  // Validar se uma URL está acessível
  async validateUrl(url) {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      return {
        isValid: response.ok,
        statusCode: response.status,
        finalUrl: response.url,
        contentType: response.headers.get('content-type')
      }
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
        statusCode: null,
        finalUrl: url,
        contentType: null
      }
    }
  }

  // Buscar URLs alternativas para bandas
  async findAlternativeUrls(bandName) {
    const alternatives = {
      'Sleep Token': [
        'https://sleeptoken.com',
        'https://www.sleeptoken.com',
        'https://sleeptoken.bandcamp.com',
        'https://www.instagram.com/sleep_token',
        'https://twitter.com/sleep_token'
      ],
      'Spiritbox': [
        'https://spiritbox.com',
        'https://www.spiritbox.com',
        'https://spiritbox.bandcamp.com',
        'https://www.instagram.com/spiritboxband',
        'https://twitter.com/spiritboxband'
      ],
      'Architects': [
        'https://architectsofficial.com',
        'https://www.architectsofficial.com',
        'https://architects.bandcamp.com',
        'https://www.instagram.com/architects',
        'https://twitter.com/architectsuk'
      ],
      'Currents': [
        'https://currentsmetal.com',
        'https://www.currentsmetal.com',
        'https://currents.bandcamp.com',
        'https://www.instagram.com/currentsband',
        'https://twitter.com/currentsband'
      ]
    }

    return alternatives[bandName] || []
  }

  // Validar todas as URLs das bandas
  async validateAllBandUrls() {
    await this.init()
    
    console.log('🔍 Validando URLs das bandas da cena...\n')
    
    const selectSQL = 'SELECT id, name, official_url FROM bandas_cena'
    const bands = await this.db.all(selectSQL)
    
    const results = []
    
    for (const band of bands) {
      console.log(`📡 Validando: ${band.name}`)
      
      if (band.official_url) {
        const validation = await this.validateUrl(band.official_url)
        
        if (validation.isValid) {
          console.log(`✅ ${band.name}: URL válida (${validation.statusCode})`)
          results.push({
            band: band.name,
            url: band.official_url,
            status: 'valid',
            details: validation
          })
        } else {
          console.log(`❌ ${band.name}: URL inválida - ${validation.error || `Status: ${validation.statusCode}`}`)
          
          // Tentar encontrar URL alternativa
          const alternatives = await this.findAlternativeUrls(band.name)
          let alternativeFound = false
          
          for (const altUrl of alternatives) {
            if (altUrl === band.official_url) continue
            
            console.log(`🔄 Tentando alternativa: ${altUrl}`)
            const altValidation = await this.validateUrl(altUrl)
            
            if (altValidation.isValid) {
              console.log(`✅ URL alternativa válida encontrada: ${altUrl}`)
              
              // Atualizar no banco
              await this.updateBandUrl(band.id, altUrl)
              
              results.push({
                band: band.name,
                url: altUrl,
                status: 'updated',
                details: altValidation,
                originalUrl: band.official_url
              })
              
              alternativeFound = true
              break
            }
          }
          
          if (!alternativeFound) {
            results.push({
              band: band.name,
              url: band.official_url,
              status: 'invalid',
              details: validation,
              alternatives: alternatives
            })
          }
        }
      } else {
        console.log(`⚠️ ${band.name}: Sem URL oficial`)
        results.push({
          band: band.name,
          url: null,
          status: 'missing'
        })
      }
      
      console.log('') // Linha em branco para separar
    }
    
    return results
  }

  // Atualizar URL de uma banda
  async updateBandUrl(bandId, newUrl) {
    const updateSQL = `
      UPDATE bandas_cena 
      SET official_url = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `
    
    try {
      await this.db.run(updateSQL, [newUrl, bandId])
      console.log(`💾 URL atualizada para: ${newUrl}`)
    } catch (error) {
      console.error(`❌ Erro ao atualizar URL: ${error.message}`)
    }
  }

  // Gerar relatório de validação
  async generateValidationReport() {
    const results = await this.validateAllBandUrls()
    
    console.log('\n📊 RELATÓRIO DE VALIDAÇÃO DAS URLS')
    console.log('=' .repeat(50))
    
    const validCount = results.filter(r => r.status === 'valid' || r.status === 'updated').length
    const invalidCount = results.filter(r => r.status === 'invalid').length
    const missingCount = results.filter(r => r.status === 'missing').length
    
    console.log(`✅ URLs válidas: ${validCount}`)
    console.log(`❌ URLs inválidas: ${invalidCount}`)
    console.log(`⚠️ URLs ausentes: ${missingCount}`)
    console.log(`📈 Total de bandas: ${results.length}`)
    
    console.log('\n🔍 DETALHES POR BANDA:')
    console.log('-' .repeat(50))
    
    results.forEach(result => {
      console.log(`\n🎸 ${result.band}`)
      console.log(`   Status: ${result.status}`)
      
      if (result.url) {
        console.log(`   URL: ${result.url}`)
      }
      
      if (result.status === 'invalid' && result.alternatives) {
        console.log(`   Alternativas sugeridas:`)
        result.alternatives.forEach(alt => console.log(`     - ${alt}`))
      }
      
      if (result.status === 'updated') {
        console.log(`   URL original: ${result.originalUrl}`)
        console.log(`   URL nova: ${result.url}`)
      }
    })
    
    return results
  }

  // Verificar URLs das imagens também
  async validateImageUrls() {
    await this.init()
    
    console.log('\n🖼️ Validando URLs das imagens...\n')
    
    const selectSQL = 'SELECT id, name, image_url FROM bandas_cena'
    const bands = await this.db.all(selectSQL)
    
    for (const band of bands) {
      console.log(`📸 ${band.name}: ${band.image_url}`)
      
      try {
        const response = await fetch(band.image_url, { method: 'HEAD' })
        if (response.ok) {
          console.log(`✅ Imagem válida (${response.status})`)
        } else {
          console.log(`❌ Imagem inválida (${response.status})`)
        }
      } catch (error) {
        console.log(`❌ Erro ao validar imagem: ${error.message}`)
      }
    }
  }
}

// Executar validação se chamado diretamente
if (require.main === module) {
  const validator = new BandUrlValidator()
  
  validator.generateValidationReport()
    .then(() => validator.validateImageUrls())
    .then(() => {
      console.log('\n✨ Validação concluída!')
      validator.close()
    })
    .catch(error => {
      console.error('❌ Erro durante validação:', error)
      validator.close()
    })
}

module.exports = BandUrlValidator
