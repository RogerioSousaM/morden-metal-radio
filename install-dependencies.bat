@echo off
echo 🚀 Instalando Dependências - Morden Metal Radio
echo.

echo 📊 Instalando dependências do banco de dados...
cd database
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências do banco
    pause
    exit /b 1
)
echo ✅ Banco de dados - OK
cd ..

echo.
echo 🔧 Instalando dependências do backend...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências do backend
    pause
    exit /b 1
)
echo ✅ Backend - OK
cd ..

echo.
echo 🎵 Instalando dependências do frontend do usuário...
cd frontend-user
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências do frontend user
    pause
    exit /b 1
)
echo ✅ Frontend User - OK
cd ..

echo.
echo 🔐 Instalando dependências do frontend do admin...
cd frontend-admin
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências do frontend admin
    pause
    exit /b 1
)
echo ✅ Frontend Admin - OK
cd ..

echo.
echo 📊 Executando migração do banco de dados...
cd database
node migrate.js
if %errorlevel% neq 0 (
    echo ❌ Erro na migração do banco
    pause
    exit /b 1
)
echo ✅ Migração - OK
cd ..

echo.
echo 🎉 Todas as dependências foram instaladas com sucesso!
echo.
echo 📋 Resumo:
echo   📊 Database: ✅ Instalado e migrado
echo   🔧 Backend: ✅ Instalado
echo   🎵 Frontend User: ✅ Instalado
echo   🔐 Frontend Admin: ✅ Instalado
echo.
echo 🚀 Para iniciar todos os serviços, execute: start-all.bat
echo.
pause 