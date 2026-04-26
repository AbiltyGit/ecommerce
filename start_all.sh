#!/bin/bash

# --- Ayarlar ---
# Eğer venv ismin farklıysa (örn: .venv) buradan güncelle
PYTHON_VENV="venv"

echo "🚀 E-Ticaret Analitik Platformu ayağa kaldırılıyor..."

# 1. Java Backend
konsole --new-tab --title "JAVA-BACKEND" -e bash -c "cd ecommercebackend && ./mvnw spring-boot:run; exec bash" &

# 2. Python AI Agent
konsole --new-tab --title "PYTHON-AI" -e bash -c "cd chatbot && source $PYTHON_VENV/bin/activate && uvicorn main:app --reload; exec bash" &

# 3. Angular Frontend
konsole --new-tab --title "ANGULAR-UI" -e bash -c "cd ecommercefrontend && pnpm start; exec bash" &

echo "✅ Tüm servisler yeni Konsole sekmelerinde başlatıldı."
