# Gunakan Node.js image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Copy semua file Vite project
COPY . .

# Build proyek untuk production
# RUN npm run build

# Jalankan server Vite
EXPOSE 3000
CMD ["npm", "start", "--", "--host"]
