# QBFT Private Network with Hyperledger Besu (Docker)

Panduan lengkap membuat jaringan blockchain private menggunakan **QBFT consensus** dengan Docker, dari awal hingga network berjalan.

---

# 1. Prasyarat

Pastikan sudah terinstall:

- Docker
- Docker Compose

Cek versi:

```bash
docker --version
docker compose version
besu --version
```

---

# 2. Struktur Folder

Buat struktur project seperti berikut:

```
QBFT-Networks/
├── docker-compose.yaml
├── qbftConfig.json
├── networkFiles/
│   ├── genesis.json
│   └── keys/
```

---

# 3. Generate Validator Key

Buat 1 validator (contoh: PPTIK sebagai authority awal):

```bash
mkdir -p networkFiles/keys
besu public-key export-address --to=networkFiles/keys/validator
```

Atau generate manual:

```bash
besu operator generate-blockchain-config \
  --config-file=qbftConfig.json \
  --to=networkFiles
```

File penting:

```
networkFiles/keys/<address>/key
networkFiles/keys/<address>/key.pub
```

Address inilah yang akan menjadi validator awal.

---

# 4. Membuat qbftConfig.json

Contoh konfigurasi:

```json
{
  "genesis": {
    "config": {
      "chainId": 1337,
      "berlinBlock": 0,
      "londonBlock": 0,
      "qbft": {
        "blockperiodseconds": 2,
        "epochlength": 30000,
        "requesttimeoutseconds": 4
      }
    }
  },
  "blockchain": {
    "nodes": {
      "generate": true
    }
  }
}
```

Kemudian generate genesis:

```bash
besu operator generate-blockchain-config \
  --config-file=qbftConfig.json \
  --to=networkFiles
```

Genesis akan otomatis berisi `extraData` yang benar.

---

# 5. Tentang Difficulty (Penting)

Dalam QBFT:

- **Difficulty TIDAK digunakan untuk mining**
- QBFT adalah Proof-of-Authority (BFT based)
- Block dibuat oleh validator, bukan berdasarkan hash power

Namun field difficulty tetap wajib ada di genesis.

Gunakan nilai standar:

```json
"difficulty": "0x1"
```

Tidak perlu dihitung atau disesuaikan secara manual.

---

# 6. Contoh genesis.json Final

Pastikan memiliki bagian berikut:

```json
{
  "config": {
    "chainId": 1337,
    "berlinBlock": 0,
    "londonBlock": 0,
    "qbft": {
      "blockperiodseconds": 2,
      "epochlength": 30000,
      "requesttimeoutseconds": 4
    }
  },
  "difficulty": "0x1",
  "gasLimit": "0x1fffffffffffff",
  "extraData": "<generated otomatis>",
  "alloc": {
    "<validator-address>": {
      "balance": "0xad78ebc5ac6200000"
    }
  }
}
```

JANGAN mengedit `extraData` secara manual.

---

# 7. Docker Compose

Contoh `docker-compose.yaml`:

```yaml
version: '3.8'

services:
  besu-node:
    image: hyperledger/besu:latest
    container_name: besu-node
    volumes:
      - ./networkFiles/genesis.json:/opt/besu/genesis.json
      - ./networkFiles/keys:/opt/besu/keys
      - ./Node-1/data:/opt/besu/data
    ports:
      - '8545:8545'
      - '30303:30303'
    command:
      - --genesis-file=/opt/besu/genesis.json
      - --data-path=/opt/besu/data
      - --node-private-key-file=/opt/besu/keys/<address>/key
      - --rpc-http-enabled
      - --rpc-http-api=ETH,NET,QBFT
      - --host-allowlist=*
      - --rpc-http-cors-origins=all
      - --min-gas-price=0
```

Ganti `<address>` dengan folder validator key.

---

# 8. Jalankan Network

Pastikan folder data kosong jika mengganti genesis:

```bash
rm -rf Node-1/data
```

Start node:

```bash
docker compose up -d
```

Cek log:

```bash
docker logs -f besu-node
```

Pastikan TIDAK ada error:

```
Genesis block contains no signers
```

---

# 9. Verifikasi Validator

Cek validator:

```bash
curl -X POST localhost:8545 \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"qbft_getValidatorsByBlockNumber","params":["latest"],"id":1}'
```

Output seharusnya:

```json
{
  "result": ["0x..."]
}
```

---

# 10. Menambah Validator (Production Best Practice)

Setelah network berjalan, gunakan voting:

```bash
qbft_proposeValidatorVote
```

Tidak perlu restart chain.

---

# 11. Catatan Production

Rekomendasi:

- Minimal 4 validator
- Simpan private key di volume terpisah
- Jangan commit private key ke Git
- Gunakan governance voting untuk tambah/hapus validator

---

# Kesimpulan

- Validator WAJIB ada di genesis
- extraData harus di-generate otomatis
- difficulty tetap diisi 0x1 (tidak berpengaruh di QBFT)
- Jika genesis berubah → hapus data dan restart node

Network QBFT siap digunakan 🎉

---

# 12. .gitignore (Penting untuk Keamanan)

Agar private key, database, dan credential tidak ter-commit ke repository, buat file `.gitignore` di root project:

```
# =============================
# Besu Private Network Secrets
# =============================

# Private keys
networkFiles/keys/
Node-*/data/key

# Blockchain database
Node-*/data/database/
Node-*/data/caches/
Node-*/data/*.json
Node-*/data/*.log
Node-*/data/LOCK

# Generated ports & runtime files
Node-*/data/besu.ports
Node-*/data/besu.networks

# Docker override files
*.env
.env

# OS files
.DS_Store
Thumbs.db

# Logs
*.log

# Backup files
*.bak
*.swp
```

## 🔐 Kenapa Ini Penting?

Folder berikut **WAJIB tidak masuk Git**:

- `networkFiles/keys/` → berisi private key validator
- `Node-*/data/` → berisi blockchain database

Jika private key bocor:

- Validator bisa diambil alih
- Network bisa dimanipulasi
- Authority (misalnya PPTIK) kehilangan kontrol

---

# 13. Best Practice Tambahan (Opsional Tapi Direkomendasikan)

Untuk keamanan production:

- Gunakan environment variable untuk sensitive config
- Simpan private key di external volume
- Pertimbangkan penggunaan Vault atau HSM untuk validator production
- Batasi akses RPC menggunakan firewall

---

Sekarang repository kamu aman dari kebocoran credential 🚀
