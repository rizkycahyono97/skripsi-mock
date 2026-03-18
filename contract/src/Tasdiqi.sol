// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.33;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tasdiqi is EIP712, Ownable {
    using ECDSA for bytes32;

    // stuktur dokumen
    struct Document {
        string nomor_surat;
        string nim;
        bytes32 doc_hash;
    }

    // type untuk stuktur document
    bytes32 private constant DOCUMENT_TYPEHASH =
        keccak256("Document(string nomor_surat,string nim,bytes32 doc_hash)");

    // mapping jika document berhasil, dari hash => bool
    mapping(bytes32 => bool) public verifiedDocuments;

    event DocumentIssued(
        bytes32 indexed docHash,
        string nomorSurat,
        address indexed signer
    );

    constructor(
        address initialOwner
    ) EIP712("Tasdiqi-UNIDA", "1") Ownable(initialOwner) {}

    /**
     *
     */
    function issueDocument(
        Document calldata doc,
        bytes calldata signature
    ) external {
        require(
            !verifiedDocuments[doc.doc_hash],
            "Tasdiqi: Dokumen sudah terdaftar di Blockchain."
        );

        // hashtype + data
        bytes32 structHash = keccak256(
            abi.encode(
                DOCUMENT_TYPEHASH,
                keccak256(bytes(doc.nomor_surat)),
                keccak256(bytes(doc.nim)),
                doc.doc_hash
            )
        );

        // gabung domain separator + stuctHash
        bytes32 hash = _hashTypedDataV4(structHash);

        // signature => signer
        address signer = hash.recover(signature);

        require(
            isAuthorizedSigner(signer),
            "Tasdiqi: Tanda tangan tidak sah atau bukan dari biro"
        );

        verifiedDocuments[doc.doc_hash] = true;

        emit DocumentIssued(doc.doc_hash, doc.nomor_surat, signer);
    }

    // bisa mapping jika signer(biro) banyak
    function isAuthorizedSigner(address _signer) public view returns (bool) {
        return _signer == owner();
    }

    function checkDocument(bytes32 _docHash) external view returns (bool) {
        return verifiedDocuments[_docHash];
    }
}
