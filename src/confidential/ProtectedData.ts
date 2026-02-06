// src/confidential/ProtectedData.ts - ZIP Borsh decryption
import { IExecDataProtectorDeserializer } from '@iexec/dataprotector-deserializer';

export class ConfidentialProtectedData {
  private deserializer = new IExecDataProtectorDeserializer();

  async deserializeWalletData(): Promise<any> {
    const datasetPath = `${process.env.IEXEC_IN}/${process.env.IEXEC_DATASET_FILENAME}`;
    
    console.log('🔓 Deserializing protected wallet data:', datasetPath);
    
    const walletData = await this.deserializer.deserialize({
      protectedDataPath: datasetPath,
      schema: {
        address: 'string',
        privateKey: 'string',        // Confidential private key
        txHistory: {                 // Array structure
          0: 'object',
          1: 'object',
          length: 'u64'
        },
        balances: {                  // Map structure
          ETH: 'f64',
          USDC: 'f64'
        },
        defiPositions: 'map',
        creditHistory: 'array'
      }
    });

    console.log('✅ Deserialized fields:', Object.keys(walletData));
    return walletData;
  }
}
