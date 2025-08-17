const Database = require('../../database/database')

class AuditMiddleware {
  constructor() {
    this.db = null
    this.logQueue = []
    this.isProcessing = false
    this.maxQueueSize = 100
    
    // Processar queue a cada 5 segundos
    setInterval(() => this.processQueue(), 5000)
  }

  async init() {
    if (!this.db) {
      this.db = new Database()
      await this.db.init()
    }
  }

  logAction(req, res, next) {
    const startTime = Date.now()
    
    // Capturar dados da requisição
    const auditData = {
      timestamp: new Date().toISOString(),
      action: this.getActionFromRequest(req),
      method: req.method,
      path: req.path,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent'),
      user_id: req.user?.id || null,
      user_role: req.user?.role || null,
      username: req.user?.username || null,
      request_body: req.method !== 'GET' ? JSON.stringify(req.body) : null,
      status_code: null,
      response_data: null,
      error_message: null,
      execution_time: null
    }

    // Interceptar resposta para capturar status e tempo
    const originalSend = res.send
    const originalJson = res.json
    const self = this
    
    res.send = function(data) {
      auditData.status_code = res.statusCode
      auditData.response_data = typeof data === 'string' ? data : JSON.stringify(data)
      auditData.execution_time = Date.now() - startTime
      
      // Salvar log de auditoria
      self.saveAuditLog(auditData)
      
      // Chamar função original
      return originalSend.call(this, data)
    }
    
    res.json = function(data) {
      auditData.status_code = res.statusCode
      auditData.response_data = JSON.stringify(data)
      auditData.execution_time = Date.now() - startTime
      
      // Salvar log de auditoria
      self.saveAuditLog(auditData)
      
      // Chamar função original
      return originalJson.call(this, data)
    }

    next()
  }

  getActionFromRequest(req) {
    const method = req.method
    const path = req.path
    
    // Mapear ações baseado no método e path
    if (path.includes('/auth/login')) return 'LOGIN_ATTEMPT'
    if (path.includes('/auth/logout')) return 'LOGOUT'
    if (path.includes('/bandas-cena')) return 'BANDAS_MANAGEMENT'
    if (path.includes('/banners')) return 'BANNERS_MANAGEMENT'
    if (path.includes('/upload')) return 'FILE_UPLOAD'
    if (path.includes('/destaques')) return 'DESTAQUES_MANAGEMENT'
    if (path.includes('/carousel')) return 'CAROUSEL_MANAGEMENT'
    
    return `${method}_${path.replace(/\//g, '_').toUpperCase()}`
  }

  async saveAuditLog(auditData) {
    // Garantir que o banco está inicializado
    await this.init()
    
    // Adicionar à queue em vez de salvar imediatamente
    if (this.logQueue.length < this.maxQueueSize) {
      this.logQueue.push(auditData)
    } else {
      console.warn('⚠️ Queue de auditoria cheia, descartando log')
    }
  }

  async processQueue() {
    if (this.isProcessing || this.logQueue.length === 0) return
    
    this.isProcessing = true
    
    try {
      // Processar até 10 logs por vez
      const batch = this.logQueue.splice(0, 10)
      
      for (const auditData of batch) {
        const maxRetries = 3
        const retryDelay = 100
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const query = `
              INSERT INTO audit_logs (
                timestamp, action, user_id, user_role, username, method, path,
                ip_address, user_agent, status_code, request_body, response_data,
                error_message, execution_time, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `
            
            const values = [
              auditData.timestamp,
              auditData.action,
              auditData.user_id,
              auditData.user_role,
              auditData.username,
              auditData.method,
              auditData.path,
              auditData.ip_address,
              auditData.user_agent,
              auditData.status_code,
              auditData.request_body,
              auditData.response_data,
              auditData.error_message,
              auditData.execution_time,
              new Date().toISOString()
            ]
            
            await this.db.run(query, values)
            break // Sucesso, sair do loop
            
          } catch (error) {
            if (error.code === 'SQLITE_BUSY' && attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
              continue
            }
            
            console.error(`❌ Erro ao salvar log de auditoria (tentativa ${attempt}/${maxRetries}):`, error)
            break
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao processar queue de auditoria:', error)
    } finally {
      this.isProcessing = false
    }
  }

  async close() {
    try {
      await this.db.close()
    } catch (error) {
      console.error('❌ Erro ao fechar conexão de auditoria:', error)
    }
  }
}

module.exports = AuditMiddleware
