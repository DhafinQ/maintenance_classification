#!/bin/bash
set -e

echo "🚀 Starting backend container..."

# Tunggu sebentar agar MySQL siap
echo "⏳ Waiting for database to be ready..."
sleep 5

# Jalankan migrasi otomatis
echo "📦 Running Alembic migrations..."
alembic stamp head
alembic upgrade head

# Jalankan seed data (opsional)
if [ -f "migrations/seed_data.py" ]; then
  echo "🌱 Running seed data..."
  python migrations/seed_data.py || true
else
  echo "⚠️ No seed_data.py found, skipping seeding."
fi

# Jalankan server FastAPI
echo "✅ Starting FastAPI..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload
