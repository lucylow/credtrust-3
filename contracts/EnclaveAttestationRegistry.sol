// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// EnclaveAttestationRegistry
/// - Stores attestation anchors submitted from off-chain (attestationHash + meta)
/// - Verifies ECDSA signatures over structured input using OpenZeppelin ECDSA
/// - Prevents replay via per-attestor nonce mapping
/// - Rejects attestations older than expirySeconds (settable by owner)
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract EnclaveAttestationRegistry is Ownable {
    using ECDSA for bytes32;

    struct Attestation {
        bytes32 attestationHash;
        address signer; // attestor/enclave public address
        bytes32 mrenclave; // optional, 32 bytes
        uint256 timestamp;
    }

    // mapping receiptId -> Attestation
    mapping(bytes32 => Attestation) public attestations;

    // used nonces per signer to prevent replay
    mapping(address => mapping(uint256 => bool)) public usedNonce;

    // expiry for attestations (seconds)
    uint256 public expirySeconds = 86400; // default 1 day

    event AttestationSubmitted(bytes32 indexed receiptId, bytes32 attestationHash, address indexed signer, bytes32 mrenclave, uint256 timestamp);

    constructor(uint256 _expirySeconds) {
        expirySeconds = _expirySeconds;
    }

    function setExpirySeconds(uint256 secs) external onlyOwner {
        expirySeconds = secs;
    }

    /// Submit an attestation to be anchored on-chain
    /// params:
    /// - receiptId: the deterministic receipt id for the processed dataset
    /// - attestationHash: keccak256(attestationJSON) — short hash anchor
    /// - nonce: per-signer unique nonce (prevent replay)
    /// - timestamp: unix time (seconds) when attestation was created
    /// - mrenclave: optional 32-byte MRENCLAVE / measurement
    /// - signature: ECDSA signature of the encoded fields (see _messageHash)
    function submitAttestation(
        bytes32 receiptId,
        bytes32 attestationHash,
        uint256 nonce,
        uint256 timestamp,
        bytes32 mrenclave,
        bytes calldata signature
    ) external {
        // Basic check: not already attested
        require(attestations[receiptId].timestamp == 0, "already attested");

        // Check timestamp freshness
        uint256 nowTs = block.timestamp;
        require(timestamp <= nowTs + 300, "timestamp in future");
        require(nowTs <= timestamp + expirySeconds, "attestation expired");

        // Recover signer
        bytes32 h = _messageHash(receiptId, attestationHash, nonce, timestamp, mrenclave, address(this));
        address signer = h.toEthSignedMessageHash().recover(signature);

        // check nonce
        require(!usedNonce[signer][nonce], "nonce used");
        usedNonce[signer][nonce] = true;

        // store attestation anchor
        attestations[receiptId] = Attestation({ attestationHash: attestationHash, signer: signer, mrenclave: mrenclave, timestamp: timestamp });

        emit AttestationSubmitted(receiptId, attestationHash, signer, mrenclave, timestamp);
    }

    /// compute the message hash that should be signed by enclave
    function _messageHash(
        bytes32 receiptId,
        bytes32 attestationHash,
        uint256 nonce,
        uint256 timestamp,
        bytes32 mrenclave,
        address registryAddress
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(receiptId, attestationHash, nonce, timestamp, mrenclave, registryAddress));
    }

    /// Helper to check if a particular nonce was used by signer
    function isNonceUsed(address signer, uint256 nonce) external view returns (bool) {
        return usedNonce[signer][nonce];
    }

    /// get attestation anchor for a receipt
    function getAttestation(bytes32 receiptId) external view returns (bytes32 attHash, address signerAddr, bytes32 mrenclave, uint256 ts) {
        Attestation memory a = attestations[receiptId];
        return (a.attestationHash, a.signer, a.mrenclave, a.timestamp);
    }
}
