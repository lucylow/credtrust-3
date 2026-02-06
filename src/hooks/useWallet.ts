import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { WalletState } from '@/types';

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: isConnecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const wallet: WalletState = {
    address: address ?? null,
    isConnected,
    chainId: chain?.id ?? null,
  };

  const handleConnect = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const switchToArbitrumSepolia = () => {
    switchChain({ chainId: arbitrumSepolia.id });
  };

  return {
    wallet,
    isConnecting,
    error: connectError?.message ?? null,
    connect: handleConnect,
    disconnect,
    switchToArbitrumSepolia,
    isWrongNetwork: isConnected && chain?.id !== arbitrumSepolia.id,
  };
}
