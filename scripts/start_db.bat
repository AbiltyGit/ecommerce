@echo off
echo ====================================================
echo  Veritabanlari (PostgreSQL ^& MySQL) Baslatiliyor...
echo ====================================================

cd ..\ecommercebackend
docker-compose up -d

echo Veritabanlari basariyla baslatildi.
pause
