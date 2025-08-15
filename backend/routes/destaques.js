const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')

// Função para obter a instância do banco de dados
const getDatabase = () => {
  const Database = require('../../database/database')
  return new Database()
}

// GET /api/destaques - Listar destaques da cena para o MosaicGallery (público)
router.get('/', async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    
    // Buscar destaques da cena (entidade separada dos filmes)
    const destaques = await db.all(`
      SELECT id, titulo, descricao, imagem, link, ordem, ativo, created_at, updated_at 
      FROM destaques_cena 
      WHERE ativo = 1
      ORDER BY ordem ASC, created_at DESC
    `);
    
    console.log(`API /api/destaques: ${destaques.length} destaques da cena encontrados`)
    
    res.json({ 
      destaques,
      total: destaques.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar destaques da cena:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await db.close()
  }
})

// GET /api/destaques/admin - Listar todos os destaques para admin (protegido)
router.get('/admin', authenticateToken, async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    
    const destaques = await db.all(`
      SELECT id, titulo, descricao, imagem, link, ordem, ativo, created_at, updated_at 
      FROM destaques_cena 
      ORDER BY ordem ASC, created_at DESC
    `);
    
    console.log(`API /api/destaques/admin: ${destaques.length} destaques encontrados`)
    
    res.json({ 
      destaques,
      total: destaques.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar destaques para admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await db.close()
  }
})

// GET /api/destaques/:id - Buscar destaque específico
router.get('/:id', authenticateToken, async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    
    const destaque = await db.get(`
      SELECT id, titulo, descricao, imagem, link, ordem, ativo, created_at, updated_at 
      FROM destaques_cena 
      WHERE id = ?
    `, [req.params.id]);
    
    if (!destaque) {
      return res.status(404).json({ error: 'Destaque não encontrado' });
    }
    
    res.json({ destaque });
  } catch (error) {
    console.error('Erro ao buscar destaque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await db.close()
  }
})

// POST /api/destaques - Criar novo destaque
router.post('/', authenticateToken, async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    
    const { titulo, descricao, imagem, link, ordem, ativo } = req.body;
    
    if (!titulo || !descricao) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }
    
    const result = await db.run(`
      INSERT INTO destaques_cena (titulo, descricao, imagem, link, ordem, ativo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [titulo, descricao, imagem || null, link || null, ordem || 0, ativo !== undefined ? ativo : 1]);
    
    const novoDestaque = await db.get(`
      SELECT id, titulo, descricao, imagem, link, ordem, ativo, created_at, updated_at 
      FROM destaques_cena 
      WHERE id = ?
    `, [result.lastID]);
    
    console.log(`Novo destaque criado: ${novoDestaque.titulo}`);
    
    res.status(201).json({ 
      message: 'Destaque criado com sucesso',
      destaque: novoDestaque
    });
  } catch (error) {
    console.error('Erro ao criar destaque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await db.close()
  }
})

// PUT /api/destaques/:id - Atualizar destaque
router.put('/:id', authenticateToken, async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    
    const { titulo, descricao, imagem, link, ordem, ativo } = req.body;
    
    if (!titulo || !descricao) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }
    
    await db.run(`
      UPDATE destaques_cena 
      SET titulo = ?, descricao = ?, imagem = ?, link = ?, ordem = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [titulo, descricao, imagem || null, link || null, ordem || 0, ativo !== undefined ? ativo : 1, req.params.id]);
    
    const destaqueAtualizado = await db.get(`
      SELECT id, titulo, descricao, imagem, link, ordem, ativo, created_at, updated_at 
      FROM destaques_cena 
      WHERE id = ?
    `, [req.params.id]);
    
    if (!destaqueAtualizado) {
      return res.status(404).json({ error: 'Destaque não encontrado' });
    }
    
    console.log(`Destaque atualizado: ${destaqueAtualizado.titulo}`);
    
    res.json({ 
      message: 'Destaque atualizado com sucesso',
      destaque: destaqueAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar destaque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await db.close()
  }
})

// DELETE /api/destaques/:id - Excluir destaque
router.delete('/:id', authenticateToken, async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    
    const destaque = await db.get(`
      SELECT id, titulo FROM destaques_cena WHERE id = ?
    `, [req.params.id]);
    
    if (!destaque) {
      return res.status(404).json({ error: 'Destaque não encontrado' });
    }
    
    await db.run(`
      DELETE FROM destaques_cena WHERE id = ?
    `, [req.params.id]);
    
    console.log(`Destaque excluído: ${destaque.titulo}`);
    
    res.json({ 
      message: 'Destaque excluído com sucesso',
      destaque: { id: destaque.id, titulo: destaque.titulo }
    });
  } catch (error) {
    console.error('Erro ao excluir destaque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await db.close()
  }
})

// PUT /api/destaques/:id/toggle - Alternar status ativo/inativo
router.put('/:id/toggle', authenticateToken, async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    
    const destaque = await db.get(`
      SELECT id, titulo, ativo FROM destaques_cena WHERE id = ?
    `, [req.params.id]);
    
    if (!destaque) {
      return res.status(404).json({ error: 'Destaque não encontrado' });
    }
    
    const novoStatus = !destaque.ativo;
    
    await db.run(`
      UPDATE destaques_cena 
      SET ativo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [novoStatus, req.params.id]);
    
    console.log(`Status do destaque "${destaque.titulo}" alterado para: ${novoStatus ? 'Ativo' : 'Inativo'}`);
    
    res.json({ 
      message: `Destaque ${novoStatus ? 'ativado' : 'desativado'} com sucesso`,
      destaque: { id: destaque.id, titulo: destaque.titulo, ativo: novoStatus }
    });
  } catch (error) {
    console.error('Erro ao alternar status do destaque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await db.close()
  }
})

// PUT /api/destaques/reorder - Reordenar destaques
router.put('/reorder', authenticateToken, async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    
    const { reorderData } = req.body; // Array de {id, ordem}
    
    if (!Array.isArray(reorderData)) {
      return res.status(400).json({ error: 'Dados de reordenação inválidos' });
    }
    
    // Atualizar ordem de cada destaque
    for (const item of reorderData) {
      await db.run(`
        UPDATE destaques_cena 
        SET ordem = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [item.ordem, item.id]);
    }
    
    console.log(`Reordenação concluída para ${reorderData.length} destaques`);
    
    res.json({ 
      message: 'Destaques reordenados com sucesso',
      reorderData
    });
  } catch (error) {
    console.error('Erro ao reordenar destaques:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await db.close()
  }
})

module.exports = router
