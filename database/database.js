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

      // Tabela de bandas
      `CREATE TABLE IF NOT EXISTS bands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        genre TEXT NOT NULL,
        description TEXT,
        listeners TEXT DEFAULT '0',
        rating REAL DEFAULT 0,
        is_featured BOOLEAN DEFAULT 0,
        image TEXT,
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

      // Tabela de notícias
      `CREATE TABLE IF NOT EXISTS news (
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

      // Tabela de vídeos
      `CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        thumbnail TEXT,
        duration INTEGER,
        is_featured BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Tabela de estatísticas
      `CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listeners INTEGER DEFAULT 0,
        top_band TEXT,
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

        // Inserir banda de exemplo
        await this.run(
          `INSERT INTO bands (name, genre, description, listeners, rating, is_featured, image) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            'Sleep Token',
            'Alternative Metal',
            'Misturando metal progressivo com elementos eletrônicos e vocais únicos',
            '15.2k',
            4.8,
            1,
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center'
          ]
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
          `INSERT INTO stats (listeners, top_band, next_program, system_alerts) 
           VALUES (?, ?, ?, ?)`,
          [1234, 'Sleep Token', 'Wake Up Metal', 0]
        )

        console.log('✅ Dados iniciais inseridos com sucesso')
      }
    } catch (error) {
      console.error('Erro ao inserir dados iniciais:', error)
    }
  }

  // Executar query com parâmetros
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({ id: this.lastID, changes: this.changes })
        }
      })
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