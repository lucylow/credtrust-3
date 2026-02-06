export const TEE_TAGS = {
  TEE: BigInt(0x1),
  TEE_SCONE: BigInt(0x3),
  TEE_GRAMINE: BigInt(0x5),
  TEE_TDX: BigInt(0x9),
};

/**
 * Combines multiple TEE tags using bitwise OR to force specific enclave execution.
 * 
 * @param tags - One or more TEE tags from TEE_TAGS
 * @returns The combined tag as a bigint
 */
export function requireTEE(...tags: bigint[]): bigint {
  return tags.reduce((a, b) => a | b, BigInt(0));
}

/**
 * Helper to check if a tag includes TEE requirement.
 */
export function isTEERequired(tag: bigint): boolean {
  return (tag & TEE_TAGS.TEE) === TEE_TAGS.TEE;
}
