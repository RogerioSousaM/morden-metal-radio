const Database = require('./database')

async function createBandsTable() {
  const db = new Database()
  
  try {
    await db.init()
    console.log('✅ Conectado ao banco SQLite')
    
    // Criar tabela de bandas
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS bandas_cena (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        official_url TEXT,
        image_url TEXT NOT NULL,
        genre_tags TEXT NOT NULL,
        featured BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    await db.run(createTableSQL)
    console.log('✅ Tabela bandas_cena criada/verificada')
    
    // Criar índices
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_bandas_cena_slug ON bandas_cena(slug)',
      'CREATE INDEX IF NOT EXISTS idx_bandas_cena_featured ON bandas_cena(featured)',
      'CREATE INDEX IF NOT EXISTS idx_bandas_cena_genre_tags ON bandas_cena(genre_tags)',
      'CREATE INDEX IF NOT EXISTS idx_bandas_cena_created_at ON bandas_cena(created_at)'
    ]
    
    for (const indexSQL of indexes) {
      try {
        await db.run(indexSQL)
        console.log('✅ Índice criado/verificado')
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('⚠️ Índice já existe')
        } else {
          console.log('✅ Índice criado')
        }
      }
    }
    
    // Inserir dados das bandas
    const insertSQL = `
      INSERT OR REPLACE INTO bandas_cena (
        name, slug, description, official_url, image_url, genre_tags, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    
    const bands = [
      {
        name: 'Sleep Token',
        slug: 'sleep-token',
        description: 'Sleep Token é uma banda britânica de metal alternativo que mistura elementos de metalcore, djent e música eletrônica. Conhecida por sua identidade misteriosa, performances teatrais e som único que combina riffs pesados com vocais melódicos e atmosferas etéreas.',
        official_url: 'https://sleeptoken.com',
        image_url: 'https://i.scdn.co/image/ab6761610000e5ebd00c2ff422829437e6b5f1e0',
        genre_tags: '["metal alternativo", "metalcore", "djent", "post-metal", "atmosférico"]',
        featured: 1
      },
      {
        name: 'Spiritbox',
        slug: 'spiritbox',
        description: 'Spiritbox é uma banda canadense de metalcore progressivo que se destaca por sua abordagem inovadora ao gênero. Combinando elementos de djent, metalcore melódico e rock alternativo, a banda criou um som único que equilibra brutalidade técnica com emoção e melodia.',
        official_url: 'https://spiritbox.com',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPs-aSYBrewbTkT4v3pDdZI7vEheq-HweEwg&s',
        genre_tags: '["metalcore progressivo", "djent", "metal alternativo", "rock progressivo"]',
        featured: 1
      },
      {
        name: 'Architects',
        slug: 'architects',
        description: 'Architects é uma banda britânica de metalcore que se tornou uma das principais referências do gênero. Com uma evolução constante desde seu início, a banda combina riffs técnicos, breakdowns devastadores e letras profundas sobre temas sociais e existenciais.',
        official_url: 'https://architectsofficial.com',
        image_url: 'https://i.scdn.co/image/ab6761610000e5ebc849b02f9ed4ad1d458f1c81',
        genre_tags: '["metalcore", "metalcore técnico", "metal alternativo", "hardcore"]',
        featured: 1
      },
      {
        name: 'Currents',
        slug: 'currents',
        description: 'Currents é uma banda americana de metalcore progressivo que se destaca por sua abordagem técnica e emocional ao gênero. Combinando riffs complexos de djent com melodias cativantes e letras introspectivas, a banda criou um som único no cenário metal moderno.',
        official_url: 'https://currentsmetal.com',
        image_url: 'https://img.seekr.cloud/cover/670/3/tqkk.jpg',
        genre_tags: '["metalcore progressivo", "djent", "metal alternativo", "post-hardcore"]',
        featured: 1
      }
    ]
    
    for (const band of bands) {
      await db.run(insertSQL, [
        band.name,
        band.slug,
        band.description,
        band.official_url,
        band.image_url,
        band.genre_tags,
        band.featured
      ])
      console.log(`✅ Banda inserida: ${band.name}`)
    }
    
    // Verificar inserções
    const countResult = await db.get('SELECT COUNT(*) as total FROM bandas_cena')
    console.log(`\n📊 Total de bandas na tabela: ${countResult.total}`)
    
    const allBands = await db.all('SELECT id, name, slug, featured FROM bandas_cena ORDER BY id')
    console.log('\n🎸 Bandas inseridas:')
    console.table(allBands)
    
    console.log('\n✨ Seeding das bandas concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await db.close()
  }
}

createBandsTable()
