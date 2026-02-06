# sgx/credit-agent.sgx.py - SGX Production (192MB limit)
import sys, json
from sklearn.ensemble import RandomForestClassifier
import numpy as np

class SGXCreditScorer:
    def __init__(self):
        # Lightweight model for SGX memory constraints
        self.model = RandomForestClassifier(n_estimators=50)  # Reduced
        
    def score_wallet(self, wallet_data):
        # Memory-optimized feature extraction
        features = np.array([
            wallet_data.get('tx_count', 0) / 1000,
            wallet_data.get('tx_volume_usd', 0) / 1e6,
            wallet_data.get('wallet_age_days', 0) / 365
        ])
        
        prediction = self.model.predict_proba([features])[0][1]
        score = int(prediction * 550 + 300)
        
        return {
            "framework": "SGX",
            "score": score,
            "tier": "A" if score >= 750 else "B" if score >= 650 else "C",
            "sgx": True,
            "memory_optimized": True
        }

if __name__ == "__main__":
    try:
        raw_input = sys.stdin.read()
        if not raw_input:
            input_data = {}
        else:
            input_data = json.loads(raw_input)
    except Exception:
        input_data = {}
        
    scorer = SGXCreditScorer()
    # Mocking training for the sake of example if no data is provided or just to make predict_proba work
    # In a real scenario, the model would be pre-trained and loaded.
    # For this demo, we'll just ensure it can return a score.
    X_train = np.random.rand(10, 3)
    y_train = np.random.randint(0, 2, 10)
    scorer.model.fit(X_train, y_train)
    
    result = scorer.score_wallet(input_data)
    
    with open('/iexec_out/result.json', 'w') as f:
        json.dump(result, f)
    print(json.dumps(result))
