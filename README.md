
# 🧠 Machine Maintenance Classification System (Dockerized)

> Sistem klasifikasi kondisi mesin berbasis **Machine Learning**, dibangun dengan **FastAPI** (backend) dan **React (Vite + MUI)** (frontend), dan dijalankan menggunakan **Docker + Docker Compose**.
>
> Sistem mengintegrasikan model prediksi seperti **Logistic Regression**, **Random Forest**, dan **XGBoost** untuk menentukan apakah mesin berada dalam kondisi *normal* atau *failure* berdasarkan parameter sensor.

---

## 📚 Table of Contents

1. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
2. [Struktur Proyek](#-struktur-proyek)
3. [Menjalankan Proyek (Docker)](#-menjalankan-proyek-docker)
4. [Konfigurasi Environment](#-konfigurasi-environment)
5. [Migrasi & Seed Database](#-migrasi--seed-database)
6. [Daftar Endpoint API](#-daftar-endpoint-api)
7. [Autentikasi & Token](#-autentikasi--token)
8. [Feature Engineering](#-feature-engineering)
9. [Lisensi & Pengembang](#-lisensi--pengembang)

---

## ⚙️ Teknologi yang Digunakan

### 🧩 Backend (FastAPI)

* **FastAPI** – framework API modern
* **SQLAlchemy + Alembic** – ORM & migrasi database
* **MySQL (PyMySQL)** – database utama
* **Scikit-learn + Joblib** – model machine learning
* **Imbalanced-learn** – balancing data training
* **Passlib + Python-Jose** – autentikasi JWT
* **Pydantic** – validasi request & response
* **python-dotenv** – manajemen environment

### 💻 Frontend (React + Vite)

* **React 19 + Vite** – framework UI cepat
* **Material UI (MUI)** – komponen UI modern
* **ApexCharts** – visualisasi data
* **Axios** – komunikasi API
* **SWR + Yup** – fetcher & validasi
* **React Router v7** – routing frontend

### 🐳 Deployment

* **Docker** – container runtime
* **Docker Compose** – orkestrasi service
* Mengelola 3 service:

  * backend
  * frontend
  * database MySQL

---

## 🗂️ Struktur Proyek

```
root/
│
├── docker-compose.yml
│
├── back_end/
│   ├── Dockerfile
│   ├── main.py
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── migrations/
│   └── requirements.txt
│
└── front_end/
    └── manufacturing/
        └── vite/
            ├── Dockerfile
            ├── package.json
            ├── src/
            └── yarn.lock
```

---

## 🚀 Menjalankan Proyek (Docker)

### 1️⃣ Jalankan Semua Service

Di root project:

```bash
docker compose up --build
```

Service yang akan berjalan:

| Service  | Port Host → Container | Keterangan |
| -------- | --------------------- | ---------- |
| Backend  | 8000 → 8000           | FastAPI    |
| Frontend | 5173 → 5173           | React Vite |
| MySQL    | 3307 → 3306           | Database   |

### 2️⃣ Akses Aplikasi

* Frontend
  👉 [http://localhost:5173](http://localhost:5173)
* FastAPI Docs
  👉 [http://localhost:8000/docs](http://localhost:8000/docs)
* Redoc
  👉 [http://localhost:8000/redoc](http://localhost:8000/redoc)

> Tidak perlu `npm install`, `pip install`, atau `uvicorn` secara manual — semuanya berjalan via Docker.

---

## 🔧 Konfigurasi Environment

### 🧱 Backend `.env`

Buat file:

```
back_end/.env
```

Isi:

```env
DB_USER=root
DB_PASSWORD=12345
DB_HOST=db
DB_PORT=3306
DB_NAME=maintenance_db

SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 🌐 Frontend `.env`

Buat file:

```
front_end/manufacturing/vite/.env
```

Isi:

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🧱 Migrasi & Seed Database

### 1️⃣ Masuk ke container backend

```bash
docker exec -it backend sh
```

### 2️⃣ Jalankan Migrasi Alembic

```bash
alembic upgrade head
```

### 3️⃣ Jalankan Seed Data

```bash
python migrations/seed_data.py
```

---

## 📡 Daftar Endpoint API

### 🔐 Auth

| Method | Endpoint         | Deskripsi           |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Registrasi pengguna |
| POST   | `/auth/login`    | Mendapatkan JWT     |

---

### ⚙️ Machines

| Method | Endpoint         | Deskripsi         |
| ------ | ---------------- | ----------------- |
| GET    | `/machines/`     | Ambil semua mesin |
| GET    | `/machines/{id}` | Detail mesin      |
| POST   | `/machines/`     | Tambah mesin      |
| PUT    | `/machines/{id}` | Edit mesin        |
| DELETE | `/machines/{id}` | Hapus mesin       |

---

### 📦 Product

| Method | Endpoint         | Deskripsi           |
| ------ | ---------------- | ------------------- |
| GET    | `/products/`     | Ambil semua product |
| GET    | `/products/{id}` | Detail produk       |
| POST   | `/products/`     | Tambah produk       |
| PUT    | `/products/{id}` | Edit produk         |
| DELETE | `/products/{id}` | Hapus produk        |

---

### 🧾 Machine Logs

| Method | Endpoint     | Deskripsi                   |
| ------ | ------------ | --------------------------- |
| GET    | `/logs/`     | Ambil semua log             |
| GET    | `/logs/{id}` | Detail log + prediksi ulang |
| POST   | `/logs/`     | Tambah log + auto prediksi  |
| PUT    | `/logs/{id}` | Edit log + auto prediksi    |

---

### 🤖 Predict

| Method | Endpoint    | Deskripsi           |
| ------ | ----------- | ------------------- |
| POST   | `/predict/` | Prediksi 3 model ML |

---

## 🔐 Autentikasi & Token

Semua endpoint (kecuali `/auth/*`) perlu header:

```
Authorization: Bearer <access_token>
```

Swagger menyediakan tombol “Authorize”.

---

## ⚙️ Feature Engineering

Backend otomatis menghitung:

```python
temperature_difference = process_temperature - air_temperature
mechanical_power_w = torque * rotational_speed * (2 * π / 60)
```

Digunakan sebagai input tambahan model prediksi.

---

