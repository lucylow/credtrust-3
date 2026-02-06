import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

// WalletConnect Project ID - Get your free ID at https://cloud.walletconnect.com
// This is a publishable key, safe to include in client code
const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64";

export const config = getDefaultConfig({
  appName: "CredTrust",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [arbitrumSepolia],
  ssr: false,
});

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
