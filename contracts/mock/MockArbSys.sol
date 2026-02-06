// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


/// @title MockArbSys - Local mock of Arbitrum ArbSys sendTxToL1
/// Emits an OutboxMessage event with destination and data so an off-chain relayer can execute the L1 call.
contract MockArbSys {
    event OutboxMessage(uint256 indexed outId, address indexed destination, bytes data);


    uint256 public nextOutId = 1;


    /// Simulate sending a message to L1 by emitting an event containing the raw calldata.
    /// Returns a monotonically increasing outId.
    function sendTxToL1(address destination, bytes calldata data) external payable returns (uint256) {
        uint256 id = nextOutId++;
        emit OutboxMessage(id, destination, data);
        return id;
    }
}