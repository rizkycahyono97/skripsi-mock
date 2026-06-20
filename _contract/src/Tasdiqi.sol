// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.33;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Tasdiqi - Digital Document Verification System
 * @author https://github.com/rizkycahyono97
 * @notice Kontrak ini menyediakan sistem verifikasi dokumen digital menggunakan standar EIP-712.
 * @dev Menggunakan OpenZeppelin v4.9 EIP712 untuk typed data signing dan Ownable untuk kontrol akses validator.
 *      Arsip bertindak sebagai validator tunggal yang menandatangani data secara off-chain sebelum diposting ke blockchain.
 */
contract Tasdiqi is EIP712, Ownable {
    using ECDSA for bytes32;

    /// @notice Struktur data Dokumen untuk informasi dokumen yang akan diverifikasi
    struct Document {
        string nomor_surat;
        string nim;
        bytes32 doc_hash;
    }

    /**
     * @dev Hash TypeHash Document sesuai standar EIP-712.
     * Digunakan untuk membangun structHash saat proses verifikasi tanda tangan.
     */
    bytes32 private constant DOCUMENT_TYPEHASH =
        keccak256("Document(string nomor_surat,string nim,bytes32 doc_hash)");

    /// @notice Mapping untuk mengecek apakah hash dokumen sudah terdaftar (true jika sudah ada)
    mapping(bytes32 => bool) public verifiedDocuments;
    /// @notice Mapping alamat wallet yang digunakan sebagai Validator (Single of Authority)
    mapping(address => bool) public authorizedValidator;

    /// @notice Event yang dipicu saat dokumen baru berhasil didaftarkan ke blockchain
    event DocumentIssued(
        bytes32 indexed docHash,
        string nomorSurat,
        address indexed signer
    );
    /// @notice Event yang dipicu saat status otorisasi seorang validator berubah
    event ValidatorDocumentStatus(address indexed _signer, bool _status);

    /**
     * @notice Inisialisasi kontrak Tasdiqi
     * @param initialOwner Alamat wallet yang akan menjadi Owner dan validator awal (Bagian Arsip)
     */
    constructor(
        address initialOwner
    ) EIP712("Tasdiqi-UNIDA", "1") Ownable(initialOwner) {
        authorizedValidator[initialOwner] = true;
    }

    /**
     * @notice Mendaftarkan dokumen baru ke dalam blockchain setelah di validasi oleh Arsip
     * @dev Memverifikasi tanda tangan EIP-712 dan memastikan signer adalah validator resmi
     * @param doc Struct Document berisi data dokumen yang generik
     * @param signature Tanda tangan digital (v, r, s) yang dihasilkan oleh validator off-chain
     */
    function issueDocument(
        Document calldata doc,
        bytes calldata signature
    ) external {
        require(
            !verifiedDocuments[doc.doc_hash],
            "Tasdiqi: Dokumen sudah terdaftar di Blockchain."
        );

        // rekonstruksi structHash
        bytes32 structHash = keccak256(
            abi.encode(
                DOCUMENT_TYPEHASH,
                keccak256(bytes(doc.nomor_surat)),
                keccak256(bytes(doc.nim)),
                doc.doc_hash
            )
        );

        // rekonstruksi domain separator
        bytes32 hash = _hashTypedDataV4(structHash);

        // Mendapatkan alamat validator  dan hash
        address signer = hash.recover(signature);

        require(
            isAuthorizedValidator(signer),
            "Tasdiqi: Validasi tidak sah, Validator salah!"
        );

        verifiedDocuments[doc.doc_hash] = true;

        emit DocumentIssued(doc.doc_hash, doc.nomor_surat, signer);
    }

    /**
     * @notice Mengatur status otorisasi validator (Hanya untuk Owner)
     * @param _signer Alamat wallet validator yang akan diatur
     * @param status Status otorisasi (true untuk aktif, false untuk non-aktif)
     */
    function setValidatorDocument(
        address _signer,
        bool status
    ) external onlyOwner {
        authorizedValidator[_signer] = status; //mapping
        emit ValidatorDocumentStatus(_signer, status);
    }

    /**
     * @notice Mengecek apakah sebuah alamat adalah validator resmi
     * @param _signer Alamat wallet yang ingin dicek
     * @return bool True jika alamat tersebut adalah validator resmi
     */
    function isAuthorizedValidator(address _signer) public view returns (bool) {
        return authorizedValidator[_signer];
    }

    /**
     * @notice Mengecek status verifikasi sebuah dokumen berdasarkan hash-nya
     * @param _docHash Hash dokumen (bytes32)
     * @return bool True jika dokumen sudah terverifikasi di blockchain
     */
    function checkDocument(bytes32 _docHash) external view returns (bool) {
        return verifiedDocuments[_docHash];
    }

    /**
     * @notice Mendapatkan Domain Separator yang digunakan untuk EIP-712
     * @return bytes32 Hash domain separator
     */
    function getDomainSeparator() public view returns (bytes32) {
        return _domainSeparatorV4();
    }
}
