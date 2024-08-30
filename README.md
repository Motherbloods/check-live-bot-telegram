# TikTok Live Status Checker

Proyek ini adalah sebuah aplikasi Node.js yang memantau status live dari pengguna TikTok tertentu dan mengirimkan screenshot ke bot Telegram.

## Fitur Utama

- Memeriksa status live dari pengguna TikTok yang ditentukan
- Mengambil screenshot dari halaman live TikTok
- Mengirim screenshot ke bot Telegram

## Persyaratan

- Node.js
- NPM
- Akun bot Telegram
- Akun TikTok untuk dipantau

## Instalasi

1. Clone repositori ini
2. Jalankan `npm install` untuk menginstal dependensi

## Konfigurasi

Buat file `.env` di root proyek dan isi dengan informasi berikut:

```
TOKEN=token_bot_telegram_anda
USERNAME_TELEGRAM=id_chat_telegram_anda
USERNAME_TIKTOK=@username_tiktok_yang_dipantau
```

## Penggunaan

Jalankan aplikasi dengan perintah:

```
node app.js
```

Aplikasi akan berjalan sebagai server HTTP. Untuk memicu pemeriksaan status live, kirim permintaan GET ke endpoint `/live`.

## Pengembangan

### Struktur Proyek

- `app.js`: File utama aplikasi
- `utils/telegram.js`: Konfigurasi bot Telegram
- `vercel.json`: Konfigurasi untuk deployment Vercel
- `app.test.js`: File pengujian

### Menjalankan Tes

Jalankan tes dengan perintah:

```
npm test
```

## Deployment

Proyek ini dikonfigurasi untuk deployment ke Vercel. Pastikan Anda telah mengatur variabel lingkungan yang diperlukan di dashboard Vercel Anda.

## Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk saran dan perbaikan.
