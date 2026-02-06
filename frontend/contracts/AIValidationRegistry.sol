// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AIValidationRegistry is Ownable {
    struct AIValidation {
        bytes32 imageHash;
        bytes32 captionHash;
        uint8 score;
        bytes32 enclaveAttestation; // Link to EnclaveAttestationRegistry or direct hash
        string ipfsCID;
        string taskId; // iExec task ID
    }

    // receiptId -> AIValidation
    mapping(bytes32 => AIValidation) public aiValidations;

    event AIValidationRegistered(
        bytes32 indexed receiptId,
        bytes32 imageHash,
        bytes32 captionHash,
        uint8 score,
        string taskId
    );

    function registerAIValidation(
        bytes32 receiptId,
        bytes32 imageHash,
        bytes32 captionHash,
        uint8 score,
        bytes32 enclaveAttestation,
        string calldata ipfsCID,
        string calldata taskId
    ) external {
        require(aiValidations[receiptId].imageHash == bytes32(0), "Validation already registered");
        require(score <= 100, "Score must be 0-100");

        aiValidations[receiptId] = AIValidation({
            imageHash: imageHash,
            captionHash: captionHash,
            score: score,
            enclaveAttestation: enclaveAttestation,
            ipfsCID: ipfsCID,
            taskId: taskId
        });

        emit AIValidationRegistered(receiptId, imageHash, captionHash, score, taskId);
    }

    function getAIValidation(bytes32 receiptId) external view returns (AIValidation memory) {
        return aiValidations[receiptId];
    }
}
