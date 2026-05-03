#!/bin/bash

# --- Ayarlar ---
PYTHON_VENV="venv"

echo "🚀 E-Ticaret Analitik Platformu ayağa kaldırılıyor..."

# Uygun terminali bulup yeni sekme/pencerede açan fonksiyon
launch_in_terminal() {
    local TITLE=$1
    local CMD=$2

    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="$TITLE" -- bash -c "$CMD; exec bash" &
    elif command -v konsole &> /dev/null; then
        konsole --new-tab --title "$TITLE" -e bash -c "$CMD; exec bash" &
    elif command -v xfce4-terminal &> /dev/null; then
        xfce4-terminal -T "$TITLE" -e "bash -c '$CMD; exec bash'" &
    elif command -v mate-terminal &> /dev/null; then
        mate-terminal --title="$TITLE" -e "bash -c '$CMD; exec bash'" &
    elif command -v xterm &> /dev/null; then
        xterm -T "$TITLE" -e "bash -c '$CMD; exec bash'" &
    else
        echo "⚠️ GUI terminal (gnome-terminal, konsole vb.) bulunamadı. $TITLE arka planda başlatılıyor..."
        bash -c "$CMD" &
    fi
}

# 1. Java Backend
launch_in_terminal "JAVA-BACKEND" "cd ecommercebackend && ./mvnw spring-boot:run"

# 2. Python AI Agent
launch_in_terminal "PYTHON-AI" "cd chatbot && source $PYTHON_VENV/bin/activate && uvicorn main:app --reload"

# 3. Angular Frontend
launch_in_terminal "ANGULAR-UI" "cd ecommercefrontend && pnpm start"

echo "✅ Tüm servisler başlatıldı."
