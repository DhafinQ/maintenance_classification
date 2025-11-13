#!/bin/bash
set -e

echo "⏳ Waiting for MySQL to start..."
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 3
done

echo "✅ Database is up!"

echo "🚀 Running migrations..."
alembic upgrade head

echo "🌱 Seeding initial data (if any)..."
python migrations/seed_data.py || true

echo "▶️ Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
