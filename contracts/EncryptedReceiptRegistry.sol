// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// EncryptedReceiptRegistry
/// Minimal on-chain registry for encrypted batches
contract EncryptedReceiptRegistry {
    struct Receipt {
        bytes32 id;
        string ipfsCID; // ipfs://CID or file:// path for demo
        bytes32 merkleRoot; // commitment to batch rows
        bytes32 attestationHash; // keccak256(attestation JSON)
        uint256 registeredAt;
        uint256 attestedAt;
        address uploader;
    }

    mapping(bytes32 => Receipt) public receipts;

    event ReceiptRegistered(bytes32 indexed receiptId, string ipfsCID, bytes32 merkleRoot, address indexed uploader, uint256 ts);
    event ReceiptAttested(bytes32 indexed receiptId, bytes32 attestationHash, address indexed attestor, uint256 ts);

    // compute deterministic receipt id used by clients
    function computeReceiptId(string calldata ipfsCID, address uploader) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(ipfsCID, "|", toAsciiString(uploader)));
    }

    function registerEncryptedReceipt(bytes32 receiptId, string calldata ipfsCID, bytes32 merkleRoot) external {
        require(receipts[receiptId].id == bytes32(0), "already registered");
        // ensure uploader computed the id correctly
        bytes32 expected = computeReceiptId(ipfsCID, msg.sender);
        require(expected == receiptId, "receiptId mismatch");
        receipts[receiptId] = Receipt({
            id: receiptId,
            ipfsCID: ipfsCID,
            merkleRoot: merkleRoot,
            attestationHash: bytes32(0),
            registeredAt: block.timestamp,
            attestedAt: 0,
            uploader: msg.sender
        });
        emit ReceiptRegistered(receiptId, ipfsCID, merkleRoot, msg.sender, block.timestamp);
    }

    // Attestor/relayer updates attestation anchor; single update allowed
    function updateAttestation(bytes32 receiptId, bytes32 attestationHash) external {
        require(receipts[receiptId].id != bytes32(0), "not registered");
        Receipt storage r = receipts[receiptId];
        require(r.attestationHash == bytes32(0), "already attested");
        r.attestationHash = attestationHash;
        r.attestedAt = block.timestamp;
        emit ReceiptAttested(receiptId, attestationHash, msg.sender, block.timestamp);
    }

    // helper: convert address to ascii hex string
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(42);
        s[0] = '0';
        s[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2 ** (8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i + 2] = char(hi);
            s[2*i + 3] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        return bytes1(uint8(b) + 0x57);
    }
}
