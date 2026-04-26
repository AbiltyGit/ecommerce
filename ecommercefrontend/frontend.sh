#!/bin/bash
# collect_frontend.sh
OUTPUT_FILE="frontend_context.txt"
> $OUTPUT_FILE

echo "--- FRONTEND CONTEXT GENERATED ON $(date) ---" >> $OUTPUT_FILE

find . -type f \( -name "*.ts" -o -name "*.html" -o -name "*.css" -o -name "*.scss" -o -name "*.json" \) \
-not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.git/*" -not -path "*/.angular/*" | while read -r file; do
    echo -e "\n\n--- FILE: $file ---" >> $OUTPUT_FILE
    cat "$file" >> $OUTPUT_FILE
done

echo "Bitti! Frontend bağlamı $OUTPUT_FILE dosyasına kaydedildi."
