-- ===== SEEDING DAS BANDAS DA CENA METAL =====

-- Criar tabela de bandas se não existir
CREATE TABLE IF NOT EXISTS bandas_cena (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  official_url TEXT,
  image_url TEXT NOT NULL,
  genre_tags TEXT NOT NULL, -- JSON array como string
  featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_bandas_cena_slug ON bandas_cena(slug);
CREATE INDEX IF NOT EXISTS idx_bandas_cena_featured ON bandas_cena(featured);
CREATE INDEX IF NOT EXISTS idx_bandas_cena_genre_tags ON bandas_cena(genre_tags);
CREATE INDEX IF NOT EXISTS idx_bandas_cena_created_at ON bandas_cena(created_at);

-- Inserir dados das bandas da cena
INSERT OR REPLACE INTO bandas_cena (
  name, 
  slug, 
  description, 
  official_url, 
  image_url, 
  genre_tags, 
  featured
) VALUES 
(
  'Sleep Token',
  'sleep-token',
  'Sleep Token é uma banda britânica de metal alternativo que mistura elementos de metalcore, djent e música eletrônica. Conhecida por sua identidade misteriosa, performances teatrais e som único que combina riffs pesados com vocais melódicos e atmosferas etéreas.',
  'https://sleeptoken.com',
  'https://i.scdn.co/image/ab6761610000e5ebd00c2ff422829437e6b5f1e0',
  '["metal alternativo", "metalcore", "djent", "post-metal", "atmosférico"]',
  1
),
(
  'Spiritbox',
  'spiritbox',
  'Spiritbox é uma banda canadense de metalcore progressivo que se destaca por sua abordagem inovadora ao gênero. Combinando elementos de djent, metalcore melódico e rock alternativo, a banda criou um som único que equilibra brutalidade técnica com emoção e melodia.',
  'https://spiritbox.com',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPs-aSYBrewbTkT4v3pDdZI7vEheq-HweEwg&s',
  '["metalcore progressivo", "djent", "metal alternativo", "rock progressivo"]',
  1
),
(
  'Architects',
  'architects',
  'Architects é uma banda britânica de metalcore que se tornou uma das principais referências do gênero. Com uma evolução constante desde seu início, a banda combina riffs técnicos, breakdowns devastadores e letras profundas sobre temas sociais e existenciais.',
  'https://architectsofficial.com',
  'https://i.scdn.co/image/ab6761610000e5ebc849b02f9ed4ad1d458f1c81',
  '["metalcore", "metalcore técnico", "metal alternativo", "hardcore"]',
  1
),
(
  'Currents',
  'currents',
  'Currents é uma banda americana de metalcore progressivo que se destaca por sua abordagem técnica e emocional ao gênero. Combinando riffs complexos de djent com melodias cativantes e letras introspectivas, a banda criou um som único no cenário metal moderno.',
  'https://currentsmetal.com',
  'https://img.seekr.cloud/cover/670/3/tqkk.jpg',
  '["metalcore progressivo", "djent", "metal alternativo", "post-hardcore"]',
  1
);

-- Verificar inserções
SELECT 
  id,
  name,
  slug,
  featured,
  created_at
FROM bandas_cena 
ORDER BY id;

-- Contar total de bandas inseridas
SELECT COUNT(*) as total_bandas FROM bandas_cena;
