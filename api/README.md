# Tasdiqi Document API

Backend REST API untuk sistem validasi dokumen digital **Tasdiqi** berbasis blockchain. API ini menjadi jembatan antara aplikasi frontend dan smart contract Tasdiqi di jaringan **Hyperledger Besu**, menangani penandatanganan dokumen (EIP-712), penerbitan ke blockchain, serta manajemen validator.

Proyek ini merupakan bagian dari monorepo SkripsiTest yang terdiri dari:

| Folder           | Deskripsi                             |
| ---------------- | ------------------------------------- |
| `api/`           | Backend NestJS (repositori ini)       |
| `contract/`      | Smart contract Tasdiqi (Foundry)      |
| `app/`           | Aplikasi frontend                     |
| `QBFT-Networks/` | Konfigurasi jaringan Hyperledger Besu |

---

## Fitur Utama

- **Penerbitan dokumen ke blockchain** — Menandatangani dokumen dengan standar EIP-712 lalu menerbitkannya ke smart contract.
- **Pembacaan data dokumen** — Mengambil detail dokumen yang sudah terdaftar di blockchain berdasarkan `documentKey`.
- **Manajemen validator** — Mengaktifkan atau menonaktifkan alamat validator di smart contract.
- **Pengecekan otorisasi validator** — Memverifikasi apakah suatu alamat Ethereum terdaftar sebagai validator.
- **Autentikasi API Key** — Semua endpoint dilindungi middleware `x-api-key`.
- **Validasi request** — Input divalidasi menggunakan Zod sebelum diproses.
- **Logging terstruktur** — Log aplikasi menggunakan Winston (console + file error).

---

## Tech Stack

