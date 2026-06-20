// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19; // Turunkan pragma ke 0.8.19 untuk stabilitas

// Path impor biasanya tetap sama jika menggunakan forge remappings
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tasdiqi is EIP712, Ownable {
    using ECDSA for bytes32;

    struct Document {
        string document_number;
        bytes32 identity_hash;
        bytes32 file_hash;
    }

    bytes32 private constant DOCUMENT_TYPEHASH =
        keccak256(
            "Document(string document_number,bytes32 identity_hash,bytes32 file_hash)"
        );

    mapping(bytes32 => bool) public verifiedDocuments;
    mapping(address => bool) public authorizedSigners;

    event DocumentIssued(
        bytes32 indexed identityHash,
        bytes32 indexed fileHash,
        string documentNumber,
        address indexed signer
    );
    event SignerStatusChanged(address indexed _signer, bool _status);

    constructor() EIP712("Tasdiqi-UNIDA", "1") {
        authorizedSigners[msg.sender] = true;
    }

    function issueDocument(
        Document calldata doc,
        bytes calldata signature
    ) external {
        require(
            !verifiedDocuments[doc.file_hash],
            "Tasdiqi: Dokumen sudah terdaftar."
        );

        bytes32 structHash = keccak256(
            abi.encode(
                DOCUMENT_TYPEHASH,
                keccak256(bytes(doc.document_number)),
                doc.identity_hash,
                doc.file_hash
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = hash.recover(signature);

        require(isAuthorizedSigner(signer), "Tasdiqi: Tanda tangan tidak sah");

        verifiedDocuments[doc.file_hash] = true;
        emit DocumentIssued(
            doc.identity_hash,
            doc.file_hash,
            doc.document_number,
            signer
        );
    }

    // Fungsi lainnya tetap sama
    function setSignerStatus(address _signer, bool status) external onlyOwner {
        authorizedSigners[_signer] = status;
        emit SignerStatusChanged(_signer, status);
    }

    function isAuthorizedSigner(address _signer) public view returns (bool) {
        return authorizedSigners[_signer];
    }

    function checkDocument(bytes32 _docHash) external view returns (bool) {
        return verifiedDocuments[_docHash];
    }

    function getDomainSeparator() public view returns (bytes32) {
        return _domainSeparatorV4();
    }
}
