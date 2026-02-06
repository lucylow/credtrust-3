import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WalletConnector() {
  const { isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  
  const isWrongNetwork = isConnected && chain?.id !== arbitrumSepolia.id;

  const handleSwitchNetwork = () => {
    switchChain({ chainId: arbitrumSepolia.id });
  };

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
              onClick={handleSwitchNetwork}
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

      <ConnectButton 
        showBalance={false}
        chainStatus="icon"
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "full",
        }}
      />
    </div>
  );
}
