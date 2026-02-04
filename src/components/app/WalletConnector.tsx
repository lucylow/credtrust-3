import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/utils/encryption';
import { Wallet, LogOut, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function WalletConnector() {
  const { wallet, isConnecting, error, connect, disconnect, switchToArbitrumSepolia, isWrongNetwork } = useWallet();

  const handleCopyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success('Address copied to clipboard');
    }
  };

  const handleViewExplorer = () => {
    if (wallet.address) {
      window.open(`https://sepolia.arbiscan.io/address/${wallet.address}`, '_blank');
    }
  };

  if (!wallet.isConnected) {
    return (
      <Button
        onClick={connect}
        disabled={isConnecting}
        variant="hero"
        size="lg"
        className="gap-2"
      >
        <Wallet className="h-5 w-5" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <AnimatePresence>
        {isWrongNetwork && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Button
              onClick={switchToArbitrumSepolia}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Switch to Arbitrum Sepolia
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            {formatAddress(wallet.address!)}
          </span>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={handleCopyAddress}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Copy address"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={handleViewExplorer}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="View on explorer"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      <Button
        onClick={disconnect}
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
}
