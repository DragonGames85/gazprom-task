# Скрипт для запуска проекта
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Запуск Employee Management System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка PostgreSQL
Write-Host "Проверка PostgreSQL..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if (-not $pgService) {
    Write-Host "PostgreSQL сервис не найден. Убедитесь, что PostgreSQL установлен и запущен." -ForegroundColor Red
    Write-Host "Попробуйте запустить вручную или через pgAdmin." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "PostgreSQL найден: $($pgService.Name)" -ForegroundColor Green
Write-Host ""

# Проверка .env файла
if (-not (Test-Path "backend\.env")) {
    Write-Host "Создание файла .env..." -ForegroundColor Yellow
    @"
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_NAME=gazprom_db
"@ | Out-File -FilePath "backend\.env" -Encoding utf8
    Write-Host "Файл .env создан" -ForegroundColor Green
}

Write-Host "Запуск Backend (порт 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run start:dev"

Start-Sleep -Seconds 3

Write-Host "Запуск Frontend (порт 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Оба сервера запускаются..." -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Откройте браузер и перейдите на http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Для остановки закройте окна Backend и Frontend" -ForegroundColor Gray
Write-Host ""

