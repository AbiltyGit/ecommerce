# E-Commerce Analytics Platform

Bu proje; Spring Boot, Angular ve Python (LangChain/FastAPI) tabanlı "çok-katmanlı" (multi-agent) bir e-ticaret ve analitik platformudur.

## 🚀 Ön Gereksinimler ve Başlatma Öncesi Kontroller

Sistemi sorunsuz başlatabilmek için bilgisayarınızda kurulu olması gerekenler:

1. **PostgreSQL Veritabanı (ÖNEMLİ!)**
   - Sistem `5432` portunda çalışan bir PostgreSQL sunucusuna ihtiyaç duyar.
   - Başlatmadan önce PostgreSQL servisinizin **kesinlikle çalışır durumda** olduğundan emin olun.
   - Linux: `sudo systemctl start postgresql`
   - MacOS (Brew): `brew services start postgresql`
   - Gerekirse `ecommercebackend/src/main/resources/application.properties` dosyasındaki veritabanı kullanıcı adı ve şifresini kendinize göre güncelleyin.
   
2. **Uygulama Bağımlılıkları**
   - **Java (JDK 21+)**
   - **Node.js ve pnpm**: Frontend için (`npm install -g pnpm` komutu ile kurulabilir).
   - **Python (3.10+)**: Chatbot ve AI asistanı için.

## 🏃‍♂️ Projeyi Çalıştırma

Projeye ait tüm servisleri elle tek tek çalıştırmak yerine işletim sisteminize uygun olan aşağıdaki otomatik scriptleri kullanabilirsiniz.

### Linux & MacOS İçin
```bash
chmod +x start_all.sh
./start_all.sh
```
*(Not: Bu script sisteminizdeki terminali (gnome-terminal, konsole, xterm vb.) otomatik algılar ve mikro-servisleri ayrı sekmelerde/pencerelerde başlatır.)*

### Windows İçin
```cmd
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
