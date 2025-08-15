const express = require('express')
const { body, validationResult } = require('express-validator')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// Função para obter a instância do banco de dados
const getDatabase = () => {
  const Database = require('../../database/database')
  return new Database()
}

// Middleware de validação
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('Erros de validação:', errors.array())
    return res.status(400).json({ 
      error: 'Dados inválidos',
      details: errors.array() 
    })
  }
  next()
}

// GET /api/filmes - Listar todos os filmes (público)
router.get('/', async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    const filmes = await db.all(
      "SELECT id, titulo, descricao, ano, nota, imagem, indicacao_do_mes, created_at FROM filmes ORDER BY created_at DESC"
    );
    res.json({ filmes });
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await db.close()
  }
})

// GET /api/filmes/test - Endpoint de teste para debug
router.get('/test', authenticateToken, async (req, res) => {
  res.json({ 
    message: 'API de filmes funcionando',
    user: req.user,
    timestamp: new Date().toISOString()
  })
})

// GET /api/filmes/destaque - Retornar indicação do mês (público)
router.get('/destaque', async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    const filme = await db.get(
      "SELECT id, titulo, descricao, ano, nota, imagem, indicacao_do_mes, created_at FROM filmes WHERE indicacao_do_mes = 1 ORDER BY created_at DESC LIMIT 1"
    );
    if (!filme) {
      return res.status(404).json({ error: 'Nenhuma indicação do mês encontrada' });
    }
    res.json({ filme });
  } catch (error) {
    console.error('Erro ao buscar filme em destaque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await db.close()
  }
})

// POST /api/filmes - Criar novo filme (admin)
router.post('/', authenticateToken, [
  body('titulo')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Título é obrigatório e deve ter no máximo 100 caracteres')
    .escape(),
  body('descricao')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Descrição é obrigatória e deve ter no máximo 300 caracteres')
    .escape(),
  body('ano')
    .isInt({ min: 1900, max: 2099 })
    .withMessage('Ano deve estar entre 1900 e 2099'),
  body('nota')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Nota deve estar entre 0 e 5'),
  body('imagem')
    .optional()
    .custom((value) => {
      if (value && value.trim() !== '') {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    })
    .withMessage('URL da imagem deve ser válida'),
  body('indicacao_do_mes')
    .optional()
    .custom((value) => {
      return value === true || value === false || value === 0 || value === 1;
    })
    .withMessage('Indicação do mês deve ser um valor booleano'),
  validate
], async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    const { titulo, descricao, ano, nota, imagem, indicacao_do_mes } = req.body

    // Se este filme será indicação do mês, remover indicação dos outros
    if (indicacao_do_mes) {
      await db.run('UPDATE filmes SET indicacao_do_mes = 0')
    }

    // Converter tipos adequadamente
    const anoInt = parseInt(ano)
    const notaFloat = parseFloat(nota)
    const indicacaoBool = Boolean(indicacao_do_mes)
    const imagemUrl = imagem && imagem.trim() !== '' ? imagem : null
    
    console.log('Dados convertidos para INSERT:', {
      titulo,
      descricao,
      ano: anoInt,
      nota: notaFloat,
      imagem: imagemUrl,
      indicacao_do_mes: indicacaoBool
    })
    
    const result = await db.run(`
      INSERT INTO filmes (titulo, descricao, ano, nota, imagem, indicacao_do_mes)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [titulo, descricao, anoInt, notaFloat, imagemUrl, indicacaoBool])

    const novoFilme = await db.get('SELECT * FROM filmes WHERE id = ?', [result.lastID])
    
    res.status(201).json({ 
      message: 'Filme criado com sucesso',
      filme: novoFilme 
    })
  } catch (error) {
    console.error('Erro ao criar filme:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  } finally {
    await db.close()
  }
})

// PUT /api/filmes/:id - Atualizar filme (admin)
router.put('/:id', authenticateToken, [
  body('titulo')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Título é obrigatório e deve ter no máximo 100 caracteres')
    .escape(),
  body('descricao')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Descrição é obrigatória e deve ter no máximo 300 caracteres')
    .escape(),
  body('ano')
    .isInt({ min: 1900, max: 2099 })
    .withMessage('Ano deve estar entre 1900 e 2099'),
  body('nota')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Nota deve estar entre 0 e 5'),
  body('imagem')
    .optional()
    .custom((value) => {
      if (value && value.trim() !== '') {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    })
    .withMessage('URL da imagem deve ser válida'),
  body('indicacao_do_mes')
    .optional()
    .custom((value) => {
      return value === true || value === false || value === 0 || value === 1;
    })
    .withMessage('Indicação do mês deve ser um valor booleano'),
  validate
], async (req, res) => {
  const db = getDatabase()
  try {
    console.log('=== ATUALIZAÇÃO DE FILME ===')
    console.log('ID do filme:', req.params.id)
    console.log('Dados recebidos:', req.body)
    console.log('Headers:', req.headers)
    
    await db.init()
    const { id } = req.params
    const { titulo, descricao, ano, nota, imagem, indicacao_do_mes } = req.body

    // Verificar se o filme existe
    const filmeExistente = await db.get('SELECT * FROM filmes WHERE id = ?', [id])
    console.log('Filme existente:', filmeExistente)
    
    if (!filmeExistente) {
      console.log('Filme não encontrado')
      return res.status(404).json({ error: 'Filme não encontrado' })
    }

    // Se este filme será indicação do mês, remover indicação dos outros
    if (indicacao_do_mes) {
      console.log('Removendo indicação dos outros filmes')
      await db.run('UPDATE filmes SET indicacao_do_mes = 0 WHERE id != ?', [id])
    }

    console.log('Executando UPDATE com dados:', [titulo, descricao, ano, nota, imagem || null, indicacao_do_mes || false, id])
    
    // Converter tipos adequadamente
    const anoInt = parseInt(ano)
    const notaFloat = parseFloat(nota)
    const indicacaoBool = Boolean(indicacao_do_mes)
    const imagemUrl = imagem && imagem.trim() !== '' ? imagem : null
    
    console.log('Dados convertidos para UPDATE:', {
      titulo,
      descricao,
      ano: anoInt,
      nota: notaFloat,
      imagem: imagemUrl,
      indicacao_do_mes: indicacaoBool,
      id
    })
    
    await db.run(`
      UPDATE filmes 
      SET titulo = ?, descricao = ?, ano = ?, nota = ?, imagem = ?, 
          indicacao_do_mes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [titulo, descricao, anoInt, notaFloat, imagemUrl, indicacaoBool, id])

    const filmeAtualizado = await db.get('SELECT * FROM filmes WHERE id = ?', [id])
    console.log('Filme atualizado:', filmeAtualizado)
    
    res.json({ 
      message: 'Filme atualizado com sucesso',
      filme: filmeAtualizado 
    })
  } catch (error) {
    console.error('Erro detalhado ao atualizar filme:', error)
    console.error('Stack trace:', error.stack)
    res.status(500).json({ error: `Erro interno do servidor: ${error.message}` })
  } finally {
    await db.close()
  }
})

// DELETE /api/filmes/:id - Excluir filme (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  const db = getDatabase()
  try {
    await db.init()
    const { id } = req.params

    // Verificar se o filme existe
    const filme = await db.get('SELECT * FROM filmes WHERE id = ?', [id])
    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado' })
    }

    await db.run('DELETE FROM filmes WHERE id = ?', [id])
    
    res.json({ message: 'Filme excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir filme:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  } finally {
    await db.close()
  }
})

module.exports = router 