import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";

interface InsufficientTokensProps {
  tokenBalance: number;
  loading: boolean;
  error: string | null;
}

export function InsufficientTokens({ tokenBalance, loading, error }: InsufficientTokensProps) {
  const { publicKey, disconnect } = useWallet();

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-red-400">Access Denied</h3>
        <p className="text-white/70 mb-6">
          You need at least 1 Clé token to access exclusive membership content.
        </p>
        
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/60">Connected Wallet:</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDisconnect}
              className="text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
              data-testid="button-disconnect"
            >
              Disconnect
            </Button>
          </div>
          <p className="text-sm font-mono text-white/90" data-testid="text-wallet-address">
            {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
          </p>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
            <span className="text-sm text-white/60">Clé Token Balance:</span>
            <span className="text-red-400 font-semibold" data-testid="text-token-balance">
              {loading ? "Loading..." : error ? "Error" : `${tokenBalance} tokens`}
            </span>
          </div>
          
          {error && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-sm text-red-400" data-testid="text-error">{error}</p>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-accent to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          data-testid="button-get-tokens"
        >
          Get Clé Tokens
        </Button>
        
        <p className="text-xs text-white/50 mt-3">
          Purchase tokens on pump.fun to unlock membership
        </p>
      </div>
    </div>
  );
}
