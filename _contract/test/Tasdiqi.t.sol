// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.33;

import {Test} from "forge-std/Test.sol";
import {Tasdiqi} from "../src/Tasdiqi.sol";

contract TasduqiTest is Test {
    Tasdiqi public tasdiqi;
    uint256 internal biroPrivateKey;
    address internal biroAddress;

    function setUp() public {
        biroPrivateKey = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;
        biroAddress = vm.addr(biroPrivateKey);

        tasdiqi = new Tasdiqi(biroAddress);
    }

    function testSuccessfullIssue() public {
        // simulasi data dokument
        Tasdiqi.Document memory doc = Tasdiqi.Document({
            nomor_surat: "DOC-TEST-001",
            nim: "442023611012",
            doc_hash: keccak256("Isi Dokumen test")
        });

        // signing document
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256(
                    "Document(string nomor_surat,string nim,bytes32 doc_hash)"
                ),
                keccak256(bytes(doc.nomor_surat)),
                keccak256(bytes(doc.nim)),
                doc.doc_hash
            )
        );

        // _hashTypeDataV4
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                tasdiqi.getDomainSeparator(),
                structHash
            )
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(biroPrivateKey, digest);
        bytes memory signature = abi.encodePacked(r, s, v);

        // kirim ke contract
        tasdiqi.issueDocument(doc, signature);

        assertTrue(tasdiqi.verifiedDocuments(doc.doc_hash));
        assertEq(tasdiqi.checkDocument(doc.doc_hash), true);
    }
}
