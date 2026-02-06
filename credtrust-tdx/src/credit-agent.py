# src/credit-agent.py - Lift-and-shift ML scoring
import sys
import json
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
import joblib

class TDXCreditScorer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = self.load_model()
    
    def load_model(self):
        """Load pre-trained credit model (TDX decrypts from SMS)"""
        # In production: model from IEXEC_DATASET_SECRET
        model = RandomForestClassifier(n_estimators=100)
        # Simulate pre-trained weights
        return model
    
    def score_wallet(self, wallet_data):
        """Main scoring function - runs in TDX Trust Domain"""
        features = self.extract_features(wallet_data)
        scaled_features = self.scaler.transform([features])
        
        # TDX ML prediction (confidential!)
        prediction = self.model.predict_proba(scaled_features)[0][1]
        score = int(prediction * 550 + 300)  # Scale 300-850
        
        tier = self.get_tier(score)
        
        return {
            "wallet": wallet_data["address"],
            "score": score,
            "tier": tier,
            "confidence": float(prediction),
            "features": {
                "tx_count": features[0],
                "tx_volume": features[1],
                "wallet_age": features[2]
            },
            "tdx": {
                "mrenclave": os.environ.get("IEXEC_MRENCLAVE", "0x..."),
                "trust_domain": True
            }
        }
    
    def extract_features(self, wallet_data):
        """Feature engineering from wallet data"""
        return [
            wallet_data.get("tx_count", 0),
            wallet_data.get("tx_volume_usd", 0) / 1000000,  # Normalized
            wallet_data.get("wallet_age_days", 0) / 365     # Years
        ]
    
    def get_tier(self, score):
        if score >= 750: return "A"
        elif score >= 650: return "B"
        elif score >= 550: return "C"
        else: return "D"

def main():
    """TDX iExec Entrypoint"""
    print("🚀 CredTrust TDX Credit Agent starting in Trust Domain...")
    
    # Read IExec stdin (wallet data)
    stdin_data = sys.stdin.read()
    input_data = json.loads(stdin_data)
    
    scorer = TDXCreditScorer()
    result = scorer.score_wallet(input_data)
    
    # Write TDX-attested output
    output_path = "/iexec_out/credit_score.json"
    if not os.path.exists("/iexec_out"):
        os.makedirs("/iexec_out")
        
    with open(output_path, "w") as f:
        json.dump(result, f, indent=2)
    
    # Stdout for logs
    print(f"✅ Credit score: {result['score']} ({result['tier']}-Tier)")
    print(f"📱 Wallet: {result['wallet'][:10]}...")
    sys.stdout.flush()

if __name__ == "__main__":
    main()
