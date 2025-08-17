-- Criar tabela audit_logs
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

-- Inserir banners
INSERT OR IGNORE INTO banners (title, image_url, target_url, start_at, end_at, priority, locations, active) VALUES 
('Novo Álbum Sleep Token', 'https://example.com/banner1.jpg', 'https://sleeptoken.com/new-album', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1, '["hero", "sidebar"]', 1),
('Spiritbox Tour 2024', 'https://example.com/banner2.jpg', 'https://spiritbox.com/tour', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 2, '["hero", "footer"]', 1),
('Architects - Latest Release', 'https://example.com/banner3.jpg', 'https://architectsofficial.com/latest', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 3, '["sidebar"]', 1);

-- Criar índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_path ON audit_logs(path);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status_code ON audit_logs(status_code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
