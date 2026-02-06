# utils.py
def format_wallet_address(address):
    if not address:
        return "Unknown"
    return f"{address[:6]}...{address[-4:]}"
