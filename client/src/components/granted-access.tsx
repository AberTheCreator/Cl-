import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";

interface GrantedAccessProps {
  
  tokenBalance?: number | null;
  loading?: boolean;
}

export function formatBalance(balance?: number | null): string {
  const num = typeof balance === "number" && !Number.isNaN(balance) ? balance : 0;
  
  const formatted = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(num);
  return formatted;
}

export function GrantedAccess({ tokenBalance = 0, loading = false }: GrantedAccessProps) {
  const { publicKey, disconnect } = useWallet();
  
  const address = publicKey ? publicKey.toBase58() : null;

  const [copied, setCopied] = useState(false);
  const [memberSince, setMemberSince] = useState<Date | null>(null);

  
  useEffect(() => {
    if (!address) {
      setMemberSince(null);
      return;
    }

    try {
      const key = `memberSince-${address}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = new Date(stored);
        if (!Number.isNaN(parsed.getTime())) setMemberSince(parsed);
      } else {
        const now = new Date();
        localStorage.setItem(key, now.toISOString());
        setMemberSince(now);
      }
    } catch (err) {
      
      console.warn("Could not read/write memberSince in localStorage:", err);
    }
  }, [address]);

  
  const handleCopyAddress = useCallback(async () => {
    if (!address) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        
        const ta = document.createElement("textarea");
        ta.value = address;
       
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
     
      console.error("Failed to copy address:", err);
    }
  }, [address]);

  
  const handleDisconnect = useCallback(() => {
    if (typeof disconnect !== "function") return;
    if (confirm("Are you sure you want to disconnect your wallet?")) {
      try {
        disconnect();
      } catch (err) {
       
        console.error("Error during disconnect:", err);
      }
    }
  }, [disconnect]);

  
  const safeBalance = typeof tokenBalance === "number" && !Number.isNaN(tokenBalance) ? tokenBalance : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-8 glow-effect">
        <h2 className="text-3xl font-bold mb-6 text-center">Access Granted</h2>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2l4 -4M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
              />
            </svg>
          </div>

          <p className="text-lg text-white/80">
            {loading ? "Loading..." : `${formatBalance(safeBalance)} tokens`}
          </p>
        </div>

        {address && (
          <div className="bg-white/5 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Connected Wallet</p>
                <p className="font-mono text-white/80" data-testid="text-wallet-address">
                  {address.slice(0, 4)}...{address.slice(-4)}
                </p>
              </div>
              <Button
                onClick={handleCopyAddress}
                className="ml-4 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                aria-label="Copy wallet address"
                data-testid="button-copy-address"
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5">
            <h4 className="font-semibold mb-2">Exclusive Content</h4>
            <p className="text-white/70 text-sm">Access members-only articles, videos, and resources.</p>
            <Button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors" data-testid="button-view-events">View Events</Button>
          </div>

          <div className="p-4 rounded-xl bg-white/5">
            <h4 className="font-semibold mb-2">Community Access</h4>
            <p className="text-white/70 text-sm">Join our private community and connect with other members.</p>
            <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors" data-testid="button-access-library">Access Library</Button>
          </div>

          <div className="p-4 rounded-xl bg-white/5">
            <h4 className="font-semibold mb-2">Early Features</h4>
            <p className="text-white/70 text-sm">Get early access to new features before public release.</p>
            <Button className="mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors" data-testid="button-join-discussion">Join Discussion</Button>
          </div>

          <div className="p-4 rounded-xl bg-white/5">
            <h4 className="font-semibold mb-2">Special Rewards</h4>
            <p className="text-white/70 text-sm">Unlock rewards and benefits exclusive to members.</p>
            <Button className="mt-3 bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors" data-testid="button-view-rewards">View Rewards</Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-white/50">Member Since: {memberSince?.toLocaleDateString() || "-"}</p>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="text-red-400 border-red-400 hover:bg-red-500/10"
            data-testid="button-disconnect"
          >
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
}

if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "test") {
  try {
    console.assert(formatBalance(1234.567) === "1,234.57", "formatBalance should round to 2 decimals");
    console.assert(formatBalance(0) === "0", "formatBalance zero");
    console.assert(formatBalance(undefined) === "0", "formatBalance undefined -> 0");
    console.assert(formatBalance(null) === "0", "formatBalance null -> 0");
    console.assert(formatBalance(NaN) === "0", "formatBalance NaN -> 0");
    console.assert(formatBalance(-1234.567) === "-1,234.57", "formatBalance negative numbers");
    
    console.log("GrantedAccess: formatBalance tests passed");
  } catch (err) {
   
    console.error("GrantedAccess: formatBalance tests failed", err);
  }
}
