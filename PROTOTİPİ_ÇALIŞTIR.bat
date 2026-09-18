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

if exist "%~dp0esiksiz-app\dist" (
    cd /d "%~dp0esiksiz-app\dist"
    start "" cmd /c "timeout /t 2 >nul & start http://localhost:8085"
    python -m http.server 8085
) else (
    cd /d "%~dp0esiksiz-app"
    npm run web
)
pause

