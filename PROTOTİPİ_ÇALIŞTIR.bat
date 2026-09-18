@echo off
chcp 65001 > nul
title ESIKSIZ - TEKNOFEST 2026 Canli Prototip
echo ===================================================
echo   ESIKSIZ: AI Destekli Erisilebilir NSosyal Deneyimi
echo   TEKNOFEST 2026 NSosyal Inovasyon Yarismasi
echo ===================================================
echo.
echo Prototip yerel web sunucusu baslatiliyor: http://localhost:8085
echo Tarayiciniz otomatik olarak acilacaktir...
echo.
echo [ONEMLI] Prototipi test ederken bu siyah pencereyi KAPATMAYIN.
echo Sunucuyu durdurmak icin pencereyi kapatabilir veya Ctrl+C yapabilirsiniz.
echo ===================================================
echo.

cd /d "%~dp0esiksiz-app\dist"
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8085"

where python >nul 2>&1
if %errorlevel% equ 0 (
    python -m http.server 8085
    goto done
)

where py >nul 2>&1
if %errorlevel% equ 0 (
    py -m http.server 8085
    goto done
)

where node >nul 2>&1
if %errorlevel% equ 0 (
    node server.js
    goto done
)

powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1

:done
pause

