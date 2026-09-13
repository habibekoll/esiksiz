@echo off
chcp 65001 > nul
echo ===================================================
echo   EŞİKSİZ - TEKNOFEST NSosyal Canlı Prototip
echo ===================================================
echo.
echo Prototip tarayıcınızda açılıyor (http://localhost:8085)...
echo.
start http://localhost:8085
python -m http.server 8085 --directory "%~dp0esiksiz-app\dist"
pause
