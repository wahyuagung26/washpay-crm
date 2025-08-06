#!/bin/bash

# Konfigurasi variabel
REMOTE_USER="root"
REMOTE_HOST="145.79.15.163"
REMOTE_DIR="/home/wahyu/vps-container/container-nginx/nginx/html/washpay-crm"
LOCAL_BUILD_DIR="./out"

echo "===> Mulai deploy ke $REMOTE_HOST:$REMOTE_DIR ..."

# Step 1: Build aplikasi Next.js
echo "===> Building aplikasi Next.js..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build gagal! Silakan periksa error di atas."
  exit 1
fi

# Step 2: Cek build folder lokal
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
  echo "❌ Folder build lokal '$LOCAL_BUILD_DIR' tidak ditemukan!"
  exit 1
fi

# Step 3: Hapus isi folder tujuan di remote (hati-hati, ini akan menghapus semua file/folder di /app-simala)
echo "===> Menghapus semua isi di $REMOTE_DIR di server..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "rm -rf ${REMOTE_DIR}/*"

# Step 4: Kirim hasil build ke server (rsync biar cepet & aman)
echo "===> Upload file dari $LOCAL_BUILD_DIR ke $REMOTE_HOST:$REMOTE_DIR ..."
rsync -avz --delete $LOCAL_BUILD_DIR/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

# Step 5: Selesai
echo "✅ Deploy selesai!"
