import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ResponsiveAppBar from "@/components/appbar";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import ClientWalletProvider from "@/components/contexts/ClientWalletProvider";
import { NETWORK } from "@/utils/endpoints";
import "@/styles/App.css";
import { Toaster } from "react-hot-toast";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <>
      <ConnectionProvider endpoint={NETWORK}>
        <ClientWalletProvider wallets={wallets}>
          <ReactUIWalletModalProviderDynamic>
            <Toaster reverseOrder={true} />
                <ResponsiveAppBar/>
                <Component {...pageProps} />
          </ReactUIWalletModalProviderDynamic>
        </ClientWalletProvider>
      </ConnectionProvider>
    </>
  );
}
