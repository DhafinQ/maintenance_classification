```
root/
├── back_end/
└── front_end/
    └── manufacturing/
        └── vite/
```

---

# 🧠 Machine Maintenance Classification System

> Sistem klasifikasi kondisi mesin berbasis **Machine Learning**, dibangun dengan **FastAPI** untuk backend dan **React (Vite + MUI)** untuk frontend.
> Proyek ini mengintegrasikan model prediksi dari Scikit-learn untuk menentukan apakah mesin dalam kondisi *normal* atau *rusak* berdasarkan parameter suhu, kecepatan, torsi, dan waktu penggunaan alat (*tool wear*).

---

## 📚 Table of Contents

1. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
2. [Struktur Proyek](#-struktur-proyek)
3. [Instalasi Backend (FastAPI)](#-instalasi-backend-fastapi)
4. [Instalasi Frontend (React + Vite)](#-instalasi-frontend-react--vite)
5. [Menjalankan Proyek](#-menjalankan-proyek)
6. [Migrasi & Seed Database](#-migrasi--seed-database)
7. [Daftar Endpoint API](#-daftar-endpoint-api)
8. [Autentikasi & Token](#-autentikasi--token)
9. [Feature Engineering](#-feature-engineering)
10. [Lisensi & Pengembang](#-lisensi--pengembang)

---

## ⚙️ Teknologi yang Digunakan

### 🧩 Backend (FastAPI)

* **FastAPI** – framework REST API modern & cepat
* **SQLAlchemy + Alembic** – ORM dan migrasi database
* **MySQL (PyMySQL)** – database utama
* **Scikit-learn & Joblib** – model machine learning
* **Imbalanced-learn** – balancing dataset
* **Passlib + Python-Jose** – autentikasi JWT
* **Pydantic** – validasi input & response
* **python-dotenv** – konfigurasi dari file `.env`

### 💻 Frontend (React + Vite)

* **Vite** – development server modern dan cepat
* **React 19** – framework UI
* **Material UI (MUI)** – komponen UI profesional
* **ApexCharts + Framer Motion** – visualisasi & animasi
* **Axios** – komunikasi API
* **Yup + SWR** – validasi dan fetch data
* **React Router DOM v7** – routing halaman
* **Linter + Prettier** – format & kualitas kode

---

## 🗂️ Struktur Proyek

```
root/
│
├── back_end/
│   ├── main.py
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── migrations/
│   ├── requirements.txt
│   └── .env
│
└── front_end/
    └── manufacturing/
        └── vite/
            ├── package.json
            ├── vite.config.js
            ├── src/
            └── yarn.lock
```

---

## ⚡ Instalasi Backend (FastAPI)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<username>/maintenance-classification.git
cd maintenance-classification/back_end
```

### 2️⃣ Buat Virtual Environment

```bash
python -m venv .venv
```

Aktifkan environment:

* Windows → `.venv\Scripts\activate`
* Mac/Linux → `source .venv/bin/activate`

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Buat File `.env`

Isi contoh konfigurasi:

```env
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
DB_NAME=maintenance_db

SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5️⃣ Jalankan Migrasi Database

```bash
alembic upgrade head
```

### 6️⃣ (Opsional) Jalankan Seed Data

```bash
python migrations/seed_data.py
```

### 7️⃣ Jalankan Server FastAPI

```bash
uvicorn main:app --reload
```

Akses:

> [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) → Swagger UI
> [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc) → Redoc API Docs

---

## 🧭 Instalasi Frontend (React + Vite)

### 1️⃣ Masuk ke Folder Frontend

```bash
cd ../front_end/manufacturing/vite
```

### 2️⃣ Install Dependencies (gunakan Yarn/NPM)

```bash
npm install
```

### 3️⃣ Jalankan Aplikasi

```bash
npm start
```

Frontend berjalan di:

> [http://localhost:5173/](http://localhost:5173/)

### 4️⃣ Konfigurasi URL API

Buat file `.env` di dalam folder `vite`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 🚀 Menjalankan Proyek Lengkap

1️⃣ Jalankan backend FastAPI

```bash
cd back_end
uvicorn main:app --reload
```

2️⃣ Jalankan frontend React

```bash
cd front_end/manufacturing/vite
npm start
```

3️⃣ Buka browser:

> [http://localhost:5173/](http://localhost:5173/)

---

## 🧱 Migrasi & Seed Database

Untuk update struktur database otomatis:

```bash
alembic revision --autogenerate -m "update tables"
alembic upgrade head
```

Untuk isi data awal:

```bash
python migrations/seed_data.py
```

---

## 📡 Daftar Endpoint API

### 🔑 Auth

| Method | Endpoint         | Deskripsi                  | Body                                                                            | Output                                              |
| ------ | ---------------- | -------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------- |
| POST   | `/auth/register` | Registrasi user baru       | `{ "username": "Dhafin", "email": "dhafin@example.com", "password": "qwerty" }` | `{ "message": "User created successfully" }`        |
| POST   | `/auth/login`    | Login & dapatkan token JWT | `{ "email": "dhafin@example.com", "password": "qwerty" }`                       | `{ "access_token": "...", "token_type": "bearer" }` |

---

### ⚙️ Machines

| Method | Endpoint         | Deskripsi         | Input             | Output                                                    |
| ------ | ---------------- | ----------------- | ----------------- | --------------------------------------------------------- |
| GET    | `/machines/`     | Ambil semua mesin | -                 | `[ { "id": 1, "machine_code": "MC-0001", "type": "L" } ]` |
| POST   | `/machines/`     | Tambah mesin baru | `{ "type": "M" }` | `{ "machine_code": "MC-0005", "type": "M" }`              |
| PUT    | `/machines/{id}` | Edit mesin        | `{ "type": "H" }` | `{ "message": "Machine updated" }`                        |
| DELETE | `/machines/{id}` | Hapus mesin       | -                 | `{ "message": "Machine deleted" }`                        |

---

### 🧾 Machine Logs

| Method | Endpoint         | Deskripsi                           | Input                                                                                                                                                    | Output                                                 |
| ------ | ---------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| GET    | `/logs/`         | Ambil semua log mesin               | -                                                                                                                                                        | `[ {...} ]`                                            |
| POST   | `/logs/`         | Tambah log baru (auto prediksi)     | `{ "machine_id": 1, "product_id": 2, "air_temperature": 298.1, "process_temperature": 308.6, "rotational_speed": 1551, "torque": 42.8, "tool_wear": 0 }` | `{ "prediction": "Broken", "confidence": 0.88 }`       |
| PUT    | `/logs/{log_id}` | Update log & re-predict otomatis    | -                                                                                                                                                        | `{ "message": "Log updated", "prediction": "Normal" }` |
| GET    | `/logs/{log_id}` | Ambil detail log + prediksi terkini | -                                                                                                                                                        | `{ "log": {...}, "prediction": "Normal" }`             |

---

### 🤖 Predict

| Method | Endpoint    | Deskripsi                          | Input                                                                                                                         | Output                                                                                                                      |
| ------ | ----------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/predict/` | Prediksi dari semua model (`.pkl`) | `{ "Air_Temp_K": 298.1, "Process_Temp_K": 308.6, "Rot_Speed_RPM": 1551, "Torque_Nm": 42.8, "Tool_Wear_min": 0, "Type": "L" }` | `{ "logreg_prediction": "Normal", "rf_prediction": "Broken", "xgb_prediction": "Normal", "accuracy_chart": "<base64img>" }` |

---

## 🔐 Autentikasi & Token

Semua endpoint (kecuali `/auth/*`) memerlukan header:

```
Authorization: Bearer <token>
```

Untuk menguji di Swagger UI:

1. Login dan ambil token
2. Klik tombol **Authorize** di kanan atas
3. Masukkan token seperti:

   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```

---

## ⚙️ Feature Engineering

Saat prediksi, backend otomatis menambahkan dua fitur tambahan:

```python
temperature_difference = process_temperature - air_temperature
mechanical_power_w = torque * rotational_speed * (2 * π / 60)
```

Nilai ini digunakan sebagai input tambahan ke model ML.

---

## 🧑‍💻 Pengembang

* **Dhafin Qinthara**
  Industrial Informatics Engineering – Politeknik Manufaktur Bandung
  Proyek Akhir Praktikum *Machine Learning Dasar (Praktikum)*

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

💡 **Catatan:**

> Untuk menggunakan backend dan frontend bersamaan, pastikan API berjalan di port 8000 dan frontend membaca `VITE_API_BASE_URL` dari `.env`.

---
