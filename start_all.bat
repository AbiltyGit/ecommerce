@echo off
echo ====================================================
echo  E-Ticaret Analitik Platformu Ayaga Kaldiriliyor...
echo ====================================================

set PYTHON_VENV=venv

echo 1. Java Backend baslatiliyor...
start "JAVA-BACKEND" cmd /k "cd ecommercebackend && mvnw spring-boot:run"

echo 2. Python AI Agent baslatiliyor...
start "PYTHON-AI" cmd /k "cd chatbot && call %PYTHON_VENV%\Scripts\activate.bat && uvicorn main:app --reload"

echo 3. Angular Frontend baslatiliyor...
start "ANGULAR-UI" cmd /k "cd ecommercefrontend && pnpm start"

echo Tum servisler yeni pencerelerde baslatildi.
