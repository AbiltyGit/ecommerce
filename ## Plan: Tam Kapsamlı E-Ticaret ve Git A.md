## Plan: Tam Kapsamlı E-Ticaret ve Git Adaptasyonu

Projenin eksik olan ETL, Backend, Frontend mimarilerini tamamlamak ve "düzgün bir Git geçmişi" zorunluluğunu karşılayarak verilen GitHub repository'sine uygun commit stratejisiyle entegre etmek.

**Steps**
1. **Veritabanı & ETL Tamamlama**
   - Eksik `Cart` (Sepet) ve detaylı `Order` veritabanı logiğinin eklenmesi.
   - `etl_loader.py` içine kalan 5 Kaggle veri setinin import edilmesi, veri temizleme ve standardizasyon kurallarının (para birimi, tarih) yazılması. 
2. **Backend API Genişletilmesi** (*depends on 1*)
   - Tüm controller sınıflarına (Product, Order, User vb.) `Update` ve `Delete` metotlarının eklenmesi.
   - Sepet (Cart) yönetimi, ödeme (Checkout) akışı ve sipariş tamamlama servislerinin yazılması. 
3. **Backend Analitik Servisleri** (*parallel with step 2*)
   - Admin ve Corporate kullanıcılar için ciro ve istatistik özetlerini sağlayacak Dashboard API'lerinin geliştirilmesi.
4. **Frontend UI Geliştirilmesi** (*depends on 2 and 3*)
   - Ürün listeleme, filtreleme ve ürün detay UI/UX yapısı (Product Catalog).
   - Sepet, ödeme paneli ve geçmiş sipariş arayüzleri.
   - Corporate mağaza yönetimi ve merkezi Admin paneli için sayfa inşası.
5. **Chatbot Optimizasyonu ve Test** (*depends on 4*)
   - ETL'in genişlettiği SQL database üzerinde Text2SQL AI botunun performans testi (Guardrails kontrolü ve görselleştirme).

**Relevant files**
- `chatbot/etl_loader.py` — Kalan Kaggle veri setlerinin adaptasyonu.
- Backend modelleri ve kontrolcüleri (ör. `ecommercebackend/src/.../OrderController.java` vb.) — Eksik CRUD işlemleri.
- `ecommercefrontend/src/app/` dizini altı — Eksik tüm Angular e-ticaret sayfalarının yaratılması.

**Verification**
1. Postgres/MySQL üzerinde ETL aracılığıyla yüklenen tüm 6 veri kümesinin varlığının ve ilişkilerinin doğrulanması.
2. Temel kullanıcı akışlarının (Ürün arama -> Sepete ekleme -> Satın alma) API düzeyinde testlerinin başarı statüsü.
3. Her adımda "Conventional Commits" kurallarıyla yapılan Git commitleri (`git log` ile kontrol) ve başarılı GitHub repoya Remote Push işlemi.

**Decisions**
- Git entegrasyonu: Şartlarda "düzgün git geçmişi" istendiğinden projedeki operasyonları tek parça birleştirmek (Squash) yerine her büyük adımı (ör. `feat: implement cart feature` ya da `feat: add etl loader for electronics`) mantıklı parçalar dahilinde commitleyeceğiz. Gerekli ssh repo ataması `git remote add` üzerinden kurgulanacak.

**Further Considerations**
1. Commit mesajlarını standart olarak projede **İngilizce** yapmayı öneriyorum (ör. `feat: add checkout endpoint`), senin için uygun mudur?
2. Bende çalışma dizinine doğrudan dosya edit/yazma API'si mevcut değil, ancak bu plan dosyasını arka plana kaydettim (daha sonra kodlayıcı aracın görebilmesi için). Sen istersen uçbirime `run_in_terminal` araçlarıyla echo yaparak `plan.md` dosyasını `ecommerce/` ana dizinine kendim de çıkarabilirim.