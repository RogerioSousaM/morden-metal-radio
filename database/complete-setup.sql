-- ===== SCRIPT COMPLETO DE SETUP DO BANCO =====
-- Execute este script para criar todas as tabelas necessárias

BEGIN TRANSACTION;

-- 1. Criar tabela de bandas da cena
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
);

-- 2. Criar tabela de banners
CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  target_url TEXT,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  priority INTEGER DEFAULT 1,
  locations TEXT NOT NULL,
  active BOOLEAN DEFAULT 1,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criar tabela de auditoria
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
);

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_bandas_cena_slug ON bandas_cena(slug);
CREATE INDEX IF NOT EXISTS idx_bandas_cena_featured ON bandas_cena(featured);
CREATE INDEX IF NOT EXISTS idx_bandas_cena_genre_tags ON bandas_cena(genre_tags);
CREATE INDEX IF NOT EXISTS idx_bandas_cena_created_at ON bandas_cena(created_at);

CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);
CREATE INDEX IF NOT EXISTS idx_banners_dates ON banners(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_banners_priority ON banners(priority);
CREATE INDEX IF NOT EXISTS idx_banners_locations ON banners(locations);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_path ON audit_logs(path);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status_code ON audit_logs(status_code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- 5. Inserir dados das bandas da cena
INSERT OR REPLACE INTO bandas_cena (name, slug, description, official_url, image_url, genre_tags, featured) VALUES 
('Sleep Token', 'sleep-token', 'Sleep Token é uma banda britânica de metal alternativo que mistura elementos de metalcore, djent e música eletrônica. Conhecida por sua identidade misteriosa, performances teatrais e som único que combina riffs pesados com vocais melódicos e atmosferas etéreas.', 'https://sleeptoken.com', 'https://i.scdn.co/image/ab6761610000e5ebd00c2ff422829437e6b5f1e0', '["metal alternativo", "metalcore", "djent", "post-metal", "atmosférico"]', 1),
('Spiritbox', 'spiritbox', 'Spiritbox é uma banda canadense de metalcore progressivo que se destaca por sua abordagem inovadora ao gênero. Combinando elementos de djent, metalcore melódico e rock alternativo, a banda criou um som único que equilibra brutalidade técnica com emoção e melodia.', 'https://spiritbox.com', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPs-aSYBrewbTkT4v3pDdZI7vEheq-HweEwg&s', '["metalcore progressivo", "djent", "metal alternativo", "rock progressivo"]', 1),
('Architects', 'architects', 'Architects é uma banda britânica de metalcore que se tornou uma das principais referências do gênero. Com uma evolução constante desde seu início, a banda combina riffs técnicos, breakdowns devastadores e letras profundas sobre temas sociais e existenciais.', 'https://architectsofficial.com', 'https://i.scdn.co/image/ab6761610000e5ebc849b02f9ed4ad1d458f1c81', '["metalcore", "metalcore técnico", "metal alternativo", "hardcore"]', 1),
('Currents', 'currents', 'Currents é uma banda americana de metalcore progressivo que se destaca por sua abordagem técnica e emocional ao gênero. Combinando riffs complexos de djent com melodias cativantes e letras introspectivas, a banda criou um som único no cenário metal moderno.', 'https://currents.bandcamp.com', 'https://img.seekr.cloud/cover/670/3/tqkk.jpg', '["metalcore progressivo", "djent", "metal alternativo", "post-hardcore"]', 1);

-- 6. Inserir dados de exemplo para banners
INSERT OR REPLACE INTO banners (title, image_url, target_url, start_at, end_at, priority, locations, active) VALUES 
('Novo Álbum Sleep Token', 'https://example.com/banner1.jpg', 'https://sleeptoken.com/new-album', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1, '["hero", "sidebar"]', 1),
('Spiritbox Tour 2024', 'https://example.com/banner2.jpg', 'https://spiritbox.com/tour', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 2, '["hero", "footer"]', 1),
('Architects - Latest Release', 'https://example.com/banner3.jpg', 'https://architectsofficial.com/latest', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 3, '["sidebar"]', 1);

COMMIT;

-- Verificar inserções
SELECT 'Bandas inseridas:' as info;
SELECT id, name, slug, featured FROM bandas_cena ORDER BY id;

SELECT 'Banners inseridos:' as info;
SELECT id, title, priority, active FROM banners ORDER BY id;

SELECT 'Tabelas criadas:' as info;
SELECT name FROM sqlite_master WHERE type='table' AND name IN ('bandas_cena', 'banners', 'audit_logs');
