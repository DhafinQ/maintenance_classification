from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes.init import api_router

app = FastAPI(
    title="Machine Maintenance Classifier API",
    description="API untuk memprediksi kondisi mesin (rusak/tidak rusak)",
    version="1.0.0",
)

# === Tambahkan Middleware CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],  # izinkan semua method (GET, POST, PUT, DELETE, dll)
    allow_headers=["*"],  # izinkan semua header
)

# === Register semua route dari folder routes ===
app.include_router(api_router)

# === Route utama untuk tes ===
@app.get("/")
def root():
    return {"message": "Welcome to Machine Maintenance API!"}
