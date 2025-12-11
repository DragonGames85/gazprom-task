@echo off
echo ========================================
echo Запуск Employee Management System
echo ========================================
echo.

echo Проверка PostgreSQL...
sc query postgresql-x64-14 >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL сервис не найден. Убедитесь, что PostgreSQL установлен и запущен.
    pause
    exit /b 1
)

echo PostgreSQL найден.
echo.

echo Запуск Backend (порт 3001)...
start "Backend" cmd /k "cd backend && npm run start:dev"

timeout /t 3 /nobreak >nul

echo Запуск Frontend (порт 3000)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Оба сервера запускаются...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Откройте браузер и перейдите на http://localhost:3000
echo.
echo Для остановки закройте окна Backend и Frontend
pause

