const Database = require('./database')

async function migrateNewsTable() {
  const db = new Database()
  
  try {
    await db.init()
    console.log('✅ Banco de dados conectado')
    
    // Adicionar novos campos à tabela news
    const migrations = [
      'ALTER TABLE news ADD COLUMN band_name TEXT',
      'ALTER TABLE news ADD COLUMN media_urls TEXT', // JSON string
      'ALTER TABLE news ADD COLUMN news_summary TEXT',
      'ALTER TABLE news ADD COLUMN source_link TEXT'
    ]
    
    for (const migration of migrations) {
      try {
        await db.run(migration)
        console.log(`✅ ${migration}`)
      } catch (error) {
        if (error.message.includes('duplicate column name')) {
          console.log(`ℹ️ Campo já existe: ${migration}`)
        } else {
          console.error(`❌ Erro na migração: ${migration}`, error.message)
        }
      }
    }
    
    // Inserir dados de exemplo para Currents
    const currentsData = {
      title: 'Currents - Novo Single "It Only Gets Darker"',
      content: 'A banda Currents lançou o sombrio single "It Only Gets Darker", seu primeiro trabalho inédito desde o álbum "The Death We Seek", de 2023.',
      image: 'https://deadrhetoric.com/wp-content/uploads/2020/05/Currents-band-2020.jpg',
      author: 'Admin',
      is_published: 1,
      band_name: 'Currents',
      media_urls: JSON.stringify([
        'https://deadrhetoric.com/wp-content/uploads/2020/05/Currents-band-2020.jpg',
        'https://akamai.sscdn.co/uploadfile/letras/fotos/3/f/d/a/3fda36c5316f62e27a9a5d3560309d6c.jpg',
        'https://seattlerefined.com/resources/media2/16x9/full/1015/center/80/24b73c1f-cf92-4417-acfe-65a485bbef57-large16x9_537A5824.jpg'
      ]),
      news_summary: 'A banda Currents lançou o sombrio single *It Only Gets Darker*, seu primeiro trabalho inédito desde o álbum *The Death We Seek*, de 2023.',
      source_link: 'https://rocksound.tv/news/currents-unveil-sombre-single-it-only-gets-darker?utm_source=chatgpt.com'
    }
    
    // Verificar se já existe
    const existing = await db.get('SELECT id FROM news WHERE band_name = ?', [currentsData.band_name])
    
    if (!existing) {
      await db.run(
        `INSERT INTO news (title, content, image, author, is_published, band_name, media_urls, news_summary, source_link) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          currentsData.title,
          currentsData.content,
          currentsData.image,
          currentsData.author,
          currentsData.is_published,
          currentsData.band_name,
          currentsData.media_urls,
          currentsData.news_summary,
          currentsData.source_link
        ]
      )
      console.log('✅ Dados de exemplo para Currents inseridos')
    } else {
      console.log('ℹ️ Dados de exemplo para Currents já existem')
    }
    
    console.log('✅ Migração concluída com sucesso')
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
  } finally {
    process.exit(0)
  }
}

migrateNewsTable() 