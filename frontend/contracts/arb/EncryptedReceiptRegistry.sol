// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


contract EncryptedReceiptRegistry {
    struct Receipt {
        bytes32 id;
        string ipfsCID;
        bytes32 merkleRoot;
        bytes32 attestationHash;
        uint256 registeredAt;
        uint256 attestedAt;
        address uploader;
    }


    mapping(bytes32 => Receipt) public receipts;


    event ReceiptRegistered(bytes32 indexed receiptId, string ipfsCID, bytes32 merkleRoot, address indexed uploader, uint256 ts);
    event ReceiptAttested(bytes32 indexed receiptId, bytes32 attestationHash, address indexed attestor, uint256 ts);


    function computeReceiptId(string calldata ipfsCID, address uploader) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(ipfsCID, "|", toAsciiString(uploader)));
    }


    function registerEncryptedReceipt(bytes32 receiptId, string calldata ipfsCID, bytes32 merkleRoot) external {
        require(receipts[receiptId].id == bytes32(0), "already registered");
        bytes32 expected = computeReceiptId(ipfsCID, msg.sender);
        require(expected == receiptId, "receiptId mismatch");
        receipts[receiptId] = Receipt(receiptId, ipfsCID, merkleRoot, bytes32(0), block.timestamp, 0, msg.sender);
        emit ReceiptRegistered(receiptId, ipfsCID, merkleRoot, msg.sender, block.timestamp);
    }


    function updateAttestation(bytes32 receiptId, bytes32 attestationHash) external {
        require(receipts[receiptId].id != bytes32(0), "not registered");
        require(receipts[receiptId].attestationHash == bytes32(0), "already attested");
        receipts[receiptId].attestationHash = attestationHash;
        receipts[receiptId].attestedAt = block.timestamp;
        emit ReceiptAttested(receiptId, attestationHash, msg.sender, block.timestamp);
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint160(x) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(abi.encodePacked("0x", s));
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}