| Teknologi                                       | Versi | Kegunaan             |
| ----------------------------------------------- | ----- | -------------------- |
| [NestJS](https://nestjs.com/)                   | 11.x  | Framework backend    |
| [TypeScript](https://www.typescriptlang.org/)   | 5.x   | Bahasa pemrograman   |
| [ethers.js](https://docs.ethers.org/)           | 6.x   | Interaksi blockchain |
| [Zod](https://zod.dev/)                         | 4.x   | Validasi request     |
| [Winston](https://github.com/winstonjs/winston) | —     | Logging              |
| Node.js                                         | 20.x  | Runtime              |

---

## Prasyarat

Sebelum menjalankan API, pastikan lingkungan berikut sudah tersedia:

1. **Node.js** versi 20 atau lebih baru (lihat `.tool-versions` jika menggunakan [asdf](https://asdf-vm.com/))
2. **npm** (terinstal bersama Node.js)
3. **Jaringan blockchain Hyperledger Besu** yang sudah berjalan
4. **Smart contract Tasdiqi** yang sudah di-deploy ke jaringan tersebut
5. File ABI kontrak di `abi/TasdiqiABI.json`

> Untuk panduan deploy smart contract, lihat [`../contract/README.md`](../contract/README.md).

---

## Struktur Project

```
api/
├── abi/
│   └── TasdiqiABI.json          # ABI smart contract Tasdiqi
├── docs/
│   └── swagger.yaml             # Dokumentasi API (OpenAPI 3.0)
├── logs/
│   └── error.log                # Log error aplikasi (auto-generated)
├── src/
│   ├── main.ts                  # Entry point aplikasi
│   ├── app.module.ts            # Root module
│   ├── blockchain/
│   │   ├── blockchain.module.ts
│   │   ├── blockchain.service.ts    # Logika interaksi blockchain
│   │   ├── blockchain.validation.ts # Skema validasi Zod
│   │   └── constant/
│   │       └── eip712.constants.ts  # Domain & types EIP-712
│   ├── common/
│   │   ├── common.module.ts         # Module global (config, logger, middleware)
│   │   ├── api-key.middleware.ts    # Middleware autentikasi API key
│   │   └── validation.service.ts    # Service wrapper Zod
│   ├── document/
│   │   ├── document.module.ts
│   │   └── document.controller.ts   # Handler HTTP endpoint
│   └── model/
│       ├── blockchain.model.ts      # Tipe response blockchain
│       ├── document.model.ts        # Tipe request dokumen
│       └── web.model.ts             # Wrapper response API
├── test/
│   └── app.e2e-spec.ts          # End-to-end test
├── .env.example                 # Template environment variables
├── nest-cli.json
├── package.json
└── tsconfig.json
```

### Alur Arsitektur

```
Client (Frontend)
       │
       ▼  HTTP + x-api-key
┌──────────────────────┐
│  DocumentController  │  ← Routing & HTTP handler
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  BlockchainService   │  ← Validasi, signing EIP-712, transaksi
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Hyperledger Besu    │  ← Smart contract Tasdiqi
└──────────────────────┘
```

---

## Instalasi

### 1. Clone repositori

```bash
git clone <url-repositori>
cd SkripsiTest/api
```

### 2. Install dependensi

```bash
npm install
```

### 3. Siapkan file environment

Salin template environment dan isi nilai yang diperlukan:

```bash
cp .env.example .env
```

### 4. Pastikan ABI tersedia

File `abi/TasdiqiABI.json` harus ada. File ini biasanya dihasilkan setelah kompilasi smart contract di folder `contract/`:

```bash
# Contoh: salin dari output Foundry (sesuaikan path)
cp ../contract/out/Tasdiqi.sol/Tasdiqi.json abi/TasdiqiABI.json
```

> API akan gagal start jika file ABI tidak ditemukan.

---

## Konfigurasi Environment

Edit file `.env` dengan nilai yang sesuai:

```env
# Autentikasi API
API_KEY=your-secret-api-key

# Aplikasi
APP_PORT=3000

# CORS (untuk frontend)
CORS_ORIGIN=http://127.0.0.1:8000
CORS_METHODS=GET,POST,HEAD,PUT,PATCH,DELETE
CORS_ALLOWED_HEADERS=Content-Type,Accept,x-api-key

# Blockchain
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8546
BLOCKCHAIN_CHAIN_ID=1337
BLOCKCHAIN_CONTRACT_ADDRESS=0x...   # Alamat contract setelah deploy
BLOCKCHAIN_OWNER_PRIVATE_KEY=...    # Private key owner (untuk set validator)
```

| Variabel                       | Wajib | Deskripsi                                               |
| ------------------------------ | ----- | ------------------------------------------------------- |
| `API_KEY`                      | Ya    | Kunci rahasia untuk autentikasi request                 |
| `APP_PORT`                     | Tidak | Port server (default: `3000`)                           |
| `CORS_ORIGIN`                  | Tidak | Origin yang diizinkan untuk CORS                        |
| `CORS_METHODS`                 | Tidak | HTTP methods yang diizinkan                             |
| `CORS_ALLOWED_HEADERS`         | Tidak | Header yang diizinkan                                   |
| `BLOCKCHAIN_RPC_URL`           | Ya    | URL RPC node Besu                                       |
| `BLOCKCHAIN_CHAIN_ID`          | Ya    | Chain ID jaringan blockchain                            |
| `BLOCKCHAIN_CONTRACT_ADDRESS`  | Ya    | Alamat smart contract Tasdiqi                           |
| `BLOCKCHAIN_OWNER_PRIVATE_KEY` | Ya\*  | Private key owner (\*wajib untuk endpoint `/validator`) |

---

## Menjalankan Aplikasi

### Development (hot reload)

```bash
npm run start:dev
```

### Production

```bash
# Build terlebih dahulu
npm run build

# Jalankan hasil build
npm run start:prod
```

### Mode lainnya

```bash
npm run start          # Start tanpa watch
npm run start:debug    # Start dengan debugger
```

Setelah berjalan, API tersedia di:

```
http://localhost:3000
```

---

## Autentikasi

Semua endpoint di bawah `/api/*` memerlukan header autentikasi:

```
x-api-key: <nilai API_KEY dari .env>
```

Contoh request dengan `curl`:

```bash
curl -X GET "http://localhost:3000/api/documents/0xabc123..." \
  -H "x-api-key: your-secret-api-key"
```

Jika API key tidak valid atau tidak disertakan, server mengembalikan respons `401 Unauthorized`.

---

## Endpoint API

| Method | Endpoint                                   | Deskripsi                             |
| ------ | ------------------------------------------ | ------------------------------------- |
| `GET`  | `/api/documents/{documentKey}`             | Ambil detail dokumen dari blockchain  |
| `POST` | `/api/documents/sign`                      | Tandatangani dan terbitkan dokumen    |
| `POST` | `/api/documents/validator`                 | Set status validator (aktif/nonaktif) |
| `GET`  | `/api/documents/validator/check/{address}` | Cek otorisasi validator               |

## Testing

```bash
# Unit test
npm run test

# Unit test dengan watch mode
npm run test:watch

# Coverage report
npm run test:cov

# End-to-end test
npm run test:e2e
```

---

## Logging

Aplikasi menggunakan Winston untuk logging:

- **Console** — Semua level log ditampilkan di terminal
- **File** — Log error disimpan di `logs/error.log`

---

## Troubleshooting

| Masalah                                                           | Penyebab                           | Solusi                                                        |
| ----------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| `File ABI Tasdiqi tidak ditemukan`                                | `abi/TasdiqiABI.json` belum ada    | Salin ABI dari hasil kompilasi contract                       |
| `BLOCKCHAIN_RPC_URL atau BLOCKCHAIN_CHAIN_ID belum didefinisikan` | Variabel `.env` kosong             | Isi nilai di file `.env`                                      |
| `Contract belum terdeploy`                                        | Contract belum ada di jaringan     | Deploy contract ke Besu, update `BLOCKCHAIN_CONTRACT_ADDRESS` |
| `401 Unauthorized`                                                | API key salah atau tidak dikirim   | Sertakan header `x-api-key` yang benar                        |
| `Validator private key not found`                                 | Field `validatorPrivateKey` kosong | Pastikan private key validator dikirim di body request        |
| Koneksi RPC gagal                                                 | Node Besu tidak berjalan           | Pastikan jaringan blockchain aktif di `BLOCKCHAIN_RPC_URL`    |

---

## Scripts Tersedia

| Perintah             | Deskripsi                       |
| -------------------- | ------------------------------- |
| `npm run build`      | Kompilasi TypeScript ke `dist/` |
| `npm run start`      | Jalankan aplikasi               |
| `npm run start:dev`  | Jalankan dengan hot reload      |
| `npm run start:prod` | Jalankan build production       |
| `npm run lint`       | Lint & auto-fix kode            |
| `npm run format`     | Format kode dengan Prettier     |
| `npm run test`       | Jalankan unit test              |

---

## Lisensi

Proyek ini bersifat private (`UNLICENSED`).
