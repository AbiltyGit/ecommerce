#!/bin/bash
# collect_chatbot.sh
OUTPUT_FILE="chatbot_context.txt"
> $OUTPUT_FILE

echo "--- CHATBOT CONTEXT GENERATED ON $(date) ---" >> $OUTPUT_FILE

find . -type f \( -name "*.py" -o -name "*.yaml" -o -name "*.yml" -o -name "*.env" -o -name "*.toml" \) \
-not -path "*/venv/*" -not -path "*/__pycache__/*" -not -path "*/.git/*" | while read -r file; do
    echo -e "\n\n--- FILE: $file ---" >> $OUTPUT_FILE
    cat "$file" >> $OUTPUT_FILE
done

echo "Bitti! Chatbot bağlamı $OUTPUT_FILE dosyasına kaydedildi."
