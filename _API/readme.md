# 📄 Tasdiqi API - EIP-712 Digital Signature

API berbasis **Node.js** dan **Express.js** untuk melakukan penandatanganan dokumen digital menggunakan standar **EIP-712** dan menyimpannya ke blockchain lokal **Hyperledger Besu**.

## ⚖️ Konsep Validasi Dokumen (Arsip)

Sistem ini menggunakan model **Single Validator**. Dokumen yang masuk dari berbagai unit akan melalui proses verifikasi oleh bagian **Arsip**.

1. **Submission**: Dokumen dikirim ke API dengan metadata (Nomor Surat, NIM, Hash).
2. **Validation**: API menggunakan Private Key milik **Arsip** untuk menandatangani data tersebut sesuai standar **EIP-712**.
3. **Immutability**: Transaksi dikirim ke **Hyperledger Besu**. Smart contract akan memverifikasi bahwa tanda tangan tersebut valid dan benar-benar berasal dari alamat wallet **Arsip** sebelum data disimpan secara permanen.

---

## 📁 Struktur Proyek

Proyek ini mengikuti pola desain modular untuk memudahkan skalabilitas:

```text
tasdiqi-api/
├── src/
│   ├── config/             # Inisialisasi Provider Ethers & Blockchain
│   ├── constants/          # Definisi Skema EIP-712 (Domain & Types)
│   ├── controllers/        # Logika Request/Response & Parsing Input
│   ├── middleware/         # Auth API Key & Konfigurasi CORS
│   ├── routes/             # Definisi Endpoint API
│   ├── services/           # Core Logic: Signing & Transaksi Blockchain
│   └── app.js              # Entry Point & Inisialisasi Express
├── .env                    # Konfigurasi Private & Environment
├── TasdiqiABI.json         # ABI Smart Contract
└── package.json            # Dependensi Proyek

```

### Penjelasan Folder:

- **`config/`**: Tempat mengatur koneksi ke Besu. Menggunakan `staticNetwork` untuk optimasi koneksi RPC.
- **`constants/`**: Menyimpan struktur data EIP-712 agar konsisten antara proses _sign_ di backend dan _verify_ di smart contract.
- **`services/`**: Berisi logika berat. Di sini terjadi proses pengambilan _private key_ biro secara dinamis dan pengiriman transaksi `issueDocument` ke blockchain.
- **`middleware/`**: Melindungi API dari akses tidak sah dan mengatur domain mana saja yang boleh mengakses API (CORS).

---

## 🛠 Instalasi & Persiapan

1. **Clone Repository**

```bash
git clone https://github.com/rizkycahyono97/skripsi-test.git
cd skripsi-test/tasdiqi-api

```

2. **Instal Dependensi**

```bash
    npm install
```

3.  **Konfigurasi Environment**
    Buat file `.env` di root folder dan isi sesuai kebutuhan:

```env
    PORT=8001
    RPC_URL=http://127.0.0.1:8545
    CHAIN_ID=1337
    CONTRACT_ADDRESS=0xYourContractAddress
    APP_API_KEY=your_secret_api_key

    # Konfigurasi CORS
    CORS_ORIGIN=http://localhost:3000
    CORS_METHODS=GET,POST
    CORS_ALLOWED_HEADERS=Content-Type,X-API-KEY

    # Private Keys Biro
    BIRO_AKADEMIK=0x...
    BIRO_KEUANGAN=0x...
```

---

## 📡 API Endpoints

### 1. Check Health

- **URL**: `/api/v1/healthy`
- **Method**: `GET`
- **Auth**: None

### 2. Sign Document

- **URL**: `/api/v1/sign-document`
- **Method**: `POST`
- **Headers**: `X-API-KEY: your_secret_api_key`
- **Body Request**:

```json
{
  "nomor_surat": "001/UNIDA/2024",
  "nim": "412020...",
  "document_hash": "0x...",
  "biro_slug": "biro-akademik"
}
```

---

## 💻 Cara Menjalankan

**Mode Pengembangan (Development):**

```bash
pnpm run dev
```

**Mode Produksi:**

```bash
pnpm start

```

---

## 🛡 Keamanan

- Jangan pernah melakukan _commit_ pada file `.env`.
- Pastikan `X-API-KEY` yang digunakan di frontend sulit ditebak.
- Gunakan `CORS_ORIGIN` yang spesifik di lingkungan produksi (jangan gunakan `*`).

---
