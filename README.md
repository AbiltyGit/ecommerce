# E-Commerce Analytics Platform

Bu proje; Spring Boot, Angular ve Python (LangChain/FastAPI) tabanlı "çok-katmanlı" (multi-agent) bir e-ticaret ve analitik platformudur.

## 🚀 Ön Gereksinimler ve Başlatma Öncesi Kontroller

Sistemi sorunsuz başlatabilmek için bilgisayarınızda kurulu olması gerekenler:

1. **Veritabanı (PostgreSQL veya MySQL)**
   - Bu proje Spring profilleri aracılığıyla hem **PostgreSQL** (`5432` portu) hem de **MySQL** (`3306` portu) desteklemektedir. 
   - `ecommercebackend/src/main/resources/application.properties` dosyası içerisinden `spring.profiles.active=postgres` veya `mysql` olarak geçiş yapabilirsiniz.
   - En kolay başlatma yöntemi **Docker Compose** kullanmaktır. Terminalde `scripts` klasörü altındaki `start_db.sh` veya `start_db.bat` betiğini çalıştırarak veritabanlarını anında ayağa kaldırabilirsiniz.
     ```bash
     cd scripts
     ./start_db.sh
     ```
   - Eğer Docker yerine yerel sisteminize kurulu bir servis kullanıyorsanız, `application-postgres.properties` veya `application-mysql.properties` içerisinden kullanıcı adı/şifre ayarlarını kendi sisteminize göre güncellediğinizden emin olun.
   
2. **Uygulama Bağımlılıkları**
   - **Java (JDK 21+)**
   - **Node.js ve pnpm**: Frontend için (`npm install -g pnpm` komutu ile kurulabilir).
   - **Python (3.10+)**: Chatbot ve AI asistanı için.

## 🏃‍♂️ Projeyi Çalıştırma

Projeye ait tüm servisleri elle tek tek çalıştırmak yerine işletim sisteminize uygun olan aşağıdaki otomatik scriptleri kullanabilirsiniz. Ana dizinden `scripts` klasörüne girip ilgili betiği çalıştırın.

### Linux & MacOS İçin
```bash
cd scripts
chmod +x start_all.sh start_db.sh
./start_all.sh
```
*(Not: Bu script sisteminizdeki terminali (gnome-terminal, konsole, xterm vb.) otomatik algılar ve mikro-servisleri ayrı sekmelerde/pencerelerde başlatır.)*

### Windows İçin
```cmd
cd scripts
start_all.bat
```
*(Not: Bu script 3 ayrı CMD penceresi açarak backend, frontend ve AI servislerini eş zamanlı olarak başlatır.)*

## 🏗 Sistem Bileşenleri ve Portlar

- **Backend (Spring Boot):** `http://localhost:8080` (Kullanıcı, Ürün, Sepet, Sipariş ve Dashboard API'leri)
- **Frontend (Angular):** `http://localhost:4200` (E-ticaret arayüzü ve Admin kontrol paneli)
- **AI Agent & Chatbot (Python):** `http://localhost:8000` (Veritabanı üzerinden NLP ve Data ETL işlemleri)

## ⚠️ Sık Karşılaşılan Hatalar ve Çözümleri

- **`Connection to localhost:5432 refused`** veya **`Unable to determine Dialect without JDBC metadata`**:
  Veritabanı kapalı. PostgreSQL servisini başlatıp sistemi yeniden çalıştırın.
- **`pnpm: command not found`**:
  Pnpm paket yöneticisi sisteminizde yok. Node.js yüklüyse `npm install -g pnpm` yazarak kurun.
- **`Python venv bulunamadı`**:
  Python sanal ortamı aktif edilemedi. `cd chatbot` klasöründe `python -m venv venv` ile oluşturup, `requirements.txt` kurun.
