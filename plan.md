## Plan: Tam Kapsamlı E-Ticaret ve Git Adaptasyonu

Projenin eksik olan ETL, Backend, Frontend mimarilerini tamamlamak ve "düzgün bir Git geçmişi" zorunluluğunu karşılayarak verilen GitHub repository'sine uygun commit stratejisiyle entegre etmek.

**Steps**
1. **Veritabanı & ETL Tamamlama**
   - Eksik `Cart` (Sepet) ve detaylı `Order` veritabanı tablolarının eklenmesi.
   - `etl_loader.py` içine kalan 5 Kaggle veri setinin import edilmesi, veri temizleme ve standardizasyon kurallarının (para birimi, tarih) yazılması. 
2. **Backend API Genişletilmesi** (*depends on 1*)
   - Controller sınıflarına (Product, Order, User vb.) Update ve Delete metotlarının eklenmesi.
   - Sepet (Cart) yönetimi, kullanıcı ödeme (Checkout) akışı ve sipariş tamamlama servislerinin yazılması. 
3. **Backend Analitik Servisleri** (*parallel with step 2*)
   - Admin ve Corporate kullanıcılar için ciro, envanter alarmı özetlerini sağlayacak Dashboard API'lerinin geliştirilmesi.
4. **Frontend UI Geliştirilmesi** (*depends on 2 and 3*)
   - Ürün listeleme, filtreleme ve ürün detay sayfası (Product Catalog).
   - Sepet, ödeme (Checkout) ve sipariş geçmişi arayüzleri.
   - Şirket (Corporate) ve Admin paneli (ürün yükleme, istatistik dashboard) arayüzlerinin oluşturulması. 
5. **Chatbot Optimizasyonu ve Test** (*depends on 4*)
   - Tam veri üzerinde çalışarak Text2SQL AI botunun sınırlarının (Guardrails) ve görselleştirmenin son testi.

**Relevant files**
- `chatbot/etl_loader.py` — Kalan Kaggle veri setlerinin işlenip import edilmesi.
- Mimaride bulunmayan servis ve db modelleri: `ecommercebackend/src/main/java/com/example/ecommercebackend/controller/` gibi dizinlerde yeni endpoint'ler yazılması.
- `ecommercefrontend/src/app/` — Yeni E-ticaret sayfalarının eklenmesi.

**Verification**
1. ETL betiğinin çalıştırılıp tüm 6 dosyanın veritabanına sorunsuz aktarıldığının doğrulanması.
2. E-Ticaret API akışlarının tam listesinin Backend testleriyle test edilmesi.
3. Her adımda mantıksal bölerlerle "Conventional Commits" yapısında Git commitleri oluşturulması (`git log`).
4. SSH kullanarak sağlanan repoya kodu sorunsuz pushlamak.