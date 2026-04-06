# Tasdiqi Smart Contract 📜⛓️

Repositori ini berisi **Smart Contract Tasdiqi** yang dikembangkan menggunakan framework **Foundry**. Kontrak ini berfungsi sebagai _ledger_ digital untuk memvalidasi keaslian dokumen akademik di atas jaringan blockchain **Hyperledger Besu**.

## 🚀 Fitur Utama

- **EIP-712 Structured Data**: Penandatanganan dokumen dengan standar data terstruktur.
- **Multi-Biro Authorization**: Mendukung banyak penandatangan (Biro) yang dikelola melalui _Access Control List_.
- **Audit Trail**: Mencatat setiap dokumen yang diterbitkan dan perubahan otoritas biro melalui _Event Logs_.

---

## 🛠️ Prasyarat

Pastikan kamu sudah menginstal:

- [Foundry](https://www.google.com/search?q=https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`, `anvil`).
- Node Hyperledger Besu yang sedang berjalan di `http://127.0.0.1:8545`.

---

## ⚙️ Konfigurasi Environment

Buat file `.env` di folder `contract/` untuk mempermudah proses deploy:

```env
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0x... # Private key akun deployer (Admin/Owner)
CHAIN_ID=1337
```

---

## 📦 Tahap Deployment

### 1\. Kompilasi Kontrak

Pastikan semua dependensi (OpenZeppelin) sudah terpasang dan kontrak dapat dikompilasi tanpa error:

```bash
forge build
```

### 2\. Deploy ke Hyperledger Besu

Gunakan perintah `forge create` untuk men-deploy kontrak. Ganti `<OWNER_ADDRESS>` dengan alamat wallet admin kamu.

1. menggunakan account

```bash
forge script script/Tasdiqi.s.sol  --rpc-url $LOCAL_RPC_URL --account yourAccount --broadcast
```

2. menggunakan private-key

```bash
forge script script/Tasdiqi.s.sol  --rpc-url $LOCAL_RPC_URL --private-key 0XYOURPRIVATEKEY --broadcast
```

_Catat **Deployed to: 0x...** yang muncul di terminal untuk digunakan pada API Node.js dan Laravel._

---

## 🔐 Manajemen Otoritas Biro (Access Control)

Setelah kontrak ter-deploy, kamu harus mendaftarkan alamat wallet Biro agar mereka bisa menandatangani dokumen.

### 1\. Mendaftarkan Biro Baru

Gunakan `cast send` untuk memberikan akses ke alamat biro (contoh: Biro Akademik):

```bash
cast send <CONTRACT_ADDRESS> \
    "setSignerStatus(address,bool)" <WALLET_ADDRESS_BIRO> true \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY
```

### 2\. Verifikasi Status Biro

Pastikan alamat tersebut sudah terdaftar dengan melakukan _call_ ke mapping:

```bash
cast call <CONTRACT_ADDRESS> \
    "isAuthorizedSigner(address)(bool)" <WALLET_ADDRESS_BIRO> \
    --rpc-url $RPC_URL
```

_Hasil harus mengembalikan nilai `true`._

### 3. Verifikasi Saldo Wallet

```bash
cast balance <ADDRESS> --rpc-url http://localhost:9545 --ether
```

---

## 📑 Interaksi Lainnya (Debug)

### Cek Nama Domain EIP-712

Untuk memastikan konfigurasi API Node.js sinkron dengan Contract:

```bash
cast call <CONTRACT_ADDRESS> "getDomainSeparator()(bytes32)" --rpc-url $RPC_URL
```

### Cek Status Dokumen

Mengecek apakah suatu hash dokumen sudah terdaftar di blockchain:

```bash
cast call <CONTRACT_ADDRESS> "checkDocument(bytes32)(bool)" <DOC_HASH> --rpc-url $RPC_URL
```

### Cek Ownable Contract

```bash
cast call <CONTRACT_ADDRESS> "owner()" --rpc-url $LOCAL_RPC_URL
```

---

## 📂 Struktur Folder

- `src/`: Berisi file utama `Tasdiqi.sol`.
- `test/`: Script pengujian otomatis menggunakan Foundry.
- `lib/`: Library eksternal (OpenZeppelin).

---

**Kontak Pengembang:**
Rizky Cahyono Putra - Teknik Informatika

---

**Next step:** Apakah kamu ingin saya buatkan juga file **`deploy.sh`**? Jadi kamu cukup menjalankan satu script saja untuk deploy sekaligus mendaftarkan semua biro dari seeder secara otomatis.
