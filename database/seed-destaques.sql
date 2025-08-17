-- Script para inserir dados de exemplo na tabela destaques_cena
-- Execute este script para popular o MosaicGallery com bandas em destaque

INSERT INTO destaques_cena (titulo, descricao, imagem, link, ordem, ativo, created_at, updated_at) VALUES
(
  'Sleep Token',
  'A banda britânica que revolucionou o metal alternativo com sua mistura única de post-metal, ambient e eletrônica. Conhecida por performances teatrais e letras profundas.',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
  'https://sleep-token.com',
  1,
  1,
  datetime('now'),
  datetime('now')
),
(
  'Spiritbox',
  'A banda canadense que está redefinindo o metalcore com sua abordagem inovadora, combinando elementos de djent, post-metal e eletrônica de forma única.',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=400&fit=crop&crop=center',
  'https://spiritbox.com',
  2,
  1,
  datetime('now'),
  datetime('now')
),
(
  'Lorna Shore',
  'Pioneiros do deathcore moderno, conhecidos por sua técnica instrumental virtuosa e vocais extremos que elevam o gênero a novos patamares.',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=400&fit=crop&crop=center',
  'https://lornashore.com',
  3,
  1,
  datetime('now'),
  datetime('now')
),
(
  'Bad Omens',
  'A banda que está levando o metalcore a novas direções, combinando elementos de rock alternativo, eletrônica e metal de forma inovadora.',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
  'https://badomensofficial.com',
  4,
  1,
  datetime('now'),
  datetime('now')
),
(
  'Architects',
  'Uma das bandas mais influentes do metalcore moderno, conhecida por suas letras profundas sobre questões sociais e ambientais.',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=400&fit=crop&crop=center',
  'https://architectsofficial.com',
  5,
  1,
  datetime('now'),
  datetime('now')
),
(
  'Bring Me The Horizon',
  'A banda que revolucionou o metalcore e continua evoluindo, explorando novos territórios musicais com cada álbum.',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
  'https://bmthofficial.com',
  6,
  1,
  datetime('now'),
  datetime('now')
);

-- Verificar os dados inseridos
SELECT * FROM destaques_cena ORDER BY ordem ASC;
