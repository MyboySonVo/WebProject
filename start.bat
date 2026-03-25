@echo off
setlocal enabledelayedexpansion
title WebProject Launcher

echo ===================================================
echo    WebProject - Smart Startup (Backend + Frontend)
echo ===================================================
echo.

:: Duong dan co dinh theo vi tri file bat nay
set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend\ticket-booking"
set "FRONTEND=%ROOT%my-react-app"
set "JAR=%BACKEND%\target\api-0.0.1-SNAPSHOT.jar"

:: -----------------------------------------------
:: 1. Kiem tra .jar
:: -----------------------------------------------
if exist "%JAR%" (
    echo [OK]   Tim thay JAR: %JAR%
    echo [INFO] Bo qua build, chay truc tiep.
    goto :START_SERVERS
)

echo [INFO] Chua co file JAR. Bat dau build backend...
echo.

:: -----------------------------------------------
:: 2. Build (chi chay khi chua co JAR)
:: -----------------------------------------------
pushd "%BACKEND%"
echo [BUILD] Dang chay mvnw package -DskipTests ...
call mvnw.cmd package -DskipTests
if errorlevel 1 (
    echo.
    echo [ERROR] Build that bai! Xem log o tren.
    popd
    pause
    exit /b 1
)
popd

if not exist "%JAR%" (
    echo [ERROR] Khong tim thay JAR sau build: %JAR%
    pause
    exit /b 1
)

echo.
echo [OK]   Build thanh cong!

:: -----------------------------------------------
:: 3. Khoi dong 2 server song song
:: -----------------------------------------------
:START_SERVERS
echo.
echo [START] Backend dang khoi dong...
start "Backend (Spring Boot)" cmd /k "java -jar "%JAR%""

echo [START] Frontend (Vite) dang khoi dong...
start "Frontend (Vite)" cmd /k "cd /d "%FRONTEND%" && npm run dev"

echo.
echo ===================================================
echo   Ca hai server da khoi dong!
echo   - Frontend : http://localhost:5173
echo   - Backend  : http://localhost:8080
echo.
echo   Dong cua so nay khong anh huong den server.
echo ===================================================
echo.
echo Nhan phim bat ky de dong cua so nay...
pause > nul
