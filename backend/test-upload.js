const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

// Configuração
const API_BASE_URL = 'http://localhost:3001/api'
const TEST_TOKEN = 'your-test-token' // Substitua por um token válido

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

// Teste de upload
async function testUpload(mediaType, filePath, filename) {
  try {
    console.log(`\n🧪 Testando upload para ${mediaType}...`)
    
    const formData = new FormData()
    formData.append('files', fs.createReadStream(filePath), filename)
    formData.append('alt_text', `Teste ${mediaType}`)
    formData.append('is_featured', 'false')

    const response = await fetch(`${API_BASE_URL}/files/upload/${mediaType}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      },
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Upload bem-sucedido para ${mediaType}:`)
      console.log(`   - Arquivo: ${filename}`)
      console.log(`   - ID: ${result.files[0].id}`)
      console.log(`   - Tamanho: ${result.files[0].size} bytes`)
      return result.files[0]
    } else {
      const error = await response.text()
      console.log(`❌ Erro no upload para ${mediaType}: ${error}`)
      return null
    }
  } catch (error) {
    console.log(`❌ Erro no teste de upload para ${mediaType}:`, error.message)
    return null
  }
}

// Teste de listagem
async function testListFiles(mediaType) {
  try {
    console.log(`\n📋 Testando listagem de arquivos para ${mediaType}...`)
    
    const response = await fetch(`${API_BASE_URL}/files/files/${mediaType}`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Listagem bem-sucedida para ${mediaType}:`)
      console.log(`   - Total de arquivos: ${result.files.length}`)
      console.log(`   - Páginas: ${result.pagination.pages}`)
      return result.files
    } else {
      const error = await response.text()
      console.log(`❌ Erro na listagem para ${mediaType}: ${error}`)
      return []
    }
  } catch (error) {
    console.log(`❌ Erro no teste de listagem para ${mediaType}:`, error.message)
    return []
  }
}

// Teste de estatísticas
async function testStats() {
  try {
    console.log(`\n📊 Testando estatísticas...`)
    
    const response = await fetch(`${API_BASE_URL}/files/stats`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Estatísticas obtidas:`)
      console.log(`   - Total de arquivos: ${result.stats.total_files}`)
      console.log(`   - Tamanho total: ${result.stats.total_size} bytes`)
      console.log(`   - Imagens: ${result.stats.total_images}`)
  
      return result.stats
    } else {
      const error = await response.text()
      console.log(`❌ Erro ao obter estatísticas: ${error}`)
      return null
    }
  } catch (error) {
    console.log(`❌ Erro no teste de estatísticas:`, error.message)
    return null
  }
}

// Teste de visualização
async function testViewFile(fileId) {
  try {
    console.log(`\n👁️ Testando visualização do arquivo ${fileId}...`)
    
    const response = await fetch(`${API_BASE_URL}/files/view/${fileId}`)

    if (response.ok) {
      console.log(`✅ Visualização bem-sucedida para arquivo ${fileId}`)
      console.log(`   - Content-Type: ${response.headers.get('content-type')}`)
      console.log(`   - Content-Length: ${response.headers.get('content-length')}`)
      return true
    } else {
      const error = await response.text()
      console.log(`❌ Erro na visualização do arquivo ${fileId}: ${error}`)
      return false
    }
  } catch (error) {
    console.log(`❌ Erro no teste de visualização:`, error.message)
    return false
  }
}

// Teste de download
async function testDownloadFile(fileId) {
  try {
    console.log(`\n⬇️ Testando download do arquivo ${fileId}...`)
    
    const response = await fetch(`${API_BASE_URL}/files/download/${fileId}`)

    if (response.ok) {
      console.log(`✅ Download bem-sucedido para arquivo ${fileId}`)
      console.log(`   - Content-Type: ${response.headers.get('content-type')}`)
      console.log(`   - Content-Disposition: ${response.headers.get('content-disposition')}`)
      return true
    } else {
      const error = await response.text()
      console.log(`❌ Erro no download do arquivo ${fileId}: ${error}`)
      return false
    }
  } catch (error) {
    console.log(`❌ Erro no teste de download:`, error.message)
    return false
  }
}

// Teste de exclusão
async function testDeleteFile(fileId) {
  try {
    console.log(`\n🗑️ Testando exclusão do arquivo ${fileId}...`)
    
    const response = await fetch(`${API_BASE_URL}/files/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    })

    if (response.ok) {
      console.log(`✅ Exclusão bem-sucedida para arquivo ${fileId}`)
      return true
    } else {
      const error = await response.text()
      console.log(`❌ Erro na exclusão do arquivo ${fileId}: ${error}`)
      return false
    }
  } catch (error) {
    console.log(`❌ Erro no teste de exclusão:`, error.message)
    return false
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 Iniciando testes do sistema de upload...')
  
  // Criar arquivos de teste
  const testImagePath = createTestFile('test-image.jpg', 'fake image content')
  const testVideoPath = createTestFile('test-video.mp4', 'fake video content')
  
  // Teste 1: Upload de imagem para notícias
  const newsImage = await testUpload('news', testImagePath, 'test-image.jpg')
  
  // Teste 2: Upload de imagem para galeria
  const galleryImage = await testUpload('gallery', testImagePath, 'test-gallery-image.jpg')
  

  
  // Teste 4: Listagem de arquivos
  await testListFiles('all')
  await testListFiles('news')
  await testListFiles('gallery')

  
  // Teste 5: Estatísticas
  await testStats()
  
  // Teste 6: Visualização (se houver arquivo)
  if (newsImage) {
    await testViewFile(newsImage.id)
  }
  
  // Teste 7: Download (se houver arquivo)
  if (galleryImage) {
    await testDownloadFile(galleryImage.id)
  }
  

  
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
  runAllTests().catch(console.error)
}

module.exports = {
  testUpload,
  testListFiles,
  testStats,
  testViewFile,
  testDownloadFile,
  testDeleteFile,
  runAllTests
} 