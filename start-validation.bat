@echo off
echo ========================================
echo    VALIDACAO COMPLETA DOS FRONTENDS
echo ========================================
echo.

echo [1/4] Iniciando Backend...
start "Backend" cmd /k "cd backend && npm start"
timeout /t 5 /nobreak >nul

echo [2/4] Iniciando Frontend User...
start "Frontend User" cmd /k "cd frontend-user && npm run dev"
timeout /t 5 /nobreak >nul

echo [3/4] Iniciando Frontend Admin...
start "Frontend Admin" cmd /k "cd frontend-admin && npm run dev"
timeout /t 5 /nobreak >nul

echo [4/4] Aguardando servicos inicializarem...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo    SERVICOS INICIADOS
echo ========================================
echo.
echo Backend:        http://localhost:3001
echo Frontend User:  http://localhost:5173
echo Frontend Admin: http://localhost:5174
echo.
echo ========================================
echo    PROXIMOS PASSOS
echo ========================================
echo.
echo 1. Abra o arquivo VALIDACAO_MANUAL_GUIDE.md
echo 2. Siga o guia de validacao passo a passo
echo 3. Teste todas as funcionalidades listadas
echo 4. Registre qualquer erro encontrado
echo.
echo ========================================
echo    VALIDACAO AUTOMATICA
echo ========================================
echo.
echo Para executar testes automatizados:
echo node test-frontend-validation.js
echo.
pause 