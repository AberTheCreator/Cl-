import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";

export function WalletConnect() {
  const { select, wallets } = useWallet();

  const connectWallet = async (walletName: string, downloadUrl: string) => {
    const wallet = wallets.find(w =>
      w.adapter.name.toLowerCase().includes(walletName.toLowerCase())
    );

    if (wallet) {
      await select(wallet.adapter.name);
    } else {
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-8 text-center glow-effect">
        <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
        <p className="text-white/70 mb-8 leading-relaxed">
          Connect your Phantom or Solflare wallet to access exclusive Clé
          membership content and verify your token ownership.
        </p>

        <div className="space-y-4">
          {/* Phantom */}
          <Button
            onClick={() =>
              connectWallet("phantom", "https://phantom.app/download")
            }
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Connect Phantom</span>
            </div>
          </Button>

          {/* Solflare */}
          <Button
            onClick={() =>
              connectWallet("solflare", "https://solflare.com/download")
            }
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span>Connect Solflare</span>
            </div>
          </Button>
        </div>

        <p className="text-sm text-white/50 mt-6">
          Don’t have a wallet?{" "}
          <span
            onClick={() =>
              window.open("https://solana.com/ecosystem/wallets", "_blank")
            }
            className="text-accent underline cursor-pointer"
          >
            Explore options
          </span>
        </p>
      </div>
    </div>
  );
}
