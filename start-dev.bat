@echo off
echo 🚀 Iniciando Morden Metal Radio...
echo.

echo 📡 Iniciando servidor backend...
start "Backend Server" cmd /k "cd server && npm run dev"

echo ⏳ Aguardando 3 segundos para o backend inicializar...
timeout /t 3 /nobreak > nul

echo 🎵 Iniciando frontend...
start "Frontend Dev" cmd /k "npm run dev"

echo.
echo ✅ Ambos os serviços foram iniciados!
echo 📡 Backend: http://localhost:3001
echo 🎵 Frontend: http://localhost:5173
echo.
echo Pressione qualquer tecla para fechar...
pause > nul 