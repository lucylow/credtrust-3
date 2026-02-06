// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


interface IMockArbSys {
    function sendTxToL1(address destination, bytes calldata data) external payable returns (uint256);
}


contract ArbitrumAttestationBridgeMock {
    IMockArbSys public arbSys;


    event L2AttestationRegistered(bytes32 indexed receiptId, bytes32 attestationHash, string ipfsCID, address indexed registrar);
    event L2ToL1Sent(bytes32 indexed receiptId, uint256 indexed outId, address indexed destination);


    constructor(address arbSysAddress) {
        arbSys = IMockArbSys(arbSysAddress);
    }


    function registerAttestationL2(bytes32 receiptId, bytes32 attestationHash, string calldata ipfsCID) external {
        emit L2AttestationRegistered(receiptId, attestationHash, ipfsCID, msg.sender);
    }


    function sendAttestationToL1(address destination, bytes32 receiptId, bytes32 attestationHash, string calldata ipfsCID) external payable returns (uint256) {
        bytes memory data = abi.encodeWithSignature(
            "receiveAttestation(bytes32,bytes32,string,address)",
            receiptId,
            attestationHash,
            ipfsCID,
            msg.sender
        );
        uint256 outId = arbSys.sendTxToL1(destination, data);
        emit L2ToL1Sent(receiptId, outId, destination);
        return outId;
    }
}