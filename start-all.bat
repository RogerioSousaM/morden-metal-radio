@echo off
echo 🚀 Iniciando Morden Metal Radio - Todos os Serviços
echo.

echo 📊 Iniciando banco de dados...
cd database
start "Database Migration" cmd /k "node migrate.js"
cd ..

echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak > nul

echo 🔧 Iniciando servidor backend...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak > nul

echo 🎵 Iniciando frontend do usuário...
cd frontend-user
start "Frontend User" cmd /k "npm run dev"
cd ..

echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak > nul

echo 🔐 Iniciando frontend do admin...
cd frontend-admin
start "Frontend Admin" cmd /k "npm run dev"
cd ..

echo.
echo ✅ Todos os serviços foram iniciados!
echo.
echo 📊 Banco de Dados: Migração executada
echo 🔧 Backend: http://localhost:3001
echo 🎵 Frontend User: http://localhost:5173
echo 🔐 Frontend Admin: http://localhost:5174
echo.
echo Pressione qualquer tecla para fechar...
pause > nul 