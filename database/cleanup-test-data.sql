-- ===== LIMPEZA DE DADOS DE TESTE E VERIFICAÇÃO FINAL =====

BEGIN TRANSACTION;

-- 1. Remover dados de teste
DELETE FROM bandas_cena WHERE slug = 'test-band';

-- 2. Verificar estado final das bandas
SELECT 'Estado final das bandas:' as info;
SELECT id, name, slug, featured FROM bandas_cena ORDER BY id;

-- 3. Verificar estado final dos banners
SELECT 'Estado final dos banners:' as info;
SELECT id, title, priority, active FROM banners ORDER BY id;

-- 4. Verificar estrutura das tabelas
SELECT 'Estrutura das tabelas principais:' as info;
SELECT name FROM sqlite_master WHERE type='table' AND name IN ('bandas_cena', 'banners', 'audit_logs');

-- 5. Verificar índices criados
SELECT 'Índices criados:' as info;
SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%';

-- 6. Contar registros finais
SELECT 'Contagem final de registros:' as info;
SELECT 
  (SELECT COUNT(*) FROM bandas_cena) as total_bandas,
  (SELECT COUNT(*) FROM banners) as total_banners,
  (SELECT COUNT(*) FROM audit_logs) as total_audit_logs;

COMMIT;

-- Verificação final
SELECT '✅ VERIFICAÇÃO FINAL CONCLUÍDA' as status;
