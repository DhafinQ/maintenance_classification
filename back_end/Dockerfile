FROM python:3.11-slim

WORKDIR /app

# Copy semua file proyek
COPY . .

# Install dependencies
RUN pip install --default-timeout=100 --no-cache-dir -r requirements.txt \
    -i https://pypi.mirrors.ustc.edu.cn/simple

RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

# Pastikan script bisa dieksekusi
RUN chmod +x start.sh

# Expose port FastAPI
EXPOSE 8000

# Jalankan entrypoint script
CMD ["bash", "start.sh"]
