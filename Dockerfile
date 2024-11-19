# Menggunakan Node.js versi 16 sebagai base image
FROM node:20

# Menetapkan direktori kerja di dalam kontainer
WORKDIR /app

# Menyalin file package.json dan package-lock.json untuk instalasi dependencies
COPY package*.json ./

COPY .env .env
# Menginstall dependencies
RUN npm install

# Menyalin seluruh kode aplikasi ke dalam kontainer
COPY . .

COPY .env .env

# Menetapkan variabel lingkungan di Docker
ENV APP_ENV=development
ENV APP_PORT=8000

EXPOSE 8000


# Menjalankan aplikasi
CMD [ "npm", "start" ]

# Mengekspos port yang akan digunakan aplikasi

