# Submission Open Music API V3
- ### Kriteria 1 : Ekspor Lagu Pada Playlist ✅
- ### Kriteria 2 : Mengunggah Sampul Album ✅
- ### Kriteria 3 : Menyukai Album ✅
- ### Kriteria 4 : Menerapkan Server-Side Cache ✅
- ### Kriteria 5 : Pertahankan Fitur OpenMusic API versi 2 dan 1 ✅

---
# Setup Node.js
- Klik *Terminal* -> *New Terminal*
- Ketik `npm init`
  * Setelah muncul **package name: (user)**, enter saja, jika sudah muncul pertanyaan **Is this OK? (yes)**, ketik `yes`
- Lalu ketik `npm install`, maka **package.json**, **package-lock.json** dan **node_modules** akan muncul
- Pada **package.json**, ubah bagian script menjadi seperti ini:
  ```bash
   "scripts": {
    "start-prod": "NODE_ENV=production node ./src/server.js",
    "start": "node ./src/server.js",
    "migrate": "node-pg-migrate",
    "lint": "eslint ./src"
  },
  ```
  
---
# Setup dependencies
- Klik *Terminal* -> *New Terminal*
- Hapi framework: ketik `npm install @hapi/hapi`
- Hapi inert: ketik `npm install inert`
- Hapi JWT: ketik `npm install @hapi/jwt`
- Amqplib: ketik `npm install amqplib`
- Auto-bind: ketik `npm i auto-bind@4`
- Bcrypt: ketik `npm install bcrypt`
- Dotenv: ketik `npm install dotenv`
- Joi: ketik `npm install joi`
- Nanoid: ketik `npm install nanoid@3.x.x`
- Node pg migrate: ketik `npm install node-pg-migrate`
- Pg: ketik `npm install pg`
- redis: ketik `npm install redis`
- Eslint: ketik `npm install eslint --save-dev`, lalu ikuti instruksi berikut:
    * Ketik `npx eslint --init`, kemudian akan diberikan pertanyaan, jawab dengan jawaban berikut:
        * How would you like to use ESLint? -> To check, find problems, and enforce code style.
        * What type of modules does your project use? -> CommonJS (require/exports).
        * Which framework did you use? -> None of these. 
        * Does your project use TypeScript? -> No.
        * Where does your code run? -> Node.
        * How would you like to define a style for your project? -> Use a popular style guide.
        * Which style guide do you want to follow? -> (Anda bebas memilih, sebagai contoh saya pilih Google).
        * What format do you want your config file to be in? -> JSON.
        * Would you like to install them now? -> Yes.
        * Which package manager do you want to use? -> npm.
    
* **NOTE**: saya tidak menggunakan nodemon, tetapi jika teman-teman ingin menggunakannya, silahkan

---
# Tips Menjalankan Pengujian OpenMusic V3
- Pastikan Anda selalu menjalankan pengujian secara berurutan. Karena beberapa request nilai yang didapat dari request sebelumnya. Contoh, pengujian pada folder Authentications membutuhkan folder Users untuk dijalankan. Karena untuk mendapatkan melakukan autentikasi, tentu harus ada data pengguna di database.
- Untuk menjalankan request secara berurutan sekaligus, Anda bisa memanfaatkan fitur collection runner.
- Khusus untuk permintaan pada folder Uploads, jangan ikut sertakan untuk dijalankan menggunakan collections. Karena pengujian akan selalu gagal. Jadi pastikan ketika hendak menjalankan seluruh permintaan pada collection, pengujian pada folder Uploads tidak dicentang.
- Kerjakanlah proyek fitur demi fitur, agar Anda mudah dalam menjalankan pengujiannya.
- Jika merasa seluruh fitur yang dibangun sudah benar namun pengujiannya selalu gagal, kemungkinan database Anda kotor dengan data pengujian yang Anda lakukan sebelum-sebelumnya, dan itu bisa menjadi salah satu penyebab pengujian selalu gagal. Solusinya, silakan hapus seluruh data pada tabel melalui psql dengan perintah: ```bash truncate albums, songs, users, authentications, playlists, playlistsongs, playlist_song_activities, collaborations, user_album_likes; ```
