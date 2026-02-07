import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import WalletProvider from "./wallet/provider";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <App />
    </WalletProvider>
  </QueryClientProvider>
);
