# QBFT Private Blockchain Network

Implementasi Private Blockchain menggunakan Hyperledger Besu dengan mekanisme konsensus QBFT (Quorum Byzantine Fault Tolerance) untuk kebutuhan validasi dokumen akademik berbasis blockchain.

## Arsitektur Network

Network terdiri dari:

| Node   | Role                |
| ------ | ------------------- |
| Node-1 | Validator           |
| Node-2 | Validator           |
| Node-3 | Validator           |
| Node-4 | RPC / Non-Validator |

---

# Requirement

Pastikan sistem sudah terinstall:

- Docker
- Docker Compose
- Hyperledger Besu

---

# Install Hyperledger Besu

Download Binary Distribution:

[Doc Instalasi Besu](https://besu.hyperledger.org/private-networks/get-started/install/binary-distribution)

---

# Struktur Folder

```bash
QBFT-Networks/
│
├── docker-compose.yaml
├── qbftConfig.json  #config awal
├── README.md
│
├── networkFiles/  #hasil setelah config digenerate
│
│   # Nodes Blockchain
├── Node-1/
├── Node-2/
├── Node-3/
└── Node-4/
```

---

# Step 1 — Membuat QBFT Config

Buat file:

```bash
touch qbftConfig.json
```

Isi dengan:

```json
{
  "genesis": {
    "config": {
      "chainId": 1337,
      "berlinBlock": 0,
      "qbft": {
        "blockperiodseconds": 2,
        "epochlength": 30000,
        "requesttimeoutseconds": 10
      }
    },
    "nonce": "0x0",
    "timestamp": "0x58ee40ba",
    "gasLimit": "0x1fffffffffffff",
    "difficulty": "0x1",
    "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "alloc": {}
  },
  "blockchain": {
    "nodes": {
      "generate": true,
      "count": 4
    }
  }
}
```

---

# Step 2 — Generate Blockchain Config

Jalankan command berikut:

```bash
besu operator generate-blockchain-config \
--config-file=qbftConfig.json \
--to=networkFiles \
--private-key-file-name=key \
--min-gas-price=0
```

Hasil generate:

```bash
networkFiles/
├── genesis.json
└── keys/
```

---

# Step 3 — Setup Node Data

## Genesis.json

```bash
cp networkFiles/genesis.json .
```

## Node-1

```bash
mkdir -p Node-1/data

cp networkFiles/keys/<NODE1_ADDRESS>/key Node-1/data/
cp networkFiles/keys/<NODE1_ADDRESS>/key.pub Node-1/data/
```

---

## Node-2

```bash
mkdir -p Node-2/data

cp networkFiles/keys/<NODE2_ADDRESS>/key Node-2/data/
cp networkFiles/keys/<NODE2_ADDRESS>/key.pub Node-2/data/
```

---

## Node-3

```bash
mkdir -p Node-3/data

cp networkFiles/keys/<NODE3_ADDRESS>/key Node-3/data/
cp networkFiles/keys/<NODE3_ADDRESS>/key.pub Node-3/data/
```

---

## Node-4

```bash
mkdir -p Node-4/data

cp networkFiles/keys/<NODE4_ADDRESS>/key Node-4/data/
cp networkFiles/keys/<NODE4_ADDRESS>/key.pub Node-4/data/
```

# Step 5 - Memasukan Saldo Awal

masukan saldo awal ke address deployer dan juga biro / arsip, di file networkFiles/genesis.json

```bash
"alloc": {
    "0xdFF038f8bD5F2b621985806838B9c8242aeb13e8": {
      "balance": "1000000000000000000000000"
    },
    "0x16b346C9b77e2123569044dB9441dE8f4b75bc5B": {
      "balance": "1000000000000000000000000"
    },
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906": {
      "balance": "1000000000000000000000000"
    }
  },
```

---

# Step 6 — Running Network

## Node 1 as bootnode

```bash
besu --data-path=data --genesis-file=../networkFiles/genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,QBFT --host-allowlist="*" --rpc-http-cors-origins="all" --profile=ENTERPRISE --min-gas-price=0
```

copy semua **URL enode** dari bootnode ke semua Node ketika mau running.

## Node 2

```bash
besu --data-path=data --genesis-file=../networkFiles/genesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,QBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8546 --profile=ENTERPRISE --min-gas-price=0
```

## Node 3

```bash
besu --data-path=data --genesis-file=../networkFiles/genesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,QBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8547 --profile=ENTERPRISE --min-gas-price=0
```

## Node 4

```bash
besu --data-path=data --genesis-file=../networkFiles/genesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,QBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548 --profile=ENTERPRISE --min-gas-price=0
```

---

# Step 6 — Cek Blockchain

Cek block number:

```bash
curl -X POST --data '{
  "jsonrpc":"2.0",
  "method":"eth_blockNumber",
  "params":[],
  "id":1
}' http://localhost:8545
```

Cek Validator

```bash
curl -X POST --data '{
  "jsonrpc":"2.0",
  "method":"qbft_getValidatorsByBlockNumber",
  "params":["latest"],
  "id":1
}' http://localhost:8545
```

---

# Step 7 — Cek Validator

---

# Step 8 — Testing Fault Tolerance

Matikan salah satu validator:

Cek kembali block:

```bash
curl -X POST --data '{
  "jsonrpc":"2.0",
  "method":"eth_blockNumber",
  "params":[],
  "id":1
}' http://localhost:8545
```

Jika block masih berjalan, maka mekanisme fault tolerance QBFT berhasil.

---

# Catatan

- Network menggunakan mekanisme konsensus QBFT
- Menggunakan private blockchain
- Gas price diset `0` untuk kebutuhan zero-gas transaction
- Node-4 digunakan sebagai RPC endpoint untuk middleware dan frontend

---

# RPC Endpoint

```bash
http://localhost:8545
```

---

# Teknologi

- Hyperledger Besu
- Docker
- Docker Compose
- QBFT Consensus
- Ethereum JSON-RPC
