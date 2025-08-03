const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

// Configuração
const API_BASE_URL = 'http://localhost:3001/api'
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsImlhdCI6MTczNDU2NzIwMCwiZXhwIjoxNzM0NjUzNjAwfQ.example'

// Criar arquivo de teste
function createTestFile(filename, content) {
  const testDir = path.join(__dirname, 'test-files')
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
  }

  const filePath = path.join(testDir, filename)
  fs.writeFileSync(filePath, content)
  return filePath
}

// Teste de upload usando XMLHttpRequest simulado
async function testUpload(mediaType, filePath, filename) {
  console.log(`🧪 Testando upload para ${mediaType}...`)
  
  try {
    const formData = new FormData()
    formData.append('files', fs.createReadStream(filePath), filename)
    formData.append('alt_text', `Teste ${mediaType}`)
    formData.append('description', `Arquivo de teste para ${mediaType}`)

    const response = await fetch(`${API_BASE_URL}/files/upload/${mediaType}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      },
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Upload para ${mediaType} bem-sucedido:`, result)
      return result.files[0]
    } else {
      const error = await response.text()
      console.log(`❌ Erro no upload para ${mediaType}:`, error)
      return null
    }
  } catch (error) {
    console.log(`❌ Erro no teste de upload para ${mediaType}:`, error.message)
    return null
  }
}

// Teste de listagem
async function testListFiles(mediaType) {
  console.log(`📋 Testando listagem de arquivos para ${mediaType}...`)
  
  try {
    const response = await fetch(`${API_BASE_URL}/files/files/${mediaType}`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Listagem para ${mediaType}:`, result)
      return result
    } else {
      const error = await response.text()
      console.log(`❌ Erro na listagem para ${mediaType}:`, error)
      return null
    }
  } catch (error) {
    console.log(`❌ Erro no teste de listagem para ${mediaType}:`, error.message)
    return null
  }
}

// Teste de estatísticas
async function testStats() {
  console.log(`📊 Testando estatísticas...`)
  
  try {
    const response = await fetch(`${API_BASE_URL}/files/stats`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Estatísticas:`, result)
      return result
    } else {
      const error = await response.text()
      console.log(`❌ Erro nas estatísticas:`, error)
      return null
    }
  } catch (error) {
    console.log(`❌ Erro no teste de estatísticas:`, error.message)
    return null
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes do sistema de upload...')

  // Criar arquivos de teste
  const testImagePath = createTestFile('test-image.jpg', 'fake image content')
  const testVideoPath = createTestFile('test-video.mp4', 'fake video content')

  // Teste 1: Upload de imagem para notícias
  const newsImage = await testUpload('news', testImagePath, 'test-image.jpg')

  // Teste 2: Upload de imagem para galeria
  const galleryImage = await testUpload('gallery', testImagePath, 'test-gallery-image.jpg')

  // Teste 3: Upload de vídeo
  const video = await testUpload('videos', testVideoPath, 'test-video.mp4')

  // Teste 4: Listagem de arquivos
  await testListFiles('all')
  await testListFiles('news')
  await testListFiles('gallery')
  await testListFiles('videos')

  // Teste 5: Estatísticas
  await testStats()

  // Limpar arquivos de teste
  console.log('\n🧹 Limpando arquivos de teste...')
  if (fs.existsSync(testImagePath)) {
    fs.unlinkSync(testImagePath)
  }
  if (fs.existsSync(testVideoPath)) {
    fs.unlinkSync(testVideoPath)
  }

  console.log('\n✅ Testes concluídos!')
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = {
  testUpload,
  testListFiles,
  testStats,
  runTests
} 