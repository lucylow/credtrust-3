// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


contract L1AttestationReceiver {
    struct Attestation {
        bytes32 attestationHash;
        string ipfsCID;
        address l2Source;
        uint256 receivedAt;
    }


    mapping(bytes32 => Attestation) public attestationByReceipt;
    event AttestationReceived(bytes32 indexed receiptId, bytes32 indexed attestationHash, string ipfsCID, address l2Source, uint256 receivedAt);


    /// Called (by the real Arbitrum outbox OR by a relayer for demo) to record the attestation anchor on L1.
    function receiveAttestation(bytes32 receiptId, bytes32 attestationHash, string calldata ipfsCID, address l2Source) external {
        require(attestationByReceipt[receiptId].receivedAt == 0, "already received");
        attestationByReceipt[receiptId] = Attestation(attestationHash, ipfsCID, l2Source, block.timestamp);
        emit AttestationReceived(receiptId, attestationHash, ipfsCID, l2Source, block.timestamp);
    }
}