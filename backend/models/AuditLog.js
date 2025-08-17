const Database = require('../../database/database')

class AuditLog {
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

  // Criar tabela de auditoria se não existir
  async createTable() {
    await this.init()
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        action TEXT NOT NULL,
        user_id INTEGER,
        user_role TEXT,
        username TEXT,
        method TEXT NOT NULL,
        path TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        status_code INTEGER,
        request_body TEXT,
        response_data TEXT,
        error_message TEXT,
        execution_time INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    await this.db.run(createTableSQL)
    
    // Criar índices para consultas eficientes
    const createIndexesSQL = [
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_path ON audit_logs(path)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_status_code ON audit_logs(status_code)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)'
    ]
    
    for (const indexSQL of createIndexesSQL) {
      try {
        await this.db.run(indexSQL)
      } catch (error) {
        // Índice já existe, ignorar erro
        console.log('Índice já existe:', indexSQL)
      }
    }
  }

  // Registrar uma ação de auditoria
  async logAction(auditData) {
    await this.init()
    
    const {
      action,
      userId,
      userRole,
      username,
      method,
      path,
      ipAddress,
      userAgent,
      statusCode,
      requestBody,
      responseData,
      errorMessage,
      executionTime
    } = auditData
    
    const insertSQL = `
      INSERT INTO audit_logs (
        action, user_id, user_role, username, method, path, ip_address, 
        user_agent, status_code, request_body, response_data, error_message, execution_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    
    const params = [
      action,
      userId || null,
      userRole || null,
      username || null,
      method,
      path,
      ipAddress || null,
      userAgent || null,
      statusCode || null,
      requestBody ? JSON.stringify(requestBody) : null,
      responseData ? JSON.stringify(responseData) : null,
      errorMessage || null,
      executionTime || null
    ]
    
    try {
      const result = await this.db.run(insertSQL, params)
      return result.id
    } catch (error) {
      console.error('Erro ao registrar log de auditoria:', error)
      throw error
    }
  }

  // Buscar logs por filtros
  async getLogs(filters = {}, pagination = {}) {
    await this.init()
    
    let whereClause = 'WHERE 1=1'
    const params = []
    
    // Filtros
    if (filters.action) {
      whereClause += ' AND action = ?'
      params.push(filters.action)
    }
    
    if (filters.userId) {
      whereClause += ' AND user_id = ?'
      params.push(filters.userId)
    }
    
    if (filters.userRole) {
      whereClause += ' AND user_role = ?'
      params.push(filters.userRole)
    }
    
    if (filters.path) {
      whereClause += ' AND path LIKE ?'
      params.push(`%${filters.path}%`)
    }
    
    if (filters.statusCode) {
      whereClause += ' AND status_code = ?'
      params.push(filters.statusCode)
    }
    
    if (filters.startDate) {
      whereClause += ' AND timestamp >= ?'
      params.push(filters.startDate)
    }
    
    if (filters.endDate) {
      whereClause += ' AND timestamp <= ?'
      params.push(filters.endDate)
    }
    
    // Paginação
    const limit = pagination.limit || 50
    const offset = pagination.offset || 0
    
    // Query principal
    const selectSQL = `
      SELECT * FROM audit_logs 
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `
    
    // Query de contagem total
    const countSQL = `
      SELECT COUNT(*) as total FROM audit_logs 
      ${whereClause}
    `
    
    try {
      const [logs, countResult] = await Promise.all([
        this.db.all(selectSQL, [...params, limit, offset]),
        this.db.get(countSQL, params)
      ])
      
      return {
        logs: logs.map(log => ({
          ...log,
          requestBody: log.requestBody ? JSON.parse(log.requestBody) : null,
          responseData: log.responseData ? JSON.parse(log.responseData) : null
        })),
        total: countResult.total,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(countResult.total / limit)
      }
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error)
      throw error
    }
  }

  // Buscar log específico por ID
  async getLogById(id) {
    await this.init()
    
    const selectSQL = 'SELECT * FROM audit_logs WHERE id = ?'
    
    try {
      const log = await this.db.get(selectSQL, [id])
      
      if (log) {
        return {
          ...log,
          requestBody: log.requestBody ? JSON.parse(log.requestBody) : null,
          responseData: log.responseData ? JSON.parse(log.responseData) : null
        }
      }
      
      return null
    } catch (error) {
      console.error('Erro ao buscar log por ID:', error)
      throw error
    }
  }

  // Limpar logs antigos (manutenção)
  async cleanupOldLogs(daysToKeep = 90) {
    await this.init()
    
    const deleteSQL = `
      DELETE FROM audit_logs 
      WHERE timestamp < datetime('now', '-${daysToKeep} days')
    `
    
    try {
      const result = await this.db.run(deleteSQL)
      console.log(`🧹 Limpeza de logs: ${result.changes} registros removidos`)
      return result.changes
    } catch (error) {
      console.error('Erro ao limpar logs antigos:', error)
      throw error
    }
  }

  // Estatísticas de auditoria
  async getStats(timeRange = '30d') {
    await this.init()
    
    let timeFilter = ''
    switch (timeRange) {
      case '7d':
        timeFilter = "AND timestamp >= datetime('now', '-7 days')"
        break
      case '30d':
        timeFilter = "AND timestamp >= datetime('now', '-30 days')"
        break
      case '90d':
        timeFilter = "AND timestamp >= datetime('now', '-90 days')"
        break
      case '1y':
        timeFilter = "AND timestamp >= datetime('now', '-1 year')"
        break
      default:
        timeFilter = "AND timestamp >= datetime('now', '-30 days')"
    }
    
    const statsSQL = `
      SELECT 
        action,
        COUNT(*) as count,
        AVG(execution_time) as avg_execution_time,
        MAX(execution_time) as max_execution_time,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count
      FROM audit_logs 
      WHERE 1=1 ${timeFilter}
      GROUP BY action
      ORDER BY count DESC
    `
    
    const userStatsSQL = `
      SELECT 
        user_role,
        COUNT(*) as action_count,
        COUNT(DISTINCT user_id) as unique_users
      FROM audit_logs 
      WHERE 1=1 ${timeFilter} AND user_id IS NOT NULL
      GROUP BY user_role
      ORDER BY action_count DESC
    `
    
    try {
      const [actionStats, userStats] = await Promise.all([
        this.db.all(statsSQL),
        this.db.all(userStatsSQL)
      ])
      
      return {
        actionStats,
        userStats,
        timeRange
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas de auditoria:', error)
      throw error
    }
  }

  // Exportar logs para CSV
  async exportToCSV(filters = {}) {
    await this.init()
    
    let whereClause = 'WHERE 1=1'
    const params = []
    
    // Aplicar filtros
    if (filters.startDate) {
      whereClause += ' AND timestamp >= ?'
      params.push(filters.startDate)
    }
    
    if (filters.endDate) {
      whereClause += ' AND timestamp <= ?'
      params.push(filters.endDate)
    }
    
    const selectSQL = `
      SELECT 
        timestamp,
        action,
        username,
        user_role,
        method,
        path,
        ip_address,
        status_code,
        execution_time
      FROM audit_logs 
      ${whereClause}
      ORDER BY timestamp DESC
    `
    
    try {
      const logs = await this.db.all(selectSQL, params)
      
      // Converter para CSV
      const headers = [
        'Timestamp',
        'Action',
        'Username',
        'User Role',
        'Method',
        'Path',
        'IP Address',
        'Status Code',
        'Execution Time (ms)'
      ].join(',')
      
      const csvRows = logs.map(log => [
        log.timestamp,
        log.action,
        log.username || '',
        log.user_role || '',
        log.method,
        log.path,
        log.ip_address || '',
        log.status_code || '',
        log.execution_time || ''
      ].join(','))
      
      return [headers, ...csvRows].join('\n')
    } catch (error) {
      console.error('Erro ao exportar logs para CSV:', error)
      throw error
    }
  }
}

module.exports = AuditLog
