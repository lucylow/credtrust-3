// src/confidential/ProtectedData.ts - ZIP Borsh decryption
// Note: @iexec/dataprotector-deserializer API may vary by version

export class ConfidentialProtectedData {
  private deserializer: any = null;

  async initialize() {
    try {
      const { IExecDataProtectorDeserializer } = await import('@iexec/dataprotector-deserializer');
      this.deserializer = new IExecDataProtectorDeserializer();
    } catch (e) {
      console.warn('dataprotector-deserializer not available');
    }
  }

  async deserializeWalletData(): Promise<any> {
    if (!this.deserializer) {
      console.warn('Deserializer not initialized');
      return {};
    }

    const datasetPath = `${process.env.IEXEC_IN}/${process.env.IEXEC_DATASET_FILENAME}`;
    
    console.log('🔓 Deserializing protected wallet data:', datasetPath);
    
    // The API method may be 'deserialize' or 'getValue' depending on version
    const walletData = this.deserializer.deserialize 
      ? await this.deserializer.deserialize({
          protectedDataPath: datasetPath,
          schema: {
            address: 'string',
            privateKey: 'string',
            txHistory: { 0: 'object', 1: 'object', length: 'u64' },
            balances: { ETH: 'f64', USDC: 'f64' },
            defiPositions: 'map',
            creditHistory: 'array'
          }
        })
      : await this.deserializer.getValue(datasetPath);

    console.log('✅ Deserialized fields:', Object.keys(walletData || {}));
    return walletData;
  }
}