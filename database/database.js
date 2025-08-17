const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const bcrypt = require('bcryptjs')

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, 'morden_metal.db')
    this.db = null
  }

  // Inicializar conexão com o banco
  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Erro ao conectar com o banco:', err)
          reject(err)
        } else {
          console.log('✅ Conectado ao banco SQLite')
          
          // Configurações para melhor concorrência
          this.db.configure('busyTimeout', 30000) // 30 segundos timeout
          this.db.run('PRAGMA journal_mode = WAL') // Write-Ahead Logging
          this.db.run('PRAGMA synchronous = NORMAL') // Sincronização otimizada
          this.db.run('PRAGMA cache_size = 10000') // Cache aumentado
          this.db.run('PRAGMA temp_store = MEMORY') // Armazenamento temporário em memória
          
          this.createTables()
            .then(() => this.seedData())
            .then(() => resolve())
            .catch(reject)
        }
      })
    })
  }

  // Criar tabelas
  async createTables() {
    const tables = [
      // Tabela de usuários
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,



      // Tabela de programas
      `CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        host TEXT NOT NULL,
        genre TEXT NOT NULL,
        description TEXT,
        is_live BOOLEAN DEFAULT 0,
        listeners TEXT DEFAULT '0',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Tabela de destaques
      `CREATE TABLE IF NOT EXISTS highlights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT,
        author TEXT DEFAULT 'Admin',
        is_published BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Tabela de imagens
      `CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        path TEXT NOT NULL,
        alt_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Tabela de filmes
      `CREATE TABLE IF NOT EXISTS filmes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        ano INTEGER NOT NULL,
        nota REAL NOT NULL,
        imagem TEXT,
        indicacao_do_mes BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Tabela de destaques da cena (MosaicGallery)
      `CREATE TABLE IF NOT EXISTS destaques_cena (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        imagem TEXT,
        link TEXT,
        ordem INTEGER DEFAULT 0,
        ativo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Tabela de banners publicitários
      `CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        target_url TEXT,
        start_at DATETIME NOT NULL,
        end_at DATETIME NOT NULL,
        priority INTEGER DEFAULT 1,
        locations TEXT NOT NULL, -- JSON: ['hero', 'sidebar', 'footer']
        active BOOLEAN DEFAULT 1,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Índices para banners
      `CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active)`,
      `CREATE INDEX IF NOT EXISTS idx_banners_dates ON banners(start_at, end_at)`,
      `CREATE INDEX IF NOT EXISTS idx_banners_priority ON banners(priority)`,
      `CREATE INDEX IF NOT EXISTS idx_banners_locations ON banners(locations)`,

      // Tabela de estatísticas
      `CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listeners INTEGER DEFAULT 0,
        next_program TEXT,
        system_alerts INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ]

    for (const table of tables) {
      await this.run(table)
    }

    console.log('✅ Tabelas criadas com sucesso')
  }

  // Inserir dados iniciais
  async seedData() {
    try {
      // Verificar se já existem dados
      const userCount = await this.get('SELECT COUNT(*) as count FROM users')
      
      if (userCount.count === 0) {
        // Criar usuário admin
        const hashedPassword = await bcrypt.hash('mordenmetal2024', 10)
        await this.run(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          ['admin', hashedPassword, 'admin']
        )



        // Inserir programa de exemplo
        await this.run(
          `INSERT INTO programs (title, start_time, end_time, host, genre, description, is_live, listeners) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'Metal Noturno',
            '00:00',
            '06:00',
            'DJ Shadow',
            'Classic Metal',
            'Os melhores clássicos do metal para acompanhar a madrugada',
            0,
            '234'
          ]
        )

        // Inserir estatísticas iniciais
        await this.run(
          `INSERT INTO stats (listeners, next_program, system_alerts) 
           VALUES (?, ?, ?)`,
          [1234, 'Wake Up Metal', 0]
        )

        // Inserir dados de exemplo para filmes
        await this.run(`
          INSERT INTO filmes (titulo, descricao, ano, nota, imagem, indicacao_do_mes) VALUES
          ('O Mal que Nos Habita', 'Uma família se muda para uma casa isolada e descobre que há algo sinistro habitando nas paredes. O filme explora temas de isolamento, paranoia e o medo do desconhecido.', 2023, 4.5, 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZU1s3QYrU5tX8ih7wRVCbkiBAdl4_SKbaGAxKLzEEoCkjl0V_M-Lt9qljRPhSwXHM3DBoLqdl2EmHgbS3okz-MG4RDIGVE73BFNhDHFY06EJv31VW6UsqlbefctU9eRT7ZcAeOEloj4Mkd0KTpuJVPCQcV9ZgpUKVsSb7Yvucs1eAODJDq05R6cObyuE/s929/Mal.jpg', 1),
          ('A Hora do Mal', 'Um grupo de amigos enfrenta uma entidade demoníaca que se alimenta de seus medos mais profundos. Uma jornada psicológica que testa os limites da sanidade humana.', 2022, 4.2, 'https://trilhadomedo.com/wp-content/uploads/2025/04/a-hora-do-mal-trailer-600x600.webp', 0),
          ('Terrifier 2', 'Art the Clown retorna para aterrorizar uma nova vítima em uma noite de Halloween sangrenta. Gore extremo e terror psicológico em sua forma mais brutal.', 2022, 4.0, 'https://images.mubicdn.net/images/film/244717/cache-818278-1745500459/image-w1280.jpg?size=800x', 0),
          ('Hereditário', 'Uma família é atormentada por uma presença demoníaca após a morte da avó matriarca. Um dos filmes de terror mais aclamados da década.', 2018, 4.8, 'https://m.media-amazon.com/images/M/MV5BNmZhMTU1YjAtYzZhZi00YzJhLWFhMjktY2I4OTMxOGVjMmRhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 0),
          ('Midsommar', 'Um casal viaja para um festival de verão na Suécia que se transforma em um pesadelo pagão. Terror folk horror com elementos de drama psicológico.', 2019, 4.3, 'https://m.media-amazon.com/images/M/MV5BMzQxNzQzOTQxM15BMl5BanBnXkFtZTgwMDQ2NTcwODM@._V1_FMjpg_UX1000_.jpg', 0),
          ('The Witch', 'Uma família puritana do século XVII enfrenta forças sobrenaturais na floresta da Nova Inglaterra. Um filme de terror histórico meticulosamente pesquisado.', 2015, 4.6, 'https://m.media-amazon.com/images/M/MV5BMjA1NTc1NDg3Nl5BMl5BanBnXkFtZTgwNTc1MTQ2NzE@._V1_FMjpg_UX1000_.jpg', 0)
        `)

        console.log('✅ Dados iniciais inseridos com sucesso')
      }
    } catch (error) {
      console.error('Erro ao inserir dados iniciais:', error)
    }
  }

  // Executar query com parâmetros
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      const executeQuery = (attempt = 1) => {
        this.db.run(sql, params, function(err) {
          if (err) {
            if (err.code === 'SQLITE_BUSY' && attempt < 3) {
              // Aguardar antes de tentar novamente
              setTimeout(() => executeQuery(attempt + 1), 100 * attempt)
              return
            }
            reject(err)
          } else {
            resolve({ id: this.lastID, changes: this.changes })
          }
        })
      }
      
      executeQuery()
    })
  }

  // Buscar um registro
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  // Buscar múltiplos registros
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  // Fechar conexão
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err)
        } else {
          console.log('✅ Conexão com banco fechada')
          resolve()
        }
      })
    })
  }
}

module.exports = Database 