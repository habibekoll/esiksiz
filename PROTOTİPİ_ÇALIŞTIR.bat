@echo off
chcp 65001 > nul
echo ===================================================
echo   ESIKSIZ - TEKNOFEST NSosyal Canli Prototip
echo ===================================================
echo.
cd /d "%~dp0esiksiz-app\dist"
echo Prototip tarayicinizda aciliyor (http://localhost:8085)...
echo.
start http://localhost:8085
python -m http.server 8085
pause

