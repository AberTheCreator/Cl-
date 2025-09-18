import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { WalletConnect } from "@/components/wallet-connect";
import { InsufficientTokens } from "@/components/insufficient-tokens";
import { GrantedAccess } from "@/components/granted-access";
import { checkTokenBalance } from "@/lib/solana";

export default function Home() {
  const { connected, publicKey } = useWallet();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiredTokens = 1;

  useEffect(() => {
    if (connected && publicKey) {
      const fetchBalance = async () => {
        setLoading(true);
        setError(null);
        try {
          const balance = await checkTokenBalance(publicKey);
          setTokenBalance(balance);
        } catch (err) {
          console.error("Error checking token balance:", err);
          setError("Failed to check token balance");
          setTokenBalance(0);
        } finally {
          setLoading(false);
        }
      };
      
      fetchBalance();
    } else {
      setTokenBalance(0);
    }
  }, [connected, publicKey]);

  const hasInsufficientTokens = connected && tokenBalance < requiredTokens;
  const hasAccess = connected && tokenBalance >= requiredTokens;

  return (
    <div className="min-h-screen gradient-bg text-white">
      <header className="pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">Clé</h1>
            <p className="text-lg md:text-xl text-white/80 font-medium">Token-Gated Membership Platform</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {!connected && <WalletConnect />}
        {hasInsufficientTokens && (
          <InsufficientTokens 
            tokenBalance={tokenBalance} 
            loading={loading}
            error={error}
          />
        )}
        {hasAccess && (
          <GrantedAccess 
            tokenBalance={tokenBalance}
            loading={loading}
          />
        )}
      </main>

      <footer className="py-8 text-center text-white/60">
        <p className="text-sm">
          Powered by Solana • Built for the future of membership
        </p>
      </footer>
    </div>
  );
}
