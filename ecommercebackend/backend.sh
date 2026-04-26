#!/bin/bash
# collect_backend.sh
OUTPUT_FILE="backend_context.txt"
> $OUTPUT_FILE

echo "--- BACKEND CONTEXT GENERATED ON $(date) ---" >> $OUTPUT_FILE

find . -type f \( -name "*.java" -o -name "*.xml" -o -name "*.properties" -o -name "*.yml" -o -name "*.yaml" \) \
-not -path "*/target/*" -not -path "*/.git/*" -not -path "*/.mvn/*" -not -path "*/bin/*" | while read -r file; do
    echo -e "\n\n--- FILE: $file ---" >> $OUTPUT_FILE
    cat "$file" >> $OUTPUT_FILE
done

echo "Bitti! Backend bağlamı $OUTPUT_FILE dosyasına kaydedildi."
