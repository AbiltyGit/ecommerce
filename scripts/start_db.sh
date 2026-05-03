#!/bin/bash

echo "📦 Veritabanları (PostgreSQL & MySQL) Docker üzerinden ayağa kaldırılıyor..."

cd ../ecommercebackend
docker-compose up -d

echo "✅ Veritabanları başarıyla başlatıldı."
