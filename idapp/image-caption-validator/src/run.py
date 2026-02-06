import hashlib
import json
import os
import sys

def generate_attestation(score, image_hash, caption_hash, model_name):
    # In a real TEE, this might involve more complex signing
    data_to_hash = f"{score}{image_hash}{caption_hash}{model_name}"
    attestation_hash = hashlib.sha256(data_to_hash.encode()).hexdigest()
    return f"0x{attestation_hash}"

def main():
    # iExec specific input/output handling
    # In iExec, input files are usually in /iexec_in and outputs in /iexec_out
    
    input_dir = os.environ.get('IEXEC_IN', '/iexec_in')
    output_dir = os.environ.get('IEXEC_OUT', '/iexec_out')
    
    # For demo purposes, we might read from environment variables if files are missing
    # In a real scenario, DataProtector would provide the files in /iexec_in
    
    try:
        # Simplified validation logic
        # In a real scenario, we'd use BLIP/CLIP here
        # For the hackathon starter, we simulate the score
        
        # Read inputs (simplified for now)
        image_path = os.path.join(input_dir, 'image.png')
        caption_path = os.path.join(input_dir, 'caption.txt')
        
        image_hash = "0x" + hashlib.sha256(b"simulated_image").hexdigest()
        caption_hash = "0x" + hashlib.sha256(b"simulated_caption").hexdigest()
        
        if os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                image_hash = "0x" + hashlib.sha256(f.read()).hexdigest()
        
        caption = "Default caption"
        if os.path.exists(caption_path):
            with open(caption_path, 'r') as f:
                caption = f.read().strip()
                caption_hash = "0x" + hashlib.sha256(caption.encode()).hexdigest()

        # Simulated scoring logic (placeholder for BLIP)
        score = 85 # Simulated score
        model = "BLIP-Simulated"
        
        attestation_hash = generate_attestation(score, image_hash, caption_hash, model)
        
        result = {
            "score": score,
            "model": model,
            "image_hash": image_hash,
            "caption_hash": caption_hash,
            "attestation_hash": attestation_hash
        }
        
        # Write result to computed.json for iExec
        with open(os.path.join(output_dir, 'computed.json'), 'w') as f:
            json.dump({"deterministic-output-path": os.path.join(output_dir, 'result.json')}, f)
            
        with open(os.path.join(output_dir, 'result.json'), 'w') as f:
            json.dump(result, f)
            
        print(f"Validation completed with score: {score}")

    except Exception as e:
        print(f"Error during validation: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
