// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

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

    /**
     * @notice Inisialisasi kontrak Tasdiqi, deployer otomatis sebagai owner
     */
    constructor() EIP712("Tasdiqi-UNIDA", "1") {
        _authorizedValidator[msg.sender] = true;
    }

    /// @notice Struktur data Dokumen untuk informasi dokumen yang akan diverifikasi
    struct Document {
        string documentNumber;
        bytes32 identityHash;
        bytes32 fileHash;
    }

    struct RegisteredDocument {
        bytes32 documentKey;
        string documentNumber;
        bytes32 identityHash;
        bytes32 fileHash;
        address signer;
        uint256 registeredAt;
    }

    /**
     * @dev Hash TypeHash Document sesuai standar EIP-712.
     * Digunakan untuk membangun structHash saat proses verifikasi tanda tangan.
     */
    bytes32 private constant _DOCUMENT_TYPEHASH =
        keccak256(
            "Document(string documentNumber,bytes32 identityHash,bytes32 fileHash)"
        );

    /// @notice Mapping alamat wallet yang digunakan sebagai Validator (Single of Authority)
    mapping(address => bool) private _authorizedValidator;
    mapping(bytes32 => RegisteredDocument) private _documents;

    /// @notice Event yang dipicu saat dokumen baru berhasil didaftarkan ke blockchain
    event DocumentIssued(
        bytes32 indexed documentKey,
        bytes32 indexed identityHash,
        bytes32 indexed fileHash,
        string documentNumber,
        address signer,
        uint256 timestamp
    );
    /// @notice Event yang dipicu saat status otorisasi seorang validator berubah
    event ValidatorDocumentChanged(address indexed validator, bool status);

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
        /// @notice hasil hash setelah proses eip-712 berhasil. ini buat verifikasi juga
        bytes32 documentKey = generateDocumentKey(
            doc.identityHash,
            doc.fileHash
        );

        require(
            _documents[documentKey].registeredAt == 0,
            "Tasdiqi: Dokumen sudah terregistrasi di jaringan Blockchain."
        );

        // membungkus semua variable sesuai dengan doc type
        bytes32 structHash = keccak256(
            abi.encode(
                _DOCUMENT_TYPEHASH,
                keccak256(bytes(doc.documentNumber)),
                doc.identityHash,
                doc.fileHash
            )
        );

        // baru di hash
        bytes32 hash = _hashTypedDataV4(structHash);
        // pencocokan berdasarkan signature
        address signer = hash.recover(signature);

        require(
            isAuthorizedValidator(signer),
            "Tasdiqi: Tanda tangan tidak sah"
        );

        _documents[documentKey] = RegisteredDocument({
            documentKey: documentKey,
            documentNumber: doc.documentNumber,
            identityHash: doc.identityHash,
            fileHash: doc.fileHash,
            signer: signer,
            registeredAt: block.timestamp
        });

        emit DocumentIssued(
            documentKey,
            doc.identityHash,
            doc.fileHash,
            doc.documentNumber,
            signer,
            block.timestamp
        );
    }

    /**
     * @notice function untuk mengecek document ada atau tidak di blockchain
     */
    function getDocument(
        bytes32 documentKey
    )
        external
        view
        returns (
            string memory documentNumber,
            bytes32 identityHash,
            bytes32 fileHash,
            address signer,
            uint256 registeredAt
        )
    {
        RegisteredDocument memory document = _documents[documentKey];

        require(document.registeredAt > 0, "Tasdiqi: Document not Found");

        return (
            document.documentNumber,
            document.identityHash,
            document.fileHash,
            document.signer,
            document.registeredAt
        );
    }

    /**
     * @notice helper function untuk hash documentKet
     * @param identityHash  identityHash parameter dari issuedDocument
     * @param fileHash fileHash parameter dari issuedDocument
     */
    function generateDocumentKey(
        bytes32 identityHash,
        bytes32 fileHash
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(identityHash, fileHash));
    }

    /**
     * @notice Mengatur status otorisasi validator (Hanya untuk Owner)
     * @param validator Alamat wallet validator yang akan diatur
     * @param status Status otorisasi (true untuk aktif, false untuk non-aktif)
     */
    function setValidator(address validator, bool status) external onlyOwner {
        _authorizedValidator[validator] = status;
        emit ValidatorDocumentChanged(validator, status);
    }

    /**
     * @notice Mengecek apakah sebuah alamat adalah validator resmi
     * @param validator Alamat wallet yang ingin dicek
     * @return bool True jika alamat tersebut adalah validator resmi
     */
    function isAuthorizedValidator(
        address validator
    ) public view returns (bool) {
        return _authorizedValidator[validator];
    }

    /**
     * @notice Mendapatkan Domain Separator yang digunakan untuk EIP-712
     * @return bytes32 Hash domain separator
     */
    function getDomainSeparator() public view returns (bytes32) {
        return _domainSeparatorV4();
    }
}
