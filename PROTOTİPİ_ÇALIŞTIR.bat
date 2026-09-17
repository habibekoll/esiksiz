@echo off
chcp 65001 > nul
echo ===================================================
echo   ESIKSIZ - TEKNOFEST 2026 NSosyal Canli Prototip
echo ===================================================
echo.
if exist "%~dp0esiksiz-app\dist" (
    cd /d "%~dp0esiksiz-app\dist"
    echo Canli web prototipi aciliyor (http://localhost:8085)...
    start http://localhost:8085
    python -m http.server 8085 2>nul || npx serve -p 8085 2>nul || (
        echo Python veya npx bulunamadi. Kaynak koddan derleniyor...
        cd /d "%~dp0esiksiz-app"
        npm run web
    )
) else (
    echo Prototip kaynak koddan baslatiliyor...
    cd /d "%~dp0esiksiz-app"
    npm run web
)
pause